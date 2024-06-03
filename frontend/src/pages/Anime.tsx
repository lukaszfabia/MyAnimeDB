import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPlus,
  faHeart,
  faCheck,
  faHeartCrack,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/context/PrivateRoute";
import api from "../scripts/api";
import { fetchData, Review } from "../scripts";
import "../styles/favanime.css";

export interface Anime {
  id_anime: string;
  title: string;
  alternative_title: string;
  img_url: string;
  score: number;
  type: string;
  episodes: number;
  duration: string;
  genres: string[];
  status: string;
  description: string;
}

const AnimeData: React.FC<{ anime: Anime }> = ({ anime }) => {
  const [isFav, setIsFav] = useState(false);
  const [isOnUsersList, setIsOnUsersList] = useState<boolean | null>(null);
  const [communityScore, setCommunityScore] = useState<number>(0);
  const [popularity, setPopularity] = useState<number>(0);

  useEffect(() => {
    api
      .get(`/api/user/is-fav-anime/${anime.id_anime}`)
      .then((response) => setIsFav(response.status === 200))
      .catch(() => setIsFav(false));
  }, [anime.id_anime]);

  useEffect(() => {
    api
      .get(`/api/user/has-anime/${anime.id_anime}`)
      .then((response) => setIsOnUsersList(response.status === 200))
      .catch(() => setIsOnUsersList(false));
  }, [anime.id_anime]);

  useEffect(() => {
    api
      .get(`/api/anime/score/${anime.id_anime}`)
      .then((response) => {
        setCommunityScore(response.data.average_score);
        setPopularity(response.data.popularity);
      })
      .catch(() => setCommunityScore(0));
  }, [anime.id_anime]);

  const handleAddFav = () => {
    const newFavState = !isFav;
    setIsFav(newFavState);
    api
      .put(`/api/user/add-anime/${anime.id_anime}`, {
        is_favorite: newFavState,
      })
      .then((response) => {
        if (response.status !== 200) {
          setIsFav(!newFavState);
        }
      })
      .catch(() => console.log("log to get more options"));
  };

  const handleAddList = () => {
    api
      .put(`/api/user/add-anime/${anime.id_anime}`, {
        id_anime: anime.id_anime,
        state: "plan-to-watch",
        score: "0",
      })
      .then((response) => {
        if (response.status === 200) {
          setIsOnUsersList(true);
        }
      })
      .catch(() => console.log("log to get more options"));
  };

  return (
    <Container
      className="p-5"
      style={{
        backgroundColor: "rgba(255,255,255, 0.1)",
        borderRadius: "50px",
      }}
    >
      <h2 className="text-center">{anime.title}</h2>
      <span className="text-secondary">{anime.alternative_title}</span>
      <hr />
      <Row className="d-flex justify-content-center align-items-center mb-4">
        <img
          src={anime.img_url}
          alt="profile"
          className="img-fluid rounded-5"
        />
      </Row>
      <hr />
      <Row>
        <Col lg={6}>
          <h2 className="text-center">
            <strong id="idScore">{communityScore}/6</strong>
            <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
          </h2>
        </Col>
        <Col lg={6}>
          <h2 className="text-center">
            <p>
              <span className="text-secondary">#</span>
              {popularity}
            </p>
          </h2>
        </Col>
      </Row>
      <hr />
      <ProtectedRoute error={null}>
        <Row className="py-4">
          <Col
            xs={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Button variant="outline-light" onClick={handleAddFav}>
              <small>
                <FontAwesomeIcon icon={isFav ? faHeart : faHeartCrack} />
              </small>
            </Button>
          </Col>
          <Col
            xs={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Button variant="outline-light" onClick={handleAddList}>
              <small>
                <FontAwesomeIcon icon={isOnUsersList ? faMinus : faPlus} />
              </small>
            </Button>
          </Col>
        </Row>
      </ProtectedRoute>
    </Container>
  );
};

const Info: React.FC<{ anime: Anime }> = ({ anime }) => (
  <Row className="py-3">
    <h1 className="display-5">Information</h1>
    <p className="lead">
      <strong>Type:</strong> {anime.type}
    </p>
    <p className="lead">
      <strong>Episodes:</strong> {anime.episodes}
    </p>
    <p className="lead">
      <strong>Duration:</strong> {anime.duration} min
    </p>
    <p className="lead">
      <strong>Genres:</strong> {anime.genres.join(", ")}
    </p>
    <p className="lead">
      <strong>Status:</strong> {anime.status}
    </p>
  </Row>
);

const Synopsis: React.FC<{ desc: string }> = ({ desc }) => (
  <Row>
    <h1 className="display-5">Synopsis</h1>
    <p className="lead">{desc}</p>
  </Row>
);

const RatingManage: React.FC<{ id: string }> = ({ id }) => {
  const [status, setStatus] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [isOnUsersList, setIsOnUsersList] = useState<boolean | null>(null);
  const [isChangedState, setIsChangedState] = useState<boolean>(false);

  useEffect(() => {
    api
      .get(`/api/user/has-anime/${id}`)
      .then((response) => setIsOnUsersList(response.status === 200))
      .catch(() => setIsOnUsersList(false));
  }, [id]);

  useEffect(() => {
    console.log(isOnUsersList);
    if (isOnUsersList) {
      api
        .get(`/api/user/add-anime/${id}`)
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            setStatus(String(data.state).toLowerCase().replace(" ", "-"));
            setRating(data.score);
          }
        })
        .catch(console.error);
    }
  }, [id, isOnUsersList]);

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setStatus(value);
    setIsChangedState(false);
    if (value === "plan-to-watch") {
      setRating("0");
    }
  };

  const handleRatingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRating(event.target.value);
    setIsChangedState(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestData = {
      state: status !== "" ? status : "watching",
      score: rating !== "" ? rating : "0",
    };
    const creatOrUpdate = isOnUsersList ? api.put : api.post;
    creatOrUpdate(`/api/user/add-anime/${id}`, requestData)
      .then((response) => {
        setIsChangedState(response.status === 200 || response.status === 201); // XDDDDDD
      })
      .catch((error) => {
        alert("Something went wrong");
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row className="py-3">
        <Col lg={4} className="mb-2">
          <Button type="submit" variant="outline-light" id="idAddOrUpadate">
            {isChangedState ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
            {isOnUsersList ? " Update" : " Add"}
          </Button>
        </Col>
        <Col lg={4} className="mb-2">
          <Form.Select
            className="dark-select"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="dropped">Dropped</option>
            <option value="plan-to-watch">Plan to Watch</option>
          </Form.Select>
        </Col>
        <Col lg={4} className="mb-2">
          <Form.Select
            className="dark-select"
            value={rating}
            onChange={handleRatingChange}
            id="idRating"
            disabled={status === "plan-to-watch"}
          >
            <option value="0">None</option>
            <option value="1">Bad (1)</option>
            <option value="2">Boring (2)</option>
            <option value="3">Ok (3)</option>
            <option value="4">Very good (4)</option>
            <option value="5">Excellent (5)</option>
            <option value="6">Masterpiece (6)</option>
          </Form.Select>
        </Col>
      </Row>
    </form>
  );
};

const Stats: React.FC<{ anime: Anime }> = ({ anime }) => (
  <Container
    className="p-5"
    style={{ backgroundColor: "rgba(255,255,255, 0.1)", borderRadius: "50px" }}
  >
    <h1 className="display-4">Overview</h1>
    <ProtectedRoute error={null}>
      <RatingManage id={anime.id_anime} />
    </ProtectedRoute>
    <Info anime={anime} />
    <Synopsis desc={anime.description} />
    <h2 className="display-5">Characters</h2>
    <Characters id={anime.id_anime ?? ""} />
  </Container>
);

const Reviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<Review[]>([]);

  const handleSubmitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const review = new FormData(event.currentTarget).get("review") as string;
    api
      .post(`/api/anime/reviews/${id}`, { review })
      .then(() => fetchComments())
      .catch(console.error);
    event.currentTarget.reset();
  };

  const fetchComments = () => {
    api
      .get(`/api/anime/reviews/${id}`)
      .then((response) => setComments(response.data))
      .catch(console.error);
  };

  useEffect(fetchComments, [id]);

  return (
    <Container
      className="py-5 mt-5 p-4"
      style={{
        backgroundColor: "rgba(255,255,255, 0.1)",
        borderRadius: "50px",
      }}
    >
      <Row>
        <h1 className="display-4 p-3">Reviews</h1>
      </Row>
      <h3 className="lead mb-3">Add review</h3>
      <Form onSubmit={handleSubmitReview}>
        <Row className="align-items-center">
          <Col lg={10}>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              placeholder="Write your review here..."
              name="review"
              style={{ width: "100%" }}
            />
          </Col>
          <Col lg={2} className="d-flex justify-content-start">
            <Button type="submit" variant="outline-light">
              Add Review
            </Button>
          </Col>
        </Row>
      </Form>
      {comments &&
        comments.map((comment, index) => (
          <React.Fragment key={index}>
            <figure className="p-4">
              <blockquote className="blockquote">
                <p>{comment.review}</p>
              </blockquote>
              <figcaption className="blockquote-footer">
                <Link to={`/user/${comment.user}`}>{comment.user}</Link> about{" "}
                {comment.anime}
              </figcaption>
            </figure>
            <hr />
          </React.Fragment>
        ))}
    </Container>
  );
};

const Anime: React.FC = () => {
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchData(`/api/anime/${id}`)
      .then((data) => {
        if (data.status === 404) {
          navigate("/notfound");
        } else {
          setAnime(data);
        }
      })
      .catch(() => navigate("/notfound"));
  }, [id]);

  if (!anime) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <Container className="text-white py-5 mt-5">
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg={4}>
            <AnimeData anime={anime} />
          </Col>
          <Col lg={8}>
            <Stats anime={anime} />
          </Col>
        </Row>
        <ProtectedRoute error={null}>
          <Reviews />
        </ProtectedRoute>
      </Container>
      <Footer />
    </>
  );
};

function DisplayCharacters({ characters }: { characters: any }) {
  return (
    <Col lg={4} className="mb-3">
      <Card className="bg-dark text-white">
        <Card.Img
          src={`${import.meta.env.VITE_API_URL}${characters.img}`}
          alt={characters.name}
        />
        <Card.ImgOverlay>
          <div className="overlay show">
            <Card.Title className="text-center">{characters.name}</Card.Title>
            <Card.Text className="text-center">
              {characters.description}
            </Card.Text>
          </div>
        </Card.ImgOverlay>
      </Card>
    </Col>
  );
}

const Characters: React.FC<{ id: string }> = ({ id }) => {
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    api
      .get(`/api/anime/characters/${id}`)
      .then((response) => setCharacters(response.data))
      .catch(console.error);
  }, [id]);

  return (
    <Row>
      {characters.map((character: any) => (
        <DisplayCharacters
          key={character.id_character}
          characters={character}
        />
      ))}
    </Row>
  );
};

export default Anime;

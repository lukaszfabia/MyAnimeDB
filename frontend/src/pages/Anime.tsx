import { Button, Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./Navigation";
import "./favanime.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlus, faHeart, faMinus, faCheck } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import { fetchData } from "../scripts";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiddenElements } from "../components/context/PrivateRoute";
import api from "../scripts/api";

const AnimeData = ({ anime }: {
  anime: any
}) => {
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
        <h2 className="text-center">
          <strong>{anime.score}/10</strong>
          <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
        </h2>
      </Row>
      <hr />
      <HiddenElements>
        <Row className="py-4">
          <Col
            xs={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Button variant="outline-light" href="/profile/myanime">
              <small>
                <FontAwesomeIcon icon={faHeart} /> Add to fav
              </small>
            </Button>
          </Col>
          <Col
            xs={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Button variant="outline-light" href="/profile/mangalist">
              <small>
                <FontAwesomeIcon icon={faPlus} />
                Add to list
              </small>
            </Button>
          </Col>
        </Row>
      </HiddenElements>
    </Container>
  );
};

const Info = ({ anime }: { anime: any }) => {
  return (
    <Row className="py-3">
      <h1 className="display-5">Infomation</h1>
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
};

const Stats = ({ anime }: { anime: any }) => {
  return (
    <>
      <Container
        className="p-5"
        style={{
          backgroundColor: "rgba(255,255,255, 0.1)",
          borderRadius: "50px",
        }}
      >
        <h1 className="display-4">Overview</h1>
        {/* only for logged users */}
        <HiddenElements>
          <RatingManage id={anime.id_anime} />
        </HiddenElements>
        <Info anime={anime} />
        <Synopsis desc={anime.description} />
      </Container>
    </>
  );
};

const Synopsis = ({ desc }: { desc: string }) => {
  return (
    <Row>
      <h1 className="display-5">Synopsis</h1>
      <p className="lead">{desc}</p>
    </Row>
  );
};

const RatingManage = ({ id }: { id: string }) => {
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [isOnUsersList, setisOnUsersList] = useState<any>(null);

  useEffect(() => {
    api.get(`/api/user/has-anime/${id}`).then((response) => {
      if (response.status === 200) {
        setisOnUsersList(true);
      } else {
        setisOnUsersList(false);
      }
    }).catch((error) => {
      console.error(error);
      setisOnUsersList(false);
    });
  }, [id]);

  useEffect(() => {
    if (isOnUsersList) {
      api.get(`/api/user/add-anime/${id}`).then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          setStatus(String(response.data.state).toLowerCase().replace(" ", "-"));
          setRating(response.data.score);
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [id, isOnUsersList]);

  console.log(status, rating);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRating(event.target.value);
  };

  const [isChangedState, setIsChangedState] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    api.put(`/api/user/add-anime/${id}`, {
      id_anime: id,
      state: status,
      score: rating,
    }).then((response) => {
      if (response.status === 200) {
        setIsChangedState(true);
      }
    }).catch((error) => {
      alert("Something went")
      console.error(error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row className="py-3">
        <Col lg={4} className="mb-2">
          <Button type="submit" variant="outline-light">
            <FontAwesomeIcon icon={isChangedState ? faCheck : faPlus} /> {isOnUsersList ? "Update" : "Add"}
          </Button>
        </Col>
        <Col lg={4} className="mb-2">
          <select className="form-select dark-select" value={status} onChange={handleStatusChange}>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="dropped">Dropped</option>
            <option value="plan-to-watch">Plan to Watch</option>
          </select>
        </Col>
        <Col lg={4} className="mb-2">
          <select className="form-select dark-select" value={rating} onChange={handleRatingChange}>
            <option value="1">Bad (1)</option>
            <option value="2">Boring (2)</option>
            <option value="3">Ok (3)</option>
            <option value="4">Very good (4)</option>
            <option value="5">Excellent (5)</option>
            <option value="6">Masterpiece (6)</option>
          </select>
        </Col>
      </Row>
    </form>
  );
};

export default function Anime() {
  const navigate = useNavigate();
  const [anime, setAnime] = useState<any>(null);

  const { id } = useParams();

  useEffect(() => {
    fetchData(`/api/animeid/${id}`)
      .then((data) => {
        setAnime(data);
      })
      .catch((error) => {
        console.error(error);
        // navigate("/notfound");
      });
  }, [id]);

  if (!anime) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CustomNavbar />
      <Container className="text-white py-5 mt-5">
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg={4}>
            <AnimeData anime={anime} />
          </Col>
          <Col lg={8}>
            <Stats anime={anime} />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

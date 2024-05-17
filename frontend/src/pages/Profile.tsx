import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchData } from "../scripts";
import Footer from "../components/Footer";
import "./favanime.css";
import ProtectedRoute from "../components/context/PrivateRoute";
import NoPage from "./NotFoundPage";

interface ProfileDataProps {
  username: string;
  email: string;
  avatar?: string;
  bio: string;
}

const ProfileData: React.FC<ProfileDataProps> = ({ username, email, avatar, bio }) => {
  return (
    <Container
      className="p-5"
      style={{
        backgroundColor: "rgba(255,255,255, 0.1)",
        borderRadius: "50px",
      }}
    >
      <h2 className="text-center">{username}</h2>
      <hr />
      <Row className="d-flex justify-content-center align-items-center mb-4">
        <img
          src={avatar}
          alt="profile"
          className="img-fluid"
          style={{ width: "250px", height: "auto" }}
        />
      </Row>
      <hr />
      <Row>
        <h2>
          <strong>Bio</strong>
        </h2>
        <p>{bio}</p>
        <h3>
          <strong>Email</strong>
        </h3>
        <p>{email}</p>
      </Row>
      <hr />
      <ProtectedRoute error={<NoPage />}>
        <Row className="py-4">
          <Col
            xs={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Link to={`/profile/${username}/myanime`}>
              <Button variant="outline-success">
                My anime
              </Button>
            </Link>
          </Col>
          <Col
            xs={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Button variant="outline-primary">
              My manga
            </Button>
          </Col>
        </Row>
      </ProtectedRoute>
    </Container>
  );
};

interface StatsData {
  total_time: string;
  watched_episodes: string;
  fav_genres: string[];
}

const Stats: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [totalTime, setTotalTime] = useState<string>("");
  const [watchedEpisodes, setWatchedEpisodes] = useState<string>("");
  const [favGenres, setFavGenres] = useState<string>("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data: StatsData = await fetchData(`/api/user/stats/${name}`);
        setTotalTime(data.total_time + " minutes");
        setWatchedEpisodes(data.watched_episodes);
        setFavGenres(data.fav_genres.join(", "));
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [name]);

  return (
    <Container
      className="p-5"
      style={{
        backgroundColor: "rgba(255,255,255, 0.1)",
        borderRadius: "50px",
      }}
    >
      <h1 className="display-4">Statistics</h1>
      <Row>
        <HeadingForStats name="Favourite genres" text={favGenres} />
        <HeadingForStats name="Total time" text={totalTime} />
        <span></span>
        <HeadingForStats name="Watched episodes" text={watchedEpisodes} />
      </Row>
      <Row>
        <hr />
        <FavAnime />
      </Row>
    </Container>
  );
};

interface HeadingForStatsProps {
  name: string;
  text: string;
}

const HeadingForStats: React.FC<HeadingForStatsProps> = ({ name, text }) => {
  return (
    <Col>
      <h3>
        {name} <p className="lead">{text}</p>
      </h3>
    </Col>
  );
};


const AnimeTitle: React.FC<any> = ({ id, title, imgUrl }) => {
  return (
    <Col lg={4} className="mb-3">
      <Link to={`/anime/${id}`}>
        <Card className="bg-dark text-white">
          <Card.Img src={imgUrl} alt={title} className="img-fluid" />
          <Card.ImgOverlay>
            <div className="overlay show">
              <Card.Title className="text-center">{title}</Card.Title>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Link>
    </Col>
  );
};

const FavAnime: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [response, setResponse] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavouriteAnime = async () => {
      try {
        const data = await fetchData(`/api/user/fav-anime/${name}`);
        setResponse(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavouriteAnime();
  }, [name]);

  return (
    <Container>
      <h1 className="display-4">Favourite Anime</h1>
      <Row>
        {response.map((anime) => (
          <AnimeTitle
            key={anime.id_anime}
            id={anime.id_anime}
            title={anime.title}
            imgUrl={anime.img_url}
          />
        ))}
      </Row>
    </Container>
  );
};

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(`/api/user/${name}`)
      .then((data) => {
        setUsername(data.user.username);
        setEmail(data.user.email);
        setAvatar(import.meta.env.VITE_API_URL + data.avatar);
        setBio(data.bio);
      })
      .catch((error) => {
        console.error(error);
        navigate("/notfound");
      });
  }, [name, navigate]);

  return (
    <>
      <Container className="text-white py-5 mt-5">
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg={4}>
            <ProfileData
              username={username}
              email={email}
              avatar={avatar}
              bio={bio}
            />
          </Col>
          <Col lg={8}>
            <Stats />
          </Col>
        </Row>
        <Footer />
      </Container>
    </>
  );
};

export default Profile;

import { Button, Card, Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./Navigation";
import React, { useEffect, useState } from "react";
import "./favanime.css";
import Footer from "../components/Footer";
import { useParams, useSubmit } from "react-router-dom";
import { fetchData } from "../scripts";
import NoPage from "./NotFoundPage";
import api from "../scripts/api";
import axios from "axios";

const ProfileData = ({ username, email, avatar, bio }: { username: string, email: string, avatar?: string, bio: string }) => {
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
      <Row className="py-4">
        <Col
          xs={6}
          className="d-flex justify-content-center align-items-center"
        >
          <Button variant="outline-light" href="/profile/myanime">
            My anime
          </Button>
        </Col>
        <Col
          xs={6}
          className="d-flex justify-content-center align-items-center"
        >
          <Button variant="outline-light" href="/profile/mangalist">
            My manga
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

const Stats = () => {
  return (
    <>
      <Container
        className="p-5"
        style={{
          backgroundColor: "rgba(255,255,255, 0.1)",
          borderRadius: "50px",
        }}
      >
        <h1 className="display-4">Statistics</h1>
        <Row>
          <HeadingForStats name="Favourite genre" text="/genre/" />
          <HeadingForStats name="Total time" text="/time/" />
          <span></span>
          <HeadingForStats name="Watched episodes" text="/episodes/" />
        </Row>
        <Row>
          <hr />
          <FavAnime />
        </Row>
      </Container>
    </>
  );
};

const HeadingForStats = ({ name, text }: { name: string; text: string }) => {
  return (
    <Col>
      <h3>
        {name} <p className="lead">{text}</p>
      </h3>
    </Col>
  );
};

const AnimeTitle = ({ title, imgUrl }: { title: string; imgUrl: string }) => {
  return (
    <Col lg={4} className="mb-3">
      <Card className="bg-dark text-white">
        <Card.Img src={imgUrl} alt={title} className="img-fulid" />
        <Card.ImgOverlay>
          <div className="overlay show">
            <Card.Title className="text-center">{title}</Card.Title>
          </div>
        </Card.ImgOverlay>
      </Card>
    </Col>
  );
};

const FavAnime = () => {
  return (
    <Container>
      <h1 className="display-4">Favourite Anime</h1>
      <Row>
        <AnimeTitle
          title="Fullmetal Alchemist: Brotherhood"
          imgUrl="https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Fullmetal_Alchemist_Brotherhood_key_visual.png/220px-Fullmetal_Alchemist_Brotherhood_key_visual.png"
        ></AnimeTitle>
        <AnimeTitle
          title="Ano Hi Mita Hana no Namae wo Bokutachi wa Mada Shiranai."
          imgUrl="https://cdn.myanimelist.net/images/anime/5/79697.jpg"
        ></AnimeTitle>
        <AnimeTitle
          title="Oshi no ko"
          imgUrl="https://cdn.myanimelist.net/images/anime/1812/134736.jpg"
        ></AnimeTitle>
      </Row>
    </Container>
  );
};

export default function Profile() {
  const { username } = useParams<string>();
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState<string>('');

  // useEffect(() => {
  //   fetchData(`api/getuser/${username}`)
  //     .then((data) => {
  //       if (data.length === 0) {
  //         setUserNotFound(true);
  //       } else {
  //         setEmail(data.email);
  //         setAvatar("http://127.0.0.1:8000/" + data.avatar);
  //         setBio(data.bio);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user data:", error);
  //     });
  // }, [username]);

  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    api.get(`api/user-data/`, {
    })
      .then((response) => {
        console.log(response.status);
        if (response.statusText === 'Not Found') {
          return;
        }
        setEmail(response.data.user.email);
        setAvatar(`${import.meta.env.VITE_API_URL}/${response.data.avatar}`);
        setBio(response.data.bio);
      })
      .catch((error) => {
        setError(true);
      });
  }, [username]);

  if (error) {
    return <NoPage />;
  }

  // Render the rest of your component here
  // console.log(avatar)

  return (
    <>
      <Container className="text-white py-5 mt-5">
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg={4}>
            <ProfileData username={username || ''} email={email || ''} avatar={avatar || ''} bio={bio || ''} />
          </Col>
          <Col lg={8}>
            <Stats />
          </Col>
        </Row>
        <Footer />
      </Container>
    </>
  );
}

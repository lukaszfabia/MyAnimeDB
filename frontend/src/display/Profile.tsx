import { Button, Card, Col, Container, Row } from "react-bootstrap";
import LoggedNavbar from "../components/navbars/loggedNavbar";
import CustomNavbar from "../components/navbars/navbar";
import React, { useState } from "react";
import "./favanime.css";
import Footer from "../components/Footer";

const ProfileData = () => {
  return (
    <Container
      className="p-5"
      style={{
        backgroundColor: "rgba(255,255,255, 0.1)",
        borderRadius: "50px",
      }}
    >
      <h2 className="text-center">dr Piotr Napierała</h2>
      <hr />
      <Row className="d-flex justify-content-center align-items-center mb-4">
        <img
          src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
          alt="profile"
          className="rounded-circle img-fluid"
          width={150}
          height="auto"
        />
      </Row>
      <hr />
      <Row>
        <h2>
          <strong>Bio</strong>
        </h2>
        <p>wale baranka w meblo scianke</p>
        <h3>
          <strong>Email</strong>
        </h3>
        <p>/email/</p>
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
  return (
    <>
      <CustomNavbar View={LoggedNavbar} />
      <Container className="text-white py-5 mt-5">
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg={4}>
            <ProfileData />
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

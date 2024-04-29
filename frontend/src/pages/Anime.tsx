import { Button, Card, Col, Container, Row } from "react-bootstrap";
import LoggedNavbar from "../components/navbars/loggedNavbar";
import CustomNavbar from "./Navigation";
import "./favanime.css";
import NotLoggedNavbar from "../components/navbars/notloggedNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";

const AnimeData = () => {
  return (
    <Container
      className="p-5"
      style={{
        backgroundColor: "rgba(255,255,255, 0.1)",
        borderRadius: "50px",
      }}
    >
      <h2 className="text-center">Title</h2>
      <span className="text-secondary">Alternative titles</span>
      <hr />
      <Row className="d-flex justify-content-center align-items-center mb-4">
        <img
          src="https://cdn.myanimelist.net/images/anime/1079/138100.jpg"
          alt="profile"
          className="img-fluid rounded-5"
        />
      </Row>
      <hr />
      <Row>
        <h2 className="text-center">
          <strong>8.7/10</strong>
          <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
        </h2>
      </Row>
      <hr />
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
    </Container>
  );
};

const Info = () => {
  return (
    <Row className="py-3">
      <h1 className="display-5">Infomation</h1>
      <p className="lead">
        <strong>Type:</strong> TV
      </p>
      <p className="lead">
        <strong>Episodes:</strong> 37
      </p>
      <p className="lead">
        <strong>Duration:</strong> 24 min
      </p>
      <p className="lead">
        <strong>Genres:</strong> Action, Adventure, Comedy
      </p>
    </Row>
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
        <h1 className="display-4">Overview</h1>
        <RatingManage />
        <Info />
        {/* only for logged users */}
        <Synopsis />
      </Container>
    </>
  );
};

const Synopsis = () => {
  return (
    <Row>
      <h1 className="display-5">Synopsis</h1>
      <p className="lead">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. A ab ad vero
        enim veniam quidem ut, dolores amet deleniti in sit hic vel culpa, est
        libero alias natus iste consectetur.
      </p>
    </Row>
  );
};

const RatingManage = () => {
  return (
    <Row className="py-3">
      <Col lg={4} className="mb-2">
        <Button variant="outline-light">
          <FontAwesomeIcon icon={faPlus} /> Add to list
        </Button>
      </Col>
      <Col lg={4} className="mb-2">
        <select className="form-select dark-select">
          <option value="1">Watching</option>
          <option value="2">Completed</option>
          <option value="3">On Hold</option>
          <option value="4">Dropped</option>
          <option value="5">Plan to Watch</option>
        </select>
      </Col>
      <Col lg={4} className="mb-2">
        <select className="form-select dark-select">
          <option value="1">Bad (1)</option>
          <option value="2">Boring (2)</option>
          <option value="3">Ok (3)</option>
          <option value="4">Very good (4)</option>
          <option value="5">Excellent (5)</option>
          <option value="6">Masterpiece (6)</option>
        </select>
      </Col>
    </Row>
  );
};

export default function Anime() {
  return (
    <>
      <CustomNavbar />
      <Container className="text-white py-5 mt-5">
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg={4}>
            <AnimeData />
          </Col>
          <Col lg={8}>
            <Stats />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

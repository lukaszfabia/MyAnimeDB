import { useState, useEffect } from "react";
import { fetchData } from "../scripts/index";
import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "../components/navbars/navbar";
import "../App.css";
import NotLoggedNavbar from "../components/navbars/notloggedNavbar";
import LoggedNavbar from "../components/navbars/loggedNavbar";

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData("mess").then((data) => setData(data));
  }, []);
  return (
    <Container className="App">
      <Row>
        <Col>
          <CustomNavbar View={LoggedNavbar}></CustomNavbar>
        </Col>
      </Row>
      <Row className="py-5 mt-5">
        <Col>
          <h1>Home</h1>
          {data}
        </Col>
      </Row>
    </Container>
  );
}

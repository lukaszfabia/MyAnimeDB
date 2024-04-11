import { useState, useEffect } from "react";
import { fetchData } from "../scripts/index";
import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "../components/navbars/navbar";
import "../App.css";
import NotLoggedNavbar from "../components/navbars/notloggedNavbar";
import LoggedNavbar from "../components/navbars/loggedNavbar";
import WelcomeContent from "../components/carousel/Caroulsel";
import MostPopular from "./content/showcase";
import Footer from "../components/Footer";

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData("mess").then((data) => setData(data));
  }, []);
  return (
    <div className="py-1 text-white">
      <Row>
        <Col>
          <CustomNavbar View={NotLoggedNavbar}></CustomNavbar>
        </Col>
      </Row>
      <WelcomeContent />
      <hr />
      <MostPopular />
      <Footer />
    </div>
  );
}

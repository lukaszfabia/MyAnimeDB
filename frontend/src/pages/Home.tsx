import { useState, useEffect } from "react";
import { fetchData } from "../scripts/index";
import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./Navigation";
import "../App.css";
import NotLoggedNavbar from "../components/navbars/notloggedNavbar";
import LoggedNavbar from "../components/navbars/loggedNavbar";
import WelcomeContent from "../components/carousel/Caroulsel";
import MostPopular from "../components/content/showcase";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="py-1 text-white">
      <Row>
        <Col>
          <CustomNavbar isLogged={false}></CustomNavbar>
        </Col>
      </Row>
      <WelcomeContent />
      <hr />
      <MostPopular />
      <Footer />
    </div >
  );
}
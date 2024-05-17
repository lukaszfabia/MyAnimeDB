import { useEffect, useState } from "react";
import { Navbar, Container, Nav, Button, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Form, Link, useParams, useSubmit } from "react-router-dom";
import "./navbar.css";
import LoggedNavbar from "../components/navbars/loggedNavbar";
import NotLoggedNavbar from "../components/navbars/notloggedNavbar";
import { ACCESS_TOKEN } from "../constants/const";
import api from "../scripts/api";
import ProtectedRoute from "../components/context/PrivateRoute";

export default function CustomNavbar() {
  const bg = {
    backgroundColor: "black",
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <Navbar expand="lg" className="navbar-dark fixed-top" style={bg}>
        <Container>
          <Navbar.Brand>
            <Link to="/">MyAnime.db</Link>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleNavbar}
            className={isOpen ? "text-white" : ""}
          >
            {isOpen ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav" className="text-center">
            <Nav className="ms-auto">
              <Nav.Link href="/search/anime">Anime</Nav.Link>
              <Nav.Link href="/search/manga">Manga</Nav.Link>
              <Form className="d-flex">
                <FormControl
                  type="search"
                  placeholder="Search..."
                  className="me-2 ms-4 bg-dark text-white border-secondary"
                  aria-label="Search"
                />
                <Nav.Link>
                  <FontAwesomeIcon icon={faSearch} />
                </Nav.Link>
              </Form>
              <ProtectedRoute error={<NotLoggedNavbar />}>
                <LoggedNavbar
                  username={
                    localStorage.getItem("username") ||
                    sessionStorage.getItem("username") ||
                    ""
                  }
                />
              </ProtectedRoute>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

const chooseNavbar = () => {
  if (
    localStorage.getItem(ACCESS_TOKEN) ||
    sessionStorage.getItem(ACCESS_TOKEN)
  ) {
    return (
      <LoggedNavbar
        username={
          localStorage.getItem("username") ||
          sessionStorage.getItem("username") ||
          ""
        }
      />
    );
  } else {
    return <NotLoggedNavbar />;
  }
};

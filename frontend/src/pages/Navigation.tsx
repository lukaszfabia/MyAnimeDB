import { useState } from "react";
import { Navbar, Container, Nav, FormControl, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Form, Link } from "react-router-dom";
import "../styles/navbar.css";
import LoggedNavbar from "../components/navbars/LoggedNavbar";
import NotLoggedNavbar from "../components/navbars/NotLoggedNavbar";
import ProtectedRoute from "../components/context/PrivateRoute";

export default function CustomNavbar() {
  const bg = {
    backgroundColor: "black",
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const keyword = e.target[0].value;
    window.location.href = `/search/anime?keyword=${keyword}`;
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
              <Nav.Link
                href="/search/anime"
                active={location.pathname === "/search/anime"}
              >
                Anime
              </Nav.Link>
              <Nav.Link
                href="/search/manga"
                active={location.pathname === "/search/manga"}
              >
                Manga
              </Nav.Link>
              <Form className="d-flex" onSubmit={handleSearch}>
                <FormControl
                  type="search"
                  placeholder="Search..."
                  className="me-2 ms-4 bg-dark text-white border-secondary"
                  aria-label="Search"
                />
                <Button type="submit" variant="no-bg" className="text-white">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
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

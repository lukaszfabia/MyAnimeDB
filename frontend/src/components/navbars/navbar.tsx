import { useState } from "react";
import { Navbar, Container, Nav, Button, FormControl } from "react-bootstrap";
// import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Form, Link } from "react-router-dom";
import "./navbar.css";

export default function CustomNavbar({ View }: any) {
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
              <Nav.Link href="/anime">Anime</Nav.Link>
              <Nav.Link href="/manga">Manga</Nav.Link>
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
              <View />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

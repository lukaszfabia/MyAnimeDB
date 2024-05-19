import React from "react";
import { Container, Nav } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <Container>
      <footer className="py-3 my-4">
        <Nav className="justify-content-center border-bottom pb-3 mb-3">
          <Nav.Item>
            <Nav.Link href="/" className="px-2 text-white">
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/search/anime" className="px-2 text-white">
              Anime
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" className="px-2 text-white">
              Manga
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" className="px-2 text-white">
              FAQs
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <p className="text-center text-white">
          &copy; 2024 MyAnime.db, <b>Lukasz Fabia</b>
        </p>
      </footer>
    </Container>
  );
};

export default Footer;

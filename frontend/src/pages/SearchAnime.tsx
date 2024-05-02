import { Container, Form } from "react-bootstrap";

export default function SearchAnime() {
  return (
    <Container className="py-5 mt-5 text-white">
      <h1>Search Anime</h1>
      <Form>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search anime..."
            className="bg-dark text-white border-1 border-secondary"
          />
        </Form.Group>
      </Form>
    </Container>
  );
}

import { Container, Form, Col, Row, Accordion, Button } from "react-bootstrap";
import api from "../scripts/api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface AnimeProps {
  id: string;
  name: string;
}

function ExampleAnime() {
  return <Container className="text-white">
    <h4 className="display-5">
      Results for
    </h4>
  </Container>;
}


export default function SearchAnime() {
  return <Container>
    <SearchInput />
    <ExampleAnime />
  </Container>
}

function SearchInput() {
  const [genres, setGenres] = useState<AnimeProps[]>([]);
  const [status, setStatus] = useState<AnimeProps[]>([]);
  const [types, setTypes] = useState<AnimeProps[]>([]);

  useEffect(() => {
    api.get("/api/anime/props/")
      .then((response) => {
        console.log(response.data);
        const fetchedGenres = response.data.props[0].genres;
        fetchedGenres.sort((a: AnimeProps, b: AnimeProps) => a.name.localeCompare(b.name));
        setGenres(fetchedGenres);

        const fetchedTypes = response.data.props[1].types;
        const fetchedStatus = response.data.props[2].status;

        fetchedStatus.sort((a: AnimeProps, b: AnimeProps) => a.name.localeCompare(b.name));
        fetchedTypes.sort((a: AnimeProps, b: AnimeProps) => a.name.localeCompare(b.name));
        setStatus(fetchedStatus);
        setTypes(fetchedTypes);
      })
      .catch((error) => {
        console.error("Error fetching AnimeProps:", error);
      });
  }, []);

  return (
    <Container className="py-5 mt-5 text-white">
      <h1>Search Anime</h1>
      <Form>
        <Row>
          <Col lg={6}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search anime..."
                name="keyword"
                className="bg-dark text-white border-1 border-secondary"
              />
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Button variant="outline-light" type="submit">
              <FontAwesomeIcon icon={faSearch} /> {" "}search
            </Button>
          </Col>
        </Row>

        <Accordion defaultActiveKey="0" className="py-5" data-bs-theme="dark">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Genres</Accordion.Header>
            <Accordion.Body>
              <Form.Group>
                <Row className="mt-4">
                  {genres.map((genre) => (
                    <Col lg={3} md={3} key={genre.id}>
                      <Form.Check
                        type="checkbox"
                        label={genre.name}
                        value={genre.name}
                        name="genre"
                        id={genre.id}
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Status</Accordion.Header>
            <Accordion.Body>
              <Form.Group>
                <Row className="mt-4">
                  {status.map((statusItem) => (
                    <Col lg={3} md={3} key={statusItem.id}>
                      <Form.Check
                        type="checkbox"
                        label={statusItem.name}
                        value={statusItem.name}
                        name="status"
                        id={statusItem.id}
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Type</Accordion.Header>
            <Accordion.Body>
              <Form.Group>
                <Row className="mt-4">
                  {types.map((typeItem) => (
                    <Col lg={3} md={3} key={typeItem.id}>
                      <Form.Check
                        type="checkbox"
                        label={typeItem.name}
                        value={typeItem.name}
                        name="type"
                        id={typeItem.id}
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
    </Container>
  );
}

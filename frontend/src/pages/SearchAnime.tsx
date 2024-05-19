import { Container, Form, Col, Row, Accordion, Button } from "react-bootstrap";
import api from "../scripts/api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Link } from "react-router-dom";

interface AnimePropertyData {
  id: string;
  name: string;
}

const InfoColumn: React.FC<{ value: string, isLink?: boolean, id?: string }> = ({ value, isLink, id }) => (
  <Col xs={12} md={2} className="text-sm-center text-md-left mt-2">
    {isLink ? <Link to={`/anime/${id}`}><h5 className="lead"><b>{value}</b></h5></Link> : <h5 className="lead">{value}</h5>}
  </Col>
);

const AnimeResult: React.FC<{ index?: number, id?: string, title: string, type: string, status: string, episodes: string, img?: string, rating: string, isHeader?: boolean }> = ({ index, id, title, type, status, episodes, img, rating, isHeader }) => {
  return (
    <Row className={`my-3 mb-4 text-center ${isHeader ? 'justify-content-center' : 'justify-content-md-start'}`}>
      <Col xs={12} sm={4} md={2} className="text-center">
        {isHeader ? null : <img src={img} alt={title} style={{ width: "80%", maxWidth: "150px" }} />}
      </Col>
      <Col xs={12} sm={8} md={10}>
        <Row>
          <InfoColumn value={title} isLink={!isHeader} id={id} />
          <InfoColumn value={type} />
          <InfoColumn value={status} />
          <InfoColumn value={episodes} />
          <InfoColumn value={rating} />
        </Row>
      </Col>
    </Row>
  )
}

const HeaderAnime: React.FC = () => {
  const isMobile = window.innerWidth > 500 ? true : false;
  return (
    isMobile ? (
      <Row className="my-3 mb-4" >
        <Col xs={12} sm={4} md={2} className="text-center"></Col>
        <Col xs={12} sm={8} md={10}>
          <Row>
            <Col xs={12} md={2} className="text-sm-center text-md-left"><h3>Title</h3></Col>
            <Col xs={12} md={2} className="text-sm-center text-md-left"><h3>Type</h3></Col>
            <Col xs={12} md={2} className="text-sm-center text-md-left"><h3>Status</h3></Col>
            <Col xs={12} md={2} className="text-sm-center text-md-left"><h3>Episodes</h3></Col>
            <Col xs={12} md={2} className="text-sm-center text-md-left"><h3>Rating</h3></Col>
          </Row>
        </Col>
        <hr />
      </Row >
    ) : <></>
  )
}


function ExampleAnime() {
  const [anime, setAnime] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/anime/")
      .then((response) => {
        console.log(response.data);
        setAnime(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Anime:", error);
      });

  }, []);

  return (
    <Container className="text-white">
      <Row className="py-5">
        <h4 className="display-5">
          Results for
        </h4>
      </Row>
      <HeaderAnime />
      {anime.map((anime: any, index: number) => (
        <React.Fragment key={anime.id_anime}>
          <h4 className="display-5"><span className="text-secondary">#</span>{(index + 1)}</h4>
          <AnimeResult index={index} id={anime.id_anime} title={anime.title} type={anime.type} status={anime.status} episodes={anime.episodes} img={anime.img_url} rating={anime.rating} isHeader={false} />
          <hr />
        </React.Fragment>
      ))}
      <div className="mb-5 py-5"></div>
    </Container>
  );
}


export default function SearchAnime() {
  return <Container>
    <SearchInput />
    <ExampleAnime />
  </Container>
}

interface CheckboxProps {
  id: string;
  label: string;
  value: string;
  name: string;
}

const CheckboxGroup: React.FC<{ checkboxes: CheckboxProps[] }> = ({ checkboxes }) => (
  <Form.Group>
    <Row className="mt-4">
      {checkboxes.map((checkbox) => (
        <Col lg={3} md={3} key={checkbox.id}>
          <Form.Check
            type="checkbox"
            label={checkbox.label}
            value={checkbox.value}
            name={checkbox.name}
            id={checkbox.id}
          />
        </Col>
      ))}
    </Row>
  </Form.Group>
);

function useAnimeProps() {
  const [animeProps, setAnimeProps] = useState<{ genres: AnimePropertyData[]; status: AnimePropertyData[]; types: AnimePropertyData[] }>({
    genres: [],
    status: [],
    types: [],
  });

  useEffect(() => {
    api.get("/api/anime/props/")
      .then((response) => {
        const fetchedGenres = response.data.props[0].genres;
        fetchedGenres.sort((a: AnimePropertyData, b: AnimePropertyData) => a.name.localeCompare(b.name));

        const fetchedStatus = response.data.props[2].status;
        fetchedStatus.sort((a: AnimePropertyData, b: AnimePropertyData) => a.name.localeCompare(b.name));

        const fetchedTypes = response.data.props[1].types;
        fetchedTypes.sort((a: AnimePropertyData, b: AnimePropertyData) => a.name.localeCompare(b.name));

        setAnimeProps({ genres: fetchedGenres, status: fetchedStatus, types: fetchedTypes });
      })
      .catch((error) => {
        console.error("Error fetching AnimeProps:", error);
      });
  }, []);

  return animeProps;
}

function SearchInput() {
  const { genres, status, types } = useAnimeProps();

  return (
    <Container className="py-5 mt-5 text-white">
      <h1>Search Anime</h1>
      <Form>
        <Row>
          <Col lg={6} className="text-center text-lg-start">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search anime..."
                name="keyword"
                className="bg-dark text-white border-1 border-secondary"
              />
            </Form.Group>
          </Col>
          <Col lg={6} className="text-center text-lg-end mt-3 mt-lg-0">
            <Button variant="outline-light" type="submit">
              <FontAwesomeIcon icon={faSearch} /> {" "}search
            </Button>
          </Col>
        </Row>

        <Accordion defaultActiveKey="0" className="py-5" data-bs-theme="dark">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Genres</Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup checkboxes={genres.map((genre) => ({ id: genre.id, label: genre.name, value: genre.name, name: "genre" }))} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Status</Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup checkboxes={status.map((statusItem) => ({ id: statusItem.id, label: statusItem.name, value: statusItem.name, name: "status" }))} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Type</Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup checkboxes={types.map((typeItem) => ({ id: typeItem.id, label: typeItem.name, value: typeItem.name, name: "type" }))} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
    </Container>
  );
}

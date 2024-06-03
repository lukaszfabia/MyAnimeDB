import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Col,
  Row,
  Accordion,
  Button,
  Pagination,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import api from "../scripts/api";
import { CheckboxProps, AnimePropertyData } from "../scripts";
import "../styles/pagination.css";

const InfoColumn: React.FC<{
  value: string;
  isLink?: boolean;
  id?: string;
}> = ({ value, isLink, id }) => (
  <Col xs={12} md={2} className="text-sm-center text-md-left mt-2">
    {isLink ? (
      <Link to={`/anime/${id}`}>
        <h5 className="lead">
          <b>{value}</b>
        </h5>
      </Link>
    ) : (
      <h5 className="lead">{value}</h5>
    )}
  </Col>
);

const AnimeResult: React.FC<{
  id?: string;
  title: string;
  type: string;
  status: string;
  episodes: string;
  img?: string;
  rating: string;
  isHeader?: boolean;
}> = ({ id, title, type, status, episodes, img, rating, isHeader }) => {
  return (
    <Row
      className={`my-3 mb-4 text-center ${
        isHeader ? "justify-content-center" : "justify-content-md-start"
      }`}
    >
      <Col xs={12} sm={4} md={2} className="text-center">
        {!isHeader && (
          <img
            src={img}
            alt={title}
            style={{ width: "80%", maxWidth: "150px" }}
          />
        )}
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
  );
};

const HeaderAnime: React.FC<{
  onSort: (sortBy: string) => void;
  sortDirection: { [key: string]: boolean };
}> = ({ onSort, sortDirection }) => {
  const [activeButton, setActiveButton] = useState<string>("");

  const handleButton = (sortBy: string) => {
    onSort(sortBy);
    setActiveButton(sortBy);
  };

  return window.innerWidth > 500 ? (
    <Row className="my-3 mb-4">
      <Col xs={12} sm={4} md={2} className="text-center"></Col>
      <Col xs={12} sm={8} md={10}>
        <Row>
          {["title", "type", "status", "episodes", "rating"].map((sortKey) => (
            <Col
              xs={12}
              md={2}
              className="text-sm-center text-md-left"
              key={sortKey}
            >
              <Button
                variant="no-bg"
                className={`text-white text-center px-2 py-1 ${
                  activeButton === sortKey ? "active" : ""
                }`}
                onClick={() => handleButton(sortKey)}
              >
                <h5>
                  {sortKey.charAt(0).toUpperCase() + sortKey.slice(1)}{" "}
                  {sortDirection[sortKey] ? (
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faCaretUp} />
                  )}
                </h5>
              </Button>
            </Col>
          ))}
        </Row>
      </Col>
      <hr />
    </Row>
  ) : null;
};

const ExampleAnime: React.FC = () => {
  const [anime, setAnime] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<{
    [key: string]: boolean;
  }>({
    title: true,
    type: true,
    status: true,
    episodes: true,
    rating: true,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const keyword = new URLSearchParams(window.location.search).get("keyword");
    const genres = new URLSearchParams(window.location.search).getAll("genre");
    const status = new URLSearchParams(window.location.search).getAll("status");
    const type = new URLSearchParams(window.location.search).getAll("type");
    const typeQuery = type.map((type) => `type=${type}`).join("&");
    const genreQuery = genres.map((genre) => `genre=${genre}`).join("&");
    console.log(genreQuery);
    const statusQuery = status.map((status) => `status=${status}`).join("&");
    const keywordQuery = keyword ? `keywords=${keyword}` : "";
    const query = [genreQuery, typeQuery, statusQuery, keywordQuery]
      .filter((query) => query.length > 0)
      .join("&");

    api
      .get(`/api/anime/search/${query !== "" ? query : "all"}`)
      .then((response) => setAnime(response.data))
      .catch((error) => console.error("Error fetching Anime:", error));
  }, []);

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortDirection((prevSortDirection) => ({
      ...prevSortDirection,
      [sortBy]: !prevSortDirection[sortBy],
    }));
  };

  const sortedAnime = anime.sort((a: any, b: any) => {
    const direction = sortDirection[sortBy] ? 1 : -1;
    if (sortBy === "status") {
      return direction * a.status.localeCompare(b.status);
    } else if (sortBy === "episodes") {
      return direction * (parseInt(a.episodes) - parseInt(b.episodes));
    } else if (sortBy === "rating") {
      return direction * (parseFloat(a.rating) - parseFloat(b.rating));
    } else if (sortBy === "title") {
      return direction * a.title.localeCompare(b.title);
    } else if (sortBy === "type") {
      return direction * a.type.localeCompare(b.type);
    } else {
      return 0;
    }
  });

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnime = sortedAnime.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedAnime.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Container className="text-white">
      <HeaderAnime onSort={handleSort} sortDirection={sortDirection} />
      <Row>
        {currentAnime.map((anime: any, index: number) => (
          <React.Fragment key={index}>
            <AnimeResult
              key={anime.id_anime}
              id={anime.id_anime}
              title={anime.title}
              type={anime.type}
              status={anime.status}
              episodes={anime.episodes}
              img={anime.img_url}
              rating={anime.rating}
            />
            <hr />
          </React.Fragment>
        ))}
      </Row>

      <Pagination className="py-4 mb-3 justify-content-center">
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev
          onClick={() =>
            handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
          }
        />
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() =>
            handlePageChange(
              currentPage < pageNumbers.length
                ? currentPage + 1
                : pageNumbers.length
            )
          }
        />
        <Pagination.Last onClick={() => handlePageChange(pageNumbers.length)} />
      </Pagination>
    </Container>
  );
};

const CheckboxGroup: React.FC<{ checkboxes: CheckboxProps[] }> = ({
  checkboxes,
}) => (
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
  const [animeProps, setAnimeProps] = useState<{
    genres: AnimePropertyData[];
    status: AnimePropertyData[];
    types: AnimePropertyData[];
  }>({
    genres: [],
    status: [],
    types: [],
  });

  useEffect(() => {
    api
      .get("/api/anime/props/")
      .then((response) => {
        const fetchedGenres = response.data.props[0].genres.sort(
          (a: AnimePropertyData, b: AnimePropertyData) =>
            a.name.localeCompare(b.name)
        );

        const fetchedStatus = response.data.props[2].status.sort(
          (a: AnimePropertyData, b: AnimePropertyData) =>
            a.name.localeCompare(b.name)
        );

        const fetchedTypes = response.data.props[1].types.sort(
          (a: AnimePropertyData, b: AnimePropertyData) =>
            a.name.localeCompare(b.name)
        );

        setAnimeProps({
          genres: fetchedGenres,
          status: fetchedStatus,
          types: fetchedTypes,
        });
      })
      .catch((error) => console.error("Error fetching AnimeProps:", error));
  }, []);

  return animeProps;
}

const SearchInput: React.FC = () => {
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
              <FontAwesomeIcon icon={faSearch} /> search
            </Button>
          </Col>
        </Row>

        <Accordion defaultActiveKey="0" className="py-5" data-bs-theme="dark">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Genres</Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup
                checkboxes={genres.map((genre) => ({
                  id: genre.id,
                  label: genre.name,
                  value: genre.name,
                  name: "genre",
                }))}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Status</Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup
                checkboxes={status.map((statusItem) => ({
                  id: statusItem.id,
                  label: statusItem.name,
                  value: statusItem.name,
                  name: "status",
                }))}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Type</Accordion.Header>
            <Accordion.Body>
              <CheckboxGroup
                checkboxes={types.map((typeItem) => ({
                  id: typeItem.id,
                  label: typeItem.name,
                  value: typeItem.name,
                  name: "type",
                }))}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
    </Container>
  );
};

export default function SearchAnime() {
  return (
    <Container>
      <SearchInput />
      <ExampleAnime />
    </Container>
  );
}

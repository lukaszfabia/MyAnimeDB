import { Col, Container, Row, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../scripts/api";
import { Link } from "react-router-dom";
import { Anime } from "../../pages/Anime";

interface CustomCardProps {
  index: number
  anime: Anime
}

const CustomCard: React.FC<CustomCardProps> = ({ index, anime }) => {
  const getShortDesc = (desc: string) => {
    return desc.length > 80 ? desc.substring(0, 80) + "..." : desc;
  }

  return (
    <Col lg={4} xs={12} className="py-4">
      <Card className="flex-row bg-dark text-white" key={index}>
        <Card.Img src={anime.img_url} alt={anime.title} className="card-img-left" style={{ height: "300px", width: "auto" }} />
        <Card.Body className="d-flex flex-column">
          <Card.Title>
            <Link to={`/anime/${anime.id_anime}`} className="text-white">{anime.title}</Link>
          </Card.Title>
          <Card.Text>{getShortDesc(anime.description)}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

const MostPopular: React.FC = () => {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  useEffect(() => {
    api.get("/api/anime/most_popular/")
      .then((response) => {
        console.log(response.data);
        setPopularAnime(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <Container className="py-5 text-white">
      <h1 className="display-5">Most popular anime</h1>
      <Row>
        {popularAnime.map((anime: Anime, index: number) => <CustomCard index={index} anime={anime} />)}
      </Row>
    </Container>
  );
};

export default MostPopular;

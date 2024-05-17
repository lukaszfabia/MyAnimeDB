import React, { useEffect, useState } from "react";
import api from "../scripts/api";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

interface AnimeProps {
    id: string;
    title: string;
    img_url: string;
    rating: string;
    state: string;
    episodes: string;
    type: string;
    genres: string[];
}

const AnimeEntry: React.FC<AnimeProps> = ({ id, title, img_url, rating, state, episodes, type, genres }) => {
    return (
        <Row className="w-90 h-25 mb-5 p-5">
            <Col lg={2}>
                <Card.Img src={img_url} alt={title} className="img-fluid" />
            </Col>
            <Col lg={10}>
                <Link to={`/anime/${id}`}><p className="lead"><b>{title}</b> {type}</p></Link>
                {state === "plan-to-watch" ?
                    <p className="lead">Planned to watch</p>
                    : <p className="lead">Rated on <b>{rating}</b> <span className="text-secondary">and {state}</span></p>}
                <p className="lead">{episodes} <span className="text-secondary">episodes</span></p>
                <p className="lead">{genres.join(", ")}</p>
            </Col>
        </Row>
    );
};

const ListAnime: React.FC = () => {
    const [personalData, setPersonalData] = useState<any>([]);

    useEffect(() => {
        api.get("/api/user/anime/list/").then((res) => {
            console.log(res.data);
            setPersonalData(res.data);
        });
    }, []);

    return (
        <Container className="text-white py-5 mt-5">
            <Row>
                <h1 className="display-5">Anime list</h1>
                {personalData.map((anime: any, index: number) => (
                    <React.Fragment key={index}>
                        <hr />
                        <AnimeEntry
                            id={anime.id_anime.id_anime}
                            title={anime.id_anime.title}
                            img_url={anime.id_anime.img_url}
                            rating={anime.score}
                            state={anime.state}
                            episodes={anime.id_anime.episodes}
                            type={anime.id_anime.type}
                            genres={anime.id_anime.genres}
                        />
                    </React.Fragment>
                ))}
            </Row>
        </Container>
    );
};



export default ListAnime;

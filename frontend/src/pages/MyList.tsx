import React, { useEffect, useState } from "react";
import api from "../scripts/api";
import { Form, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AnimeProps } from "../scripts";

export const AnimeEntry: React.FC<AnimeProps> = ({ id, title, img_url, rating, state, episodes, type, genres }) => {
    return (
        <Row className="w-90 h-25 mb-5 p-5">
            <Col lg={2}>
                <Card.Img src={img_url} alt={title} className="img-fluid" />
            </Col>
            <Col lg={10}>
                <Link to={`/anime/${id}`}><p className="lead"><b>{title}</b> {type}</p></Link>
                {state === "plan-to-watch" ?
                    <p className="lead">Planned to watch</p>
                    : <p className="lead"><span><b>{state}</b></span> and rated on <b>{rating}</b></p>}
                <p className="lead">{episodes} <span className="text-secondary">episodes</span></p>
                <p className="lead">{genres.join(", ")}</p>
            </Col>
        </Row>
    );
};

const ListAnime: React.FC = () => {
    const [personalData, setPersonalData] = useState<any>([]);
    const [types, setTypes] = useState<any>([]);

    useEffect(() => {
        api.get("/api/user/anime/list/").then((res) => {
            setPersonalData(res.data);
        });
    }, []);


    useEffect(() => {
        api.get("/api/anime/props/").then((res) => {
            setTypes(res.data.props[1].types)
        })
    }, [])


    const [filter, setFilter] = useState<string>("all");

    const handleFilterChange = (event: any) => {
        setFilter(event.target.value);
    };

    return (
        <Container className="text-white py-5 mt-5">
            <Row>
                <h1 className="display-5">Anime list</h1>
                <Col lg={4} className="mb-3">
                    <Form.Select value={filter} onChange={handleFilterChange} className="bg-dark dark-select">
                        <option value="all">All</option>
                        <option value="watching">Watching</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On hold</option>
                        <option value="dropped">Dropped</option>
                        <option value="plan-to-watch">Plan to watch</option>
                    </Form.Select>
                </Col>
                <Col lg={4} className="mb-3">
                    <Form.Select value={filter} onChange={handleFilterChange} className="bg-dark dark-select">
                        {types.map((type: any, index: number) =>
                            (<option key={index} value={type.name}>{type.name}</option>)
                        )}
                    </Form.Select>
                </Col>
                {personalData
                    .filter((anime: any) => {
                        return filter == anime.state || filter == "all" || filter == anime.id_anime.type;
                    })
                    .map((anime: any, index: number) => (
                        <React.Fragment key={index}>
                            <hr />
                            <h1 className="display-5"><span className="text-secondary">#</span>{index + 1}</h1>
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

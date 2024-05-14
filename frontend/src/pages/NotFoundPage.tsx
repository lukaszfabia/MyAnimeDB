import { Container, Row, Col, Button } from "react-bootstrap";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function NoPage() {
    return (
        <Container className="py-5 mt-5">
            <Row className="text-center text-white">
                <Col>
                    <h1>404 Not Found</h1>
                </Col>
            </Row>
            <Footer />
        </Container>
    )
}
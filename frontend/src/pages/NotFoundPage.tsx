import { Container, Row, Col } from "react-bootstrap";
import Footer from "../components/Footer";

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
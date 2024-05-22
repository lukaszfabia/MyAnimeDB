import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../scripts/api";

export default function RestoringPassword() {
    const navigate = useNavigate();
    const submit = (e: any) => {
        e.preventDefault();
        api.post("/api/auth/password_reset/", {
            email: e.target[0].value
        }).then((response) => {
            if (response.status === 200) {
                alert("Email sent");
            } else {
                alert("Error");
            }
        }).catch(() => {
            alert("Error");
        });
    }

    return <Container className="text-center text-white mt-5 py-5 justify-content-center w-50">
        <Row className="mt-5">
            <Col>
                <h1 className="text-center">Restoring password</h1>
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Form onSubmit={submit}>
                <Form.Group>
                    <Form.Control type="email"
                        placeholder="Enter your email ..."
                        className="bg-dark text-white border-1 border-secondary"
                        autoComplete="false" />
                </Form.Group>
                <div>
                    <Button variant="outline-light" className="mt-4" type="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </Row>
    </Container>
}
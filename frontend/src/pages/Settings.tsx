import { useNavigate } from "react-router-dom";
import { updateProfile } from "../scripts/authFunc"
import { Container, Row, Col, Form } from "react-bootstrap";
import UserForm from "../components/NewDataForm";

export default function MySettings() {
    const navigate = useNavigate();
    const sumbitHandler = (e: any) => {
        updateProfile(e, navigate)
    }

    return (
        <Container className="mt-5 text-white py-5 rounded-5">
            <Row className="justify-content-center">
                <Col xs={10} sm={8} md={6}>
                    <h1 className="text-center mb-4">Update your profile</h1>
                    <h3 className="lead text-secondary text-center mb-5">If you decide to change some fields, you will be logged out!</h3>
                    <Form onSubmit={sumbitHandler}>
                        <UserForm
                            isRequired={false}
                            text="update"
                            mode="update">
                        </UserForm>
                    </Form>
                </Col>
            </Row>
        </Container >
    )
}

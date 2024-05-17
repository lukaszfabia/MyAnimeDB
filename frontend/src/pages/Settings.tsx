import { useNavigate } from "react-router-dom";
import { updateProfile } from "../scripts/axios"
import { Container, Row, Col, Form } from "react-bootstrap";
import { validatePassword } from "../scripts";
import { useState } from "react";
import { UserForm } from "../components/NewDataForm";

export default function MySettings() {
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    const navigate = useNavigate();
    const sumbitHandler = (e: any) => {
        updateProfile(e, navigate)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        validatePassword(e, true, setPasswordError, setPassword);
    };

    return (
        <Container className="py-5 mt-5 text-white">
            <Row>
                <h1>Settings</h1>
                <h3 className="text-secondary">Update your profile</h3>
                <p className="text-warning">If you decide to change some info , you will be logged out.</p>
            </Row>
            <Row>
                <Col xs={10} sm={8} md={6}>
                    <Form onSubmit={sumbitHandler}>
                        <UserForm handlePasswordChange={handlePasswordChange} passwordError={passwordError} isRequired={false} text="update">
                            <Form.Group controlId="formBasicBio" className="mb-4 py-2">
                                <Form.Control
                                    type="text"
                                    name="bio"
                                    placeholder="enter bio..."
                                    required={false}
                                    className="bg-dark text-white border-1 border-secondary"
                                />
                            </Form.Group>
                        </UserForm>
                    </Form>
                </Col>
            </Row>

        </Container>
    )
}

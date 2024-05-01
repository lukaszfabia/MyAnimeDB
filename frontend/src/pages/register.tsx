import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { validatePassword } from "../scripts";
import { useAuth } from "../components/context/AuthContext";

const RegisterForm = () => {
  const [password, setPassword] = useState<string>("");

  const [passwordError, setPasswordError] = useState<string>("");

  const { register } = useAuth();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validatePassword(e, setPasswordError, setPassword);
  };

  return (
    <>
      <Container className="mt-5 text-white py-5 rounded-5">
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6}>
            <h1 className="text-center mb-4">Create an account</h1>
            <Form onSubmit={register} encType="multipart/form-data">
              <Form.Group controlId="formBasicUsername" className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="enter username..."
                  required={true}
                  className="bg-dark text-white border-1 border-secondary"
                  name="username"
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="mb-4">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="enter e-mail..."
                  required={true}
                  className="bg-dark text-white border-1 border-secondary"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-4">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="enter password..."
                  required={true}
                  className="bg-dark text-white border-1 border-secondary"
                  onChange={handlePasswordChange}
                />
              </Form.Group>
              <Form.Group controlId="formShowPassword" className="mb-4">
                <Form.Check
                  type="checkbox"
                  label="Show Password"
                  onClick={(e) =>
                    (
                      document.getElementById(
                        "formBasicPassword"
                      ) as HTMLInputElement
                    )?.setAttribute(
                      "type",
                      (e.target as HTMLInputElement).checked
                        ? "text"
                        : "password"
                    )
                  }
                />
              </Form.Group>
              <Form.Text className="text-warning">
                <p className="text-center">{passwordError}</p>
              </Form.Text>

              <Form.Group className="py-3">
                <Form.Control
                  type="file"
                  className="bg-dark text-white border-1 border-secondary"
                  id="formFile"
                  name="avatar"
                />
              </Form.Group>

              <div className="d-flex justify-content-center align-items-center mb-5 py-4">
                <Button
                  variant="outline-light"
                  type="submit"
                  className="w-50"
                  id="submit"
                >
                  Sign up
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <p className="text-secondary">
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterForm;

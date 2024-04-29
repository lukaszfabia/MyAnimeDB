import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  Children,
  ReactNode,
  ReactPortal,
  createContext,
  useContext,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../scripts/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/const";
import { UserContext } from "../UserProvider";

const LoginForm = () => {
  const { user, setUser } = useContext<any>(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const sumbit = (e: any) => {
    e.preventDefault();
    api
      .post("/api/token/", {
        username: username,
        password: password,
      })
      .then((response) => {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        localStorage.setItem("isLogged", "true");
        setUser(response.data.user);
        navigate(`/profile/${username}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Container className="mt-5 text-white py-5 rounded-5">
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6}>
            <h1 className="text-center mb-4">Login</h1>
            <Form onSubmit={sumbit}>
              <Form.Group controlId="formBasicUsername" className="mb-4">
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="enter username..."
                  required
                  value={username}
                  className="bg-dark text-white border-1 border-secondary"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-4">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="enter password..."
                  required
                  value={password}
                  className="bg-dark text-white border-1 border-secondary"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicCheckbox" className="mb-4">
                <Row>
                  <Col xs={6}>
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      className="text-secondary"
                    />
                  </Col>
                  <Col xs={6} className="d-flex justify-content-end">
                    <Form.Text className="text-secondary">
                      <a href="/forgot-password">Forgot password?</a>
                    </Form.Text>
                  </Col>
                </Row>
              </Form.Group>

              <div className="d-flex justify-content-center align-items-center mb-4">
                <Button
                  variant="outline-light"
                  type="submit"
                  className="w-50"
                  formAction="sumbit"
                >
                  Sign in
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <p className="text-secondary">
                Dont't have an account? <a href="/register">Register</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginForm;

import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login } from "../scripts/axios";
import UserForm from "../components/NewDataForm";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const submit = (e: any) => {
    e.preventDefault();
    const isRememberMe = e.target.rememberMe.checked;
    login(e, isRememberMe, navigate);
  };

  return (
    <Container className="mt-5 text-white py-5 rounded-5">
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={6}>
          <h1 className="text-center mb-4">Login</h1>
          <Form onSubmit={submit}>
            <UserForm
              isRequired={true}
              text="Sign in"
              mode="login">
              <Form.Group controlId="formBasicCheckbox" className="mb-4">
                <Row>
                  <Col xs={6}>
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      label="Remember me"
                      className="text-secondary"
                    />
                  </Col>
                  <Col xs={6} className="d-flex justify-content-end">
                    <Form.Text className="text-secondary">
                      <a href="/login/forgot-password">Forgot password?</a>
                    </Form.Text>
                  </Col>
                </Row>
              </Form.Group>
            </UserForm>
          </Form>
          <div className="text-center mt-3">
            <p className="text-secondary">
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </Col>
      </Row>
    </Container >
  );
};

export default Login;

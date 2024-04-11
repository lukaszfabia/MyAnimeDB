import { Container, Row, Col, Form, Button } from "react-bootstrap";
import NotLoggedNavbar from "../navbars/notloggedNavbar";
import CustomNavbar from "../navbars/navbar";

const LoginForm = () => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const [username, email, password] = e.target.elements;
    console.log(username.value, email.value, password.value);
  };

  return (
    <>
      <CustomNavbar View={NotLoggedNavbar} />
      <Container className="mt-5 text-white py-5 rounded-5">
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6}>
            <h1 className="text-center mb-4">Create an account</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername" className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="enter username..."
                  className="bg-dark text-white border-1 border-secondary"
                  required={true}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="mb-4">
                <Form.Control
                  type="email"
                  placeholder="enter e-mail..."
                  className="bg-dark text-white border-1 border-secondary"
                  required={true}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-4">
                <Form.Control
                  type="password"
                  placeholder="enter password..."
                  className="bg-dark text-white border-1 border-secondary"
                  required={true}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  type="file"
                  placeholder="upload profile picture..."
                  className="bg-dark text-white border-1 border-secondary"
                />
              </Form.Group>

              <div className="d-flex justify-content-center align-items-center mb-4">
                <Button
                  variant="outline-light"
                  type="submit"
                  className="w-50"
                  formAction="sumbit"
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

export default LoginForm;

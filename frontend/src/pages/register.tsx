import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";

const RegisterForm = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const [passwordError, setPasswordError] = useState<string>('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const potentialPassword = e.target.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(potentialPassword)) {
      setPasswordError('Password must be at least 8 characters long and contain at least one letter and one number');
    } else {
      setPasswordError('');
      setPassword(potentialPassword);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (file) {
      formData.append('avatar', file);
    }

    fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then((data) => {
        console.log("data:", data);
        window.location.href = `/profile/${data.username}`;
      })
      .catch(error => {
        console.error("error:", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Container className="mt-5 text-white py-5 rounded-5">
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6}>
            <h1 className="text-center mb-4">Create an account</h1>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Form.Group controlId="formBasicUsername" className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="enter username..."
                  required={true}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="mb-4">
                <Form.Control
                  type="email"
                  placeholder="enter e-mail..."
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-4">
                <Form.Control
                  type="password"
                  placeholder="enter password..."
                  required={true}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Text className="text-warning">
                {passwordError}
              </Form.Text>

              <Form.Group className="py-3">
                <Form.Control
                  type="file"
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-center align-items-center mb-4">
                <Button
                  variant="outline-light"
                  type="submit"
                  className="w-50"
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

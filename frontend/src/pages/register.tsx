import {
  Container,
  Row,
  Col,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const regexForPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [file, setFile] = useState<File>(new File([], ""));

  const [errorInfo, setErrorInfo] = useState<string>("");

  const [passwordError, setPasswordError] = useState<string>("");

  const navigate = useNavigate();

  // for password validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const potentialPassword = e.target.value;
    if (!regexForPassword.test(potentialPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
      document.getElementById("submit")?.setAttribute("disabled", "true");
    } else {
      setPasswordError("");
      setPassword(potentialPassword);
      document.getElementById("submit")?.removeAttribute("disabled");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = {
      username: username,
      email: email,
      password: password
    }
    const formData = new FormData();
    formData.append("user.username", user.username);
    formData.append("user.email", user.email);
    formData.append("user.password", user.password);
    if (file) {
      formData.append("avatar", file);
    } else {
      formData.append("avatar", "");
    }

    formData.append("bio", "change me");

    // Sending data to the backend
    axios.post("http://127.0.0.1:8000/api/register/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        navigate(`/profile/${username}`);
      })
      .catch((error) => {
        const errorMsg = error.response?.data.error || "An unexpected error occurred";
        setErrorInfo(errorMsg);

        // Clearing and setting validation state
        const formUsername = document.getElementById("formBasicUsername");
        if (formUsername) {
          formUsername.classList.remove("is-invalid"); // Clear previous state
          formUsername.classList.add("is-invalid"); // Set current state
        }
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
                <OverlayTrigger
                  placement="right"
                  show={errorInfo !== ""}
                  overlay={
                    <Tooltip id={`tooltip-right`}>
                      <p className="text-danger">{errorInfo}</p>
                    </Tooltip>
                  }
                >
                  <Form.Control
                    type="text"
                    placeholder="enter username..."
                    required={true}
                    className="bg-dark text-white border-1 border-secondary"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="mb-4">
                <Form.Control
                  type="email"
                  placeholder="enter e-mail..."
                  required={true}
                  className="bg-dark text-white border-1 border-secondary"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-4">
                <Form.Control
                  type="password"
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
                <p className="text-center">
                  {passwordError}
                </p>
              </Form.Text>

              <Form.Group className="py-3">
                <Form.Control
                  type="file"
                  onChange={handleChange}
                  className="bg-dark text-white border-1 border-secondary"
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

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { validatePassword } from "../scripts";
// import { useAuth } from "../components/context/AuthContext";
import { register } from "../scripts/axios";
import { useNavigate } from "react-router-dom";
import { UserForm } from "../components/NewDataForm";


const RegisterForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");

  const [passwordError, setPasswordError] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validatePassword(e, false, setPasswordError, setPassword);
  };

  const sumbit = (e: any) => {
    e.preventDefault();
    register(e, navigate);
  };

  return (
    <>
      <Container className="mt-5 text-white py-5 rounded-5">
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6}>
            <h1 className="text-center mb-4">Create an account</h1>
            <Form onSubmit={sumbit} encType="multipart/form-data">

              <UserForm handlePasswordChange={handlePasswordChange} passwordError={passwordError} isRequired={true} text="sign up" />

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

import { Container, Row, Col, Form } from "react-bootstrap";
import { register } from "../scripts/axios";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/NewDataForm"; // Assuming the file path is correct

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const submit = (e: any) => {
    e.preventDefault();
    register(e, navigate);
  };

  return (
    <Container className="mt-5 text-white py-5 rounded-5">
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={6}>
          <h1 className="text-center mb-4">Create account</h1>
          <Form onSubmit={submit}>
            <UserForm
              isRequired={true}
              text="Sign in"
              mode="register">
            </UserForm>
          </Form>
          <div className="text-center mt-3">
            <p className="text-secondary">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>
        </Col>
      </Row>
    </Container >
  )
};

export default RegisterForm;

import { Container, Form, Col, Row } from "react-bootstrap";
import UserForm from "../components/NewDataForm";

export default function RestoringPassword() {
    const submit = (e: any) => {
        e.preventDefault();
        console.log("Restore password");
    }

    return (<Container className="mt-5 text-white py-5 rounded-5">
        <Row className="justify-content-center">
            <Col xs={10} sm={8} md={6}>
                <h1 className="text-center mb-4">Resotre password</h1>
                <h4 className="text-center mb-4 text-secondary">You will get auth code on your mail.</h4>
                <Form onSubmit={submit}>
                    <UserForm
                        isRequired={true}
                        text="restore"
                        mode="reset">
                    </UserForm>
                </Form>
            </Col>
        </Row>
    </Container >);
}
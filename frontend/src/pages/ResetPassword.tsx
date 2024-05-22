import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../scripts/api';
import { Container, Form, Col, Row } from 'react-bootstrap';
import UserForm from '../components/NewDataForm'

const ResetPasswordPage: React.FC = () => {
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');

    const handleSubmit = async (elem: any) => {
        elem.preventDefault();
        api.post('/api/auth/password_reset_confirm/', {
            new_password: elem.target.password.value,
            uid,
            token
        }).then((response) => {
            if (response.status === 200) {
                alert('Password changed successfully');
                navigate('/login');
            } else {
                alert('Error');
            }
        }).catch(() => {
            alert('Error');
        });
    };

    return <Container className='mt-5 text-white py-5 rounded-5'>
        <Row className="justify-content-center">
            <Col xs={10} sm={8} md={6}>
                <h1 className="text-center mb-4">Reset password</h1>
                <ul>
                    <li>Password must contain at least 8 characters</li>
                    <li>Password must have one digit</li>
                </ul>
                <Form onSubmit={handleSubmit}>
                    <UserForm mode='reset' isRequired={true} text="update password" />
                </Form>
            </Col>
        </Row>
    </Container >
};

export default ResetPasswordPage;

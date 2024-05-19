import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { validatePassword } from '../scripts';

interface Props {
    isRequired: boolean;
    text: string;
    mode: "login" | "reset" | "register" | "update";
    children?: React.ReactNode;
}

const UserForm: React.FC<Props> = ({ isRequired, text, mode, children }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState<string>("");

    const [passwordError, setPasswordError] = useState<string>("");

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        validatePassword(e, mode !== "login", setPasswordError, setPassword);
    };

    const handleShowPasswordClick = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            {(mode === "login" || mode === "register" || mode === "update") && (
                <Form.Group controlId="formBasicUsername" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="enter username..."
                        required={isRequired}
                        className="bg-dark text-white border-1 border-secondary"
                        name="username"
                    />
                </Form.Group>
            )}

            {(mode === "register" || mode === "update" || mode === "reset") && (
                <Form.Group controlId="formBasicEmail" className="mb-4">
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="enter e-mail..."
                        required={isRequired}
                        className="bg-dark text-white border-1 border-secondary"
                    />
                </Form.Group>
            )}

            {(mode === "login" || mode === "register" || mode === "update" || mode === "reset") && (
                <Form.Group controlId="formBasicPassword" className="mb-4">
                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="enter password..."
                        required={isRequired}
                        className="bg-dark text-white border-1 border-secondary"
                        onChange={handlePasswordChange}
                    />
                </Form.Group>
            )}

            {(mode === "login" || mode === "register" || mode === "update" || mode === "reset") && (
                <Form.Group controlId="formShowPassword" className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="Show Password"
                        className="text-secondary"
                        onClick={handleShowPasswordClick}
                    />
                </Form.Group>
            )}

            {passwordError && (
                <Form.Text className="text-warning">
                    <small className="text-center">{passwordError}</small>
                </Form.Text>
            )}

            {(mode === "register" || mode === "update") && (
                <Form.Group className="py-3">
                    <Form.Control
                        type="file"
                        className="bg-dark text-white border-1 border-secondary"
                        id="formFile"
                        name="avatar"
                    />
                </Form.Group>
            )}

            {mode === "update" && (
                <Form.Group controlId="formBio" className="mb-4">
                    <Form.Control
                        as="textarea"
                        name="bio"
                        placeholder="enter bio..."
                        rows={3}
                        className="bg-dark text-white border-1 border-secondary"
                        required={isRequired}
                    />
                </Form.Group>
            )}

            {children}

            <div className="d-flex justify-content-center align-items-center mb-5 py-4">
                <Button
                    variant="outline-light"
                    type="submit"
                    className="w-50"
                    id="submit"
                >
                    {text}
                </Button>
            </div>
        </>
    );
};

export default UserForm;

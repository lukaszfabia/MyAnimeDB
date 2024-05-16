import React from 'react';
import { Button, Form } from 'react-bootstrap';

interface Props {
    handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    passwordError: string;
    isRequired: boolean;
    text: string; // text for the submit button
    children?: React.ReactNode;
}

export const UserForm: React.FC<Props> = ({ handlePasswordChange, passwordError, isRequired, text, children }) => (
    <>
        <Form.Group controlId="formBasicUsername" className="mb-4">
            <Form.Control
                type="text"
                placeholder="enter username..."
                required={isRequired}
                className="bg-dark text-white border-1 border-secondary"
                name="username"
            />
        </Form.Group>
        <Form.Group controlId="formBasicEmail" className="mb-4">
            <Form.Control
                type="email"
                name="email"
                placeholder="enter e-mail..."
                required={isRequired}
                className="bg-dark text-white border-1 border-secondary"
            />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-4">
            <Form.Control
                type="password"
                name="password"
                placeholder="enter password..."
                required={isRequired}
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
            <small className="text-center">{passwordError}</small>
        </Form.Text>

        <Form.Group className="py-3">
            <Form.Control
                type="file"
                className="bg-dark text-white border-1 border-secondary"
                id="formFile"
                name="avatar"
            />

        </Form.Group>

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

// export default UserForm;
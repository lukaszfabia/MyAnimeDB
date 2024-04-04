import { Nav, Button } from "react-bootstrap";

export default function NotLoggedNavbar() {
  return (
    <>
      <Nav.Item className="ms-2 mt-3 mt-lg-auto">
        <Button href="/login" variant="outline-secondary">
          login
        </Button>
      </Nav.Item>
      <Nav.Item className="ms-2 mt-3 mt-lg-auto">
        <Button href="/register" variant="outline-success">
          register
        </Button>
      </Nav.Item>
    </>
  );
}

import { Nav, Button } from "react-bootstrap";

export default function LoggedNavbar() {
  return (
    <>
      <Nav.Item className="ms-2 mt-3 mt-lg-auto">
        <Button href="/profile" variant="outline-info">
          profile
        </Button>
      </Nav.Item>
      <Nav.Item className="ms-2 mt-3 mt-lg-auto">
        <Button href="/sign-out" variant="outline-danger">
          sign out
        </Button>
      </Nav.Item>
    </>
  );
}

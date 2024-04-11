import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "./showcase.module.css";

const CustomCard = () => {
  return (
    <>
      <Card bg="dark" text="white" className="mt-4">
        <Card.Img variant="top" src="http://placeholder.co/400x300" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </>
  );
};

const MostPopular = () => {
  return (
    <Container className="py-5">
      <h1 className={styles.h1}>Most popular anime</h1>
      <Row>
        <Col lg={4} className={styles.cardCol}>
          <CustomCard />
        </Col>
        <Col lg={4} className={styles.cardCol}>
          <CustomCard />
        </Col>
        <Col lg={4} className={styles.cardCol}>
          <CustomCard />
        </Col>
      </Row>
    </Container>
  );
};

export default MostPopular;

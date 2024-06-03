import React, { useEffect, useState } from "react";
import "../App.css";
import WelcomeContent from "../components/carousel/Caroulsel";
import MostPopular from "../components/content/Showcase";
import Footer from "../components/Footer";
import api from "../scripts/api";
import { Card, Container } from "react-bootstrap";
import { PostsProps } from "../scripts";

const Content: React.FC = () => {
  const [posts, setPosts] = useState<PostsProps[]>([]);

  useEffect(() => {
    api
      .get("/api/user/posts/")
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return [date.toLocaleTimeString(), date.toLocaleDateString()];
  };

  return (
    <Container className="py-3">
      <h1 className="display-5">Posts</h1>
      {posts.map((post: PostsProps, index: number) => (
        <Container className="py-3" key={index}>
          <Card key={index} className="bg-dark text-white p-2">
            <Card.Body>
              <Card.Header className="display-5">{post.title}</Card.Header>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>{post.content}</p>
                  <footer className="blockquote-footer py-3">
                    <cite title="Source Title">
                      Administration,{" "}
                      <span>{formatDate(post.date_posted).join(", ")}</span>
                    </cite>
                  </footer>
                </blockquote>
              </Card.Body>
            </Card.Body>
          </Card>
        </Container>
      ))}
    </Container>
  );
};

export default function Home() {
  return (
    <div className="py-1 text-white">
      <WelcomeContent />
      <hr />
      <MostPopular />
      <hr />
      <Content />
      <Footer />
    </div>
  );
}

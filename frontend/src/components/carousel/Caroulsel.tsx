import Carousel from "react-bootstrap/Carousel";

const slides = [
  {
    title: "Explore",
    description: "the world of anime and manga with us!",
    imgUrl: `${import.meta.env.VITE_API_URL}/media/backgrounds/jjk.jpg`
  },
  {
    title: "Create accout",
    description: "to follow your favorite anime and manga series!",
    imgUrl: `${import.meta.env.VITE_API_URL}/media/backgrounds/monogatari.jpg`
  },
  {
    title: "Discover",
    description: "new titles",
    imgUrl: `${import.meta.env.VITE_API_URL}/media/backgrounds/kimi_no_na_wa.jpg`
  },
];

export default function WelcomeContent() {

  return (
    <Carousel className="mt-5 mb-5">
      {slides.map((slide, index) => (
        <Carousel.Item key={index} interval={5000}>
          <img className="d-block w-100" src={slide.imgUrl} />
          <Carousel.Caption>
            <h1 className="display-2">{slide.title}</h1>
            <p className="lead">{slide.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

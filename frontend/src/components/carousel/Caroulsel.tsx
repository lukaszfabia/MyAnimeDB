import Carousel from "react-bootstrap/Carousel";

let imgUrl = `https://wallpapers.com/images/featured/jujutsu-kaisen-4k-hccbh0fp7rl24yd0.jpg`;

const slides = (placeholder = imgUrl) => {
  return [
    {
      title: "Explore",
      description: "the world of anime and manga with us!",
      imgUrl:
        "https://wallpapers.com/images/featured/jujutsu-kaisen-4k-hccbh0fp7rl24yd0.jpg",
    },
    {
      title: "Create accout",
      description: "to follow your favorite anime and manga series!",
      imgUrl: "https://wallpapercave.com/wp/wp12468516.jpg",
    },
    {
      title: "Discover",
      description: "new titles",
      imgUrl:
        "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Your-Name-4k-Background-Photos.jpg",
    },
  ];
};

export default function WelcomeContent() {
  return (
    <Carousel className="mt-4 mb-5">
      {slides().map((slide, index) => (
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

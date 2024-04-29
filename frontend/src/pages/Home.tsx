import "../App.css";
import WelcomeContent from "../components/carousel/Caroulsel";
import MostPopular from "../components/content/showcase";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="py-1 text-white">
      <WelcomeContent />
      <hr />
      <MostPopular />
      <Footer />
    </div >
  );
}
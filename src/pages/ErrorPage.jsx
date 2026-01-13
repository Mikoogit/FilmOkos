import "./ErrorPage.css";
import hero from "../assets/hero-bg.png";
import { Link } from "react-router-dom";
import Separator from "../components/Separator";

export default function ErrorPage() {
  return (
    <div className="error-page">

      <img src={hero} alt="hero" className="error-bg" />

      <div className="error-content">
        <h1 className="error-title">Error</h1>
        <h2 className="error-code">404</h2>
        <p className="error-text">Az oldal nem található</p>
        <Link to="/" className="error-button">Újra</Link>
      </div>
    <Separator thickness="4px" />
    </div>
  );
}

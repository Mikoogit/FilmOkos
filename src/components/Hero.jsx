import "./Hero.css";
import heroBg from "../assets/hero-bg.png";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <img src={heroBg} alt="Hero háttér" className="hero-bg" />

      <div className="home-hero-content">
        

        <h1>
          Üdvözlünk a <span>FilmOkos</span>-on!
        </h1>
        <p>A legjobb filmek, őszinte értékelésekkel!</p>
    <br />
        <div className="line"></div>
        <br />
        <br />
        <Link to={"/filmek"} className="ugrasgomb">Mutasd a filmeket!</Link>
      </div>
    </section>
  );
}

import "./Hero.css";
import heroBg from "../assets/hero-bg.png";

export default function Hero() {
  return (
    <section className="hero">
      <img src={heroBg} alt="Hero háttér" className="hero-bg" />

      <div className="hero-content">
        <div className="line"></div>

        <h1>
          Üdvözlünk a <span>FilmOkos</span>-on!
        </h1>
        <p>A legjobb filmek, őszinte értékelésekkel!</p>

        <div className="line"></div>
      </div>
    </section>
  );
}

import "./Footer.css";
import logo from "../assets/logo.png"; // ha külön logót használsz

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top-line"></div>

      <div className="footer-content">
        <div className="footer-left">
          <img src={logo} alt="FilmOkos logo" className="footer-logo" />
        </div>

        <div className="footer-right">
          <h3 className="footer-title">Elérhetőségek</h3>
          <p>+36 20 676 9420</p>
          <p>gitfej@gmail.com</p>
        </div>
      </div>
  <div className="footer-madeby">
    Készítette: Kollár Milán, Kohajda Benjámin, Szabó Levente
  </div>
</footer>
    );
}
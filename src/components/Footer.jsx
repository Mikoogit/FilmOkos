import "./Footer.css";
import logo from "../assets/logo.png"; 
import insta from "../assets/insta.png";
import Separator from "./Separator";
import { Link, Links, useNavigate } from "react-router-dom";



export default function Footer() {
  return (
   <>
    
    <footer className="footer">
      <Separator thickness="4px" />
      <div className="footer-content">
        <div className="footer-left">
          <Link to="/">
          <img src={logo} alt="FilmOkos logo" className="footer-logo" />
          </Link>
        </div>

        <div className="footer-right">
          <h3 className="footer-title">Elérhetőségek</h3>
          <p>+36 20 676 9420</p>
          <p>gitfej@gmail.com</p>
            <p>
          <Link to="https://www.instagram.com/">
            <img src={insta} alt="Insta logo" />
          </Link>
            </p>
        </div>
      </div>
  <div className="footer-madeby">
    Készítette: Kollár Milán Gábor, Kohajda Benjámin Olivér, Szabó Levente
  </div>
</footer>
</>
    );
}
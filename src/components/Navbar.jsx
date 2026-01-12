import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profilePic from "../assets/profile.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="navbar-logo">
        <img src={logo} alt="FilmOkos logo" />
      </div>

      {/* RIGHT SIDE (SEARCH + LOGIN + PROFILE + HAMBURGER) */}
      <div className="navbar-right">
        <div className="navbar-search">
          <input type="text" placeholder="Kereső..." />
        </div>

        <button className="login-btn">Bejelentkezés</button>

        <img src={profilePic} alt="Profil" className="profile-img" />

        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
       
      </div>
      

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="/">Főoldal</a>
          <Link to="filmek">Filmek</Link>
          <a href="/watchlist">Watchlist</a>
          <a href="/seen">Megnézve</a>
          <Link to="profil">Profil</Link>
          <a href="/reviews">Értékelések</a>
          <a href="/login">Bejelentkezés</a>
        </div>
        
      )}
       
    </nav>
  );
}

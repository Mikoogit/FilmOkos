import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profilePic from "../assets/profile.png";
import Separator from "./Separator";
import { useAuth } from "../context/AuthContext.jsx";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const role = user?.role ?? "guest";



  return (
    <>
      <nav className="navbar">
        {/* LOGO */}
        <div className="navbar-logo">
          <img src={logo} alt="FilmOkos logo" />
        </div>

        {/* RIGHT SIDE */}
        <div className="navbar-right">
          <div className="navbar-search">
            <input type="text" placeholder="Kereső..." />
          </div>

          {role === "guest" ? (
            <Link to="/bejelentkezes">
              <button className="login-btn">Bejelentkezés</button>
            </Link>
          ) : (
            <>
              <button className="login-btn" onClick={logout}>
                Kijelentkezés
              </button>
              <img src={profilePic} alt="Profil" className="profile-img" />
            </>
          )}

          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/">Főoldal</Link>
            <Link to="/filmek">Filmek</Link>
            <Link to="/megnezendo">Megnézendő</Link>
            <Link to="/megnezve">Megnézve</Link>
            {(role === "user" || role === "admin") && <Link to="/profil">Profil</Link>}
            <Link to="/ertekelesek">Értékelések</Link>
            {role === "admin" && <Link to="/admin">Admin</Link>}
            {role === "guest" && <Link to="/bejelentkezes">Bejelentkezés</Link>}
          </div>
        )}
      </nav>

      <Separator thickness="4px" />
    </>
  );
}

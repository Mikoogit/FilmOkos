import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Separator from "./Separator";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { role, isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className="navbar">

        {/* LOGO */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="FilmOkos logo" />
          </Link>
        </div>

        {/* RIGHT SIDE (SEARCH + LOGIN/LOGOUT + HAMBURGER) */}
        <div className="navbar-right">

          {/* SEARCH */}
          <div className="navbar-search">
            <input type="text" placeholder="Kereső..." />
          </div>

          {/* LOGIN / LOGOUT BUTTON (DESKTOP ONLY) */}
          {!isAuthenticated && (
            <Link className="nav-btn login-btn desktop-only" to="/bejelentkezes">
              Bejelentkezés
            </Link>
          )}

          {isAuthenticated && (
            <button className="nav-btn logout-btn desktop-only" onClick={logout}>
              Kijelentkezés
            </button>
          )}

          {/* HAMBURGER MENU BUTTON */}
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

            {/* ALWAYS VISIBLE */}
            <Link to="/">Főoldal</Link>

            {/* USER + ADMIN */}
            {(role === "user" || role === "admin") && (
              <>
                <Link to="/filmek">Filmek</Link>
                <Link to="/megnezendo">Megnézendő</Link>
                <Link to="/megnezve">Megnézve</Link>
                <Link to="/profil">Profil</Link>
                <Link to="/ertekelesek">Értékelések</Link>
              </>
            )}

            {/* ADMIN ONLY */}
            {role === "admin" && <Link to="/admin">Admin</Link>}

            {/* GUEST ONLY */}
            {!isAuthenticated && (
              <>
                <Link className="nav-btn" to="/bejelentkezes">Bejelentkezés</Link>
                <Link className="nav-btn" to="/regisztracio">Regisztráció</Link>
                <Link to="/filmek">Filmek</Link>
              </>
            )}

            {/* LOGGED IN ONLY */}
            {isAuthenticated && (
              <button className="nav-btn logout-btn desktop-only" onClick={logout}>
                Kijelentkezés
              </button>
            )}
          </div>
        )}
      </nav>

      <Separator thickness="4px" />
    </>
  );
}

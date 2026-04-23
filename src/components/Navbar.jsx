import { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Separator from "./Separator";
import { useAuth } from "../auth/AuthContext";
import MakeAdmin from "./MakeMeAdmin";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const navigate = useNavigate();
  const { role, isAuthenticated, logout } = useAuth();

  // Scroll hide/show logic
  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarStyle = {
    top: showNavbar ? "0" : "-80px",
    transition: "top 0.3s ease"
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const normalized = search.toLowerCase().trim();
    if (!normalized) return;

    navigate(`/search?q=${encodeURIComponent(normalized)}`);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar" style={navbarStyle}>

        {/* LOGO */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="FilmOkos logo" />
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="navbar-right">

          {/* SEARCH */}
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Kereső..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* LOGIN / LOGOUT (DESKTOP ONLY) */}
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

          {/* HAMBURGER */}
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

            {/* MOBILE SEARCH */}
            <form className="mobile-search" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Kereső..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {/* ALWAYS VISIBLE */}
            <Link to="/" onClick={() => setMenuOpen(false)}>Főoldal</Link>

            {/* USER + ADMIN */}
            {(role === "user" || role === "admin") && (
              <>
                <Link to="/filmek" onClick={() => setMenuOpen(false)}>Filmek</Link>
                <hr />
                <Link to="/profil" onClick={() => setMenuOpen(false)}>Profil</Link>
                <Link to="/megnezve" onClick={() => setMenuOpen(false)}>Megnézve</Link>
                <Link to="/megnezendo" onClick={() => setMenuOpen(false)}>Megnézendő</Link>
                <Link to="/ertekelesek" onClick={() => setMenuOpen(false)}>Értékelések</Link>
              </>
            )}

            {/* ADMIN ONLY */}
            {role === "admin" && (
              <>
                <hr />
                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
                <MakeAdmin />
              </>
            )}

            {/* GUEST ONLY */}
            {!isAuthenticated && (
              <>
                <Link to="/filmek" onClick={() => setMenuOpen(false)}>Filmek</Link>

                {/* MOBILE LOGIN BUTTON */}
                <Link
                  className="mobile-menu-btn"
                  to="/bejelentkezes"
                  onClick={() => setMenuOpen(false)}
                >
                  Bejelentkezés
                </Link>

                {/* MOBILE REGISTER BUTTON */}
                <Link
                  className="mobile-menu-btn"
                  to="/regisztracio"
                  onClick={() => setMenuOpen(false)}
                >
                  Regisztráció
                </Link>
              </>
            )}

            {/* LOGGED IN ONLY — MOBILE LOGOUT */}
            {isAuthenticated && (
              <button
                className="mobile-menu-btn"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
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

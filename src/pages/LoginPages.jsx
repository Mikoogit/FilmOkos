import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import logo from "../assets/logo.png";

export default function Login() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Felhasználó:", user, "Jelszó:", pwd);

    if (!user || !pwd) {
      setErrMsg("Kérlek töltsd ki az összes mezőt!");
      return;
    }

    // Sikeres bejelentkezés
    setUser("");
    setPwd("");
    setSuccess(true);

    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <section className="login-page">
      <div className="login-container">
        {success ? (
          <>
            <h1>Sikeres bejelentkezés!</h1>
            <p>Két másodperc múlva továbbirányítunk...</p>
          </>
        ) : (
          <>
            <h1>Üdvözöljük!</h1>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
              style={{ color: "red", minHeight: "1.2em" }} // fix hely hibának
            >
              {errMsg}
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Felhasználó név:</label>
              <input
                type="text"
                id="username"
                placeholder="Írd be a felhasználó neved"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />

              <label htmlFor="password">Jelszó:</label>
              <input
                type="password"
                id="password"
                placeholder="Írd be a jelszavad"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />

              <button type="submit" className="btn primary">
                Bejelentkezés
              </button>
            </form>

            <p className="or">VAGY</p>

            <div id="gomb">
            <Link to="/register" className="btn secondary">
              Regisztrálok
            </Link>
            </div>
            
          </>
        )}
      </div>
    </section>

  );
}

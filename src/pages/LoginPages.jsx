import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function LoginPages() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrMsg(err.error || "Hibás email vagy jelszó");
        return;
      }

      const data = await res.json();

      login(data);
      navigate("/profil");

    } catch (err) {
      setErrMsg("Szerver hiba");
    }
  };

  return (
    <section className="login-page">
      <div className="login-container">
        <h1>Bejelentkezés</h1>

        {errMsg && <p className="errmsg">{errMsg}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email cím</label>
          <input
            id="email"
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Jelszó</label>

          {/* PASSWORD INPUT WITH TOGGLE */}
          <div className="input-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Jelszó..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}

            </span>
          </div>

          <button className="btn primary" type="submit">
            Bejelentkezés
          </button>
        </form>

        <p className="or">— vagy —</p>

        <Link className="btn secondary" to="/regisztracio">
          Regisztráció
        </Link>
      </div>
    </section>
  );
}
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
      await login(email, password);   // <-- SUPABASE LOGIN
      navigate("/profil");

    } catch (err) {
      console.error(err);
      setErrMsg("Hibás email vagy jelszó");
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

        <Link className="register-btn" to="/regisztracio">
          Regisztráció
        </Link>
      </div>
    </section>
  );
}

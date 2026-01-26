import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterPages.css";

export default function RegisterPages() {
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
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrMsg(err.error || "A regisztráció sikertelen");
        return;
      }

      const data = await res.json();

      // Tárold a context-ben (token+user), majd navigálj a Setup oldalra.
      login(data);

      // Átadjuk a token+user-t a Setup komponensnek is (navigate state)
      navigate("/setup", { state: { token: data.token, user: data.user } });
    } catch (err) {
      setErrMsg("Szerver hiba");
    }
  };

  return (
    <section className="register-page">
      <div className="register-card">
        <div className="register-left">
          <h2>Már van fiókod?</h2>
          <Link to="/bejelentkezes" className="login-btn">
            Bejelentkezés
          </Link>
        </div>

        <div className="register-right">
          <h2>Regisztráció</h2>

          {errMsg && <p className="errmsg">{errMsg}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email cím: </label>
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
                className="toggle-password-reg"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button className="register-btn" type="submit">
              Regisztráció
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
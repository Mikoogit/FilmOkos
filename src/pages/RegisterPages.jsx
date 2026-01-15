import { Link } from "react-router-dom";
import "../styles/RegisterPages.css";
import logo from "../assets/logo.png";

const RegisterPages = () => {
  return (
    <>
    
    <div className="register-page">
   <Link to={"/"}><img src={logo} alt="Logo" className="register-logo"/></Link>
      <div className="register-card">
        
        {/* BAL OLDAL */}
        <div className="register-left">
          <p>Már van felhasználói fiókom</p>
          <Link to="/bejelentkezes" className="login-btn">
            Bejelentkezés
          </Link>
        </div>

        {/* JOBB OLDAL */}
        <div className="register-right">
          <h2>Regisztráció</h2>

          <form>
            <label>Felhasználói név:</label>
            <input type="text" placeholder="Írd ide a felhasználó neved" />

            <label>Jelszó:</label>
            <input type="password" placeholder="Írd ide a jelszavad" />

            <label>Jelszó ismét:</label>
            <input type="password" placeholder="Írd ide a jelszavad" />

            <button type="submit" className="register-btn">
              Regisztráció
            </button>
          </form>
        </div>

      </div>
    </div>
    </>
  );
};

export default RegisterPages;

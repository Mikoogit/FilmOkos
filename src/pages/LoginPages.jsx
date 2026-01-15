import React from "react";
import logo from "../assets/logo.png";
import "../styles/login.css";
import {useRef,useState,useEffect} from "react";

export default function Login() {
  const userRef = useRef();
  const errRef = useRef();
  
  const [user,setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg,setErrMsg] = useState('');
  const [success,setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user,pwd]);


  return (
    <div className="login-page">
      <img src={logo} alt="Logo" className="login-logo" />

      <div className="login-container">
        <h1>Bejelentkezés</h1>

        <label>Felhasználói név:</label>
        <input type="text" placeholder="Ide írd a felhasználó neved" />

        <label>Jelszó:</label>
        <input type="password" placeholder="Ide írd a jelszavad" />

        <a href="#" className="forgot">Elfelejtett jelszó</a>

        <button className="btn primary">BEJELENTKEZÉS</button>

        <span className="or">VAGY</span>

        <button className="btn secondary">REGISZTRÁCIÓ</button>
      </div>
    </div>
  );
}

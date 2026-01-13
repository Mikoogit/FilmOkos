import React, {useState} from "react";
import "../styles/Profile.css";

export default function Profilepage() {
  const [activeTab, setActiveTab] = useState("profil");
  return (
    <div className="profile-page">
      {/* Felső rész */}
      <div className="profile-header">
        <img
          className="avatar"
          src="https://via.placeholder.com/80"
          alt="avatar"
        />
        <span className="username">fnaf_fan01</span>
      </div>

      {/* Navigációs gombok */}
      <div className="profil-tabs">
  <button
    className={activeTab === "profil" ? "active" : ""}
    onClick={() => setActiveTab("profil")}
  >
    Profil
  </button>

  <button
    className={activeTab === "latott" ? "active" : ""}
    onClick={() => setActiveTab("latott")}
  >
    Látott
  </button>

  <button
    className={activeTab === "tervezett" ? "active" : ""}
    onClick={() => setActiveTab("tervezett")}
  >
    Tervezett látni
  </button>

  <button
    className={activeTab === "ertekelesek" ? "active" : ""}
    onClick={() => setActiveTab("ertekelesek")}
  >
    Értékelések
  </button>
</div>

      {/* Tartalom */}
      <div className="profile-content">
        {/* Leírás */}
        <div className="description-box">
          <h3>Leírás</h3>
          <div className="line"></div>
          <p>imadom a fnaf filmet
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde recusandae obcaecati laborum tempora voluptas placeat autem voluptatibus cupiditate sunt quidem, veritatis cumque asperiores nobis ipsum numquam cum accusantium facilis corrupti.
          </p>
          
        </div>

        {/* Kedvenc filmek */}
        <div className="favorites">
          <h2>Kedvenc Filmjeim:</h2>

          <div className="movie-list">
            <img src="https://via.placeholder.com/120x180" alt="movie" />
            <img src="https://via.placeholder.com/120x180" alt="movie" />
            <img src="https://via.placeholder.com/120x180" alt="movie" />
            <img src="https://via.placeholder.com/120x180" alt="movie" />
            <img src="https://via.placeholder.com/120x180" alt="movie" />
          </div>

          {/* Statisztikák */}
          <div className="stats">
            <div>
              <h1>67</h1>
              <p>Látott Filmek Száma</p>
            </div>
            <div>
              <h1>13</h1>
              <p>Megnézendő Filmek Száma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

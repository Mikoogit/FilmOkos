import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Alapértelmezett tab az URL alapján
  const [activeTab, setActiveTab] = useState(
    location.pathname.replace("/", "") || "profil"
  );

  // Tab váltás kezelése
  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path); // navigál az adott route-ra
  };

  return (
    <div className="profile-page">
      {/* Felső rész */}
      <div className="profile-header">
        <img
          className="avatar"
          src="https://placehold.co/80x80"
          alt="avatar"
        />
        <span className="username">fnaf_fan01</span>
      </div>

      {/* Navigációs gombok */}
      <div className="profil-tabs">
        <button
          className={activeTab === "profil" ? "active" : ""}
          onClick={() => handleTabClick("profil", "/profil")}
        >
          Profil
        </button>

        <button
          className={activeTab === "latott" ? "active" : ""}
          onClick={() => handleTabClick("latott", "/megnezve")}
        >
          Látott
        </button>

        <button
          className={activeTab === "tervezett" ? "active" : ""}
          onClick={() => handleTabClick("tervezett", "/tervezett")}
        >
          Tervezett látni
        </button>

        <button
          className={activeTab === "ertekelesek" ? "active" : ""}
          onClick={() => handleTabClick("ertekelesek", "/ertekelesek")}
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
          <p>
            imadom a fnaf filmet. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit.
          </p>
        </div>

        {/* Kedvenc filmek */}
        <div className="favorites">
          <h2>Kedvenc Filmjeim:</h2>
          <div className="movie-list">
            <img src="https://placehold.co/120x180" alt="movie" />
            <img src="https://placehold.co/120x180" alt="movie" />
            <img src="https://placehold.co/120x180" alt="movie" />
            <img src="https://placehold.co/120x180" alt="movie" />
            <img src="https://placehold.co/120x180" alt="movie" />
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

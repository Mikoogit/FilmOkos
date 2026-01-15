import React, { useState } from "react";
import "../styles/Profile.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function MovieSeen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.replace("/", "") || "latott"
  );

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
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
          onClick={() => handleTabClick("latott", "/latott")}
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

      {/* Filmek */}
      <div className="movie-list">
        <img src="https://placehold.co/120x180" alt="movie" />
        <img src="https://placehold.co/120x180" alt="movie" />
        <img src="https://placehold.co/120x180" alt="movie" />
        <img src="https://placehold.co/120x180" alt="movie" />
        <img src="https://placehold.co/120x180" alt="movie" />
      </div>

      <div className="movie-list">
        <img src="https://placehold.co/120x180" alt="movie" />
        <img src="https://placehold.co/120x180" alt="movie" />
        <img src="https://placehold.co/120x180" alt="movie" />
        <img src="https://placehold.co/120x180" alt="movie" />
        <img src="https://placehold.co/120x180" alt="movie" />
      </div>
      {/* További movie-list elemek ugyanígy */}
    </div>
  );
}

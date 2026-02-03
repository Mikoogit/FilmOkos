import React, { useState,useEffect } from "react";
import "../styles/Profile.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { getMovieById } from "../api/moviesApi.js";

export default function Megnezendo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plannedMovies, setPlannedMovies] = useState([]);
  const [profile, setProfile] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(
    location.pathname.replace("/", "") || "megnezendo"
  );

   const handleTabClick = (tab, path) => {
  setActiveTab(tab);

  if (viewUserId) {
    navigate(`${path}?userId=${viewUserId}`);
  } else {
    navigate(path);
  }
};
  const { user } = useAuth();

useEffect(() => {
  if (!user) return;

  let mounted = true;

  (async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/profile/${user.id}`);
      const json = await res.json();
      if (!mounted) return;

      setProfile(json.data);

      // normalize seen list
      let plannedRaw = json.data?.planned || [];
      let plannedIds = [];

      if (Array.isArray(plannedRaw)) plannedIds = plannedRaw;
      else if (typeof plannedRaw === "string") {
        try {
          plannedIds = JSON.parse(plannedRaw);
        } catch {
          plannedIds = plannedRaw.split(",");
        }
      }

      const movies = await Promise.all(
        plannedIds.map((id) => getMovieById(id).catch(() => null))
      );

      setPlannedMovies(movies.filter(Boolean));
    } catch (err) {
      console.error(err);
    }
  })();

  return () => (mounted = false);
}, [user]);


  return (
    <div className="profile-page">
      {/* Felső rész */}
      <div className="profile-header">
        <img
          className="avatar"
          src={profile?.avatar_url || "https://placehold.co/80x80"}
          alt="avatar"
        />
        <div className="header-content">
          <span className="username">{profile?.username || user?.email || "Vendég"}</span>
          {viewUserId === user?.id && (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-profile-btn"
            >
              Profil Szerkesztése
            </button>
          )}
        </div>
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
          className={activeTab === "megnezendo" ? "active" : ""}
          onClick={() => handleTabClick("megnezendo", "/megnezendo")}
        >
          Megnézendő
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
        

        {/* Kedvenc filmek */}
        <div className="favorites">
        <h2>Megnézendő filmek:</h2>

<div className="movie-list">
  {plannedMovies.length === 0 ? (
    <p style={{ color: "white", fontStyle: "italic" }}>
      Még nincs megjelölve megtekintendő film.
    </p>
  ) : (
    plannedMovies.map((movie) => (
      <img
        key={movie.id}
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        onClick={() => navigate(`/filmek/${movie.id}`)}
        style={{ cursor: "pointer" }}
      />
    ))
  )}
</div>

          
          
        </div>
      </div>
    </div>
    
     

          
  );
}

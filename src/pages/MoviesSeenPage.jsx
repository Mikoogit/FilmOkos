import React, { useState,useEffect } from "react";
import "../styles/Profile.css";
import { useNavigate, useLocation,useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { getMovieById } from "../api/moviesApi.js";

export default function MovieSeen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [seenMovies, setSeenMovies] = useState([]);
  const [profile, setProfile] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [activeTab, setActiveTab] = useState(
    location.pathname.replace("/", "") || "latott"
  );
const params = useParams();
const { user } = useAuth();
useEffect(() => {
  const searchParams = new URLSearchParams(location.search || "");
  const targetId =
    params?.userId ||
    searchParams.get("userId") ||
    user?.id ||
    null;

  setViewUserId(targetId);
}, [user, location.search, params?.userId]);


  const handleTabClick = (tab, path) => {
  setActiveTab(tab);

  if (viewUserId) {
    navigate(`${path}?userId=${viewUserId}`);
  } else {
    navigate(path);
  }
};

  

useEffect(() => {
  if (!viewUserId) return;

  let mounted = true;

  (async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/profile/${viewUserId}`
      );
      const json = await res.json();
      if (!mounted) return;

      setProfile(json.data);

      let seenRaw = json.data?.seen || [];
      let seenIds = [];

      if (Array.isArray(seenRaw)) seenIds = seenRaw;
      else if (typeof seenRaw === "string") {
        try {
          seenIds = JSON.parse(seenRaw);
        } catch {
          seenIds = seenRaw.split(",");
        }
      }

      const movies = await Promise.all(
        seenIds.map((id) => getMovieById(id).catch(() => null))
      );

      setSeenMovies(movies.filter(Boolean));
    } catch (err) {
      console.error(err);
    }
  })();

  return () => (mounted = false);
}, [viewUserId]);



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
          className={activeTab === "megnezve" ? "active" : ""}
          onClick={() => handleTabClick("megnezve", "/megnezve")}
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
          <h2>Látott Filmek:</h2>
            <div className="movie-list">
  {seenMovies.length === 0 ? (
    <p style={{ color: "white", fontStyle: "italic" }}>
      Még nem jelölt meg látott filmet.
    </p>
  ) : (
    seenMovies.map((movie) => (
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

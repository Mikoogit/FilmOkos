import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../styles/Profile.css";
import { useAuth } from "../auth/AuthContext";
import { getMovieById } from "../api/moviesApi";
import { supabase } from "../db/supaBaseClient";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [viewUserId, setViewUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ username: "", bio: "", avatar_url: "" });
  const [isSaving, setIsSaving] = useState(false);

  const params = useParams();

  // Alapértelmezett tab az URL alapján
  const [activeTab, setActiveTab] = useState(
    location.pathname.replace("/", "") || "profil"
  );

  // Tab váltás kezelése
 const handleTabClick = (tab, path) => {
  setActiveTab(tab);

  if (viewUserId) {
    navigate(`${path}?userId=${viewUserId}`);
  } else {
    navigate(path);
  }
};


  useEffect(() => {
    // determine which profile to view: route param > query param > authenticated user
    const searchParams = new URLSearchParams(location.search || "");
    const targetId = params?.userId || searchParams.get("userId") || user?.id || null;
    setViewUserId(targetId);

    if (!targetId) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/profile/${targetId}`);
        if (!res.ok) {
          console.error("GET profile failed");
          return;
        }
        const json = await res.json();
        if (mounted) {
          setProfile(json.data || null);
          // only prefill editData when viewing own profile
          if (targetId === user?.id) {
            setEditData({
              username: json.data?.username || "",
              bio: json.data?.bio || "",
              avatar_url: json.data?.avatar_url || ""
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => (mounted = false);
  }, [user, location.search]);

  // Listen for profile updates dispatched from other pages (e.g. MovieOpen)
  useEffect(() => {
    const handler = (e) => {
      const updated = e?.detail || null;
      if (updated) {
        setProfile(updated);
        setEditData({
          username: updated?.username || "",
          bio: updated?.bio || "",
          avatar_url: updated?.avatar_url || ""
        });
      }
    };
    window.addEventListener('profileUpdated', handler);
    return () => window.removeEventListener('profileUpdated', handler);
  }, []);

  // Ha profil betöltődött, lekérjük a kedvencek film adatait (max 10)
  useEffect(() => {
    if (!profile) return;
    let mounted = true;
    (async () => {
      try {
        // normalize favorites (may be JSON string, comma string, or array)
        const favsRaw = profile.favorites ?? [];
        console.log('Profile favorites raw:', favsRaw, 'type:', typeof favsRaw);
        let favIds = [];
        if (Array.isArray(favsRaw)) favIds = favsRaw;
        else if (typeof favsRaw === "string") {
          try { favIds = JSON.parse(favsRaw); }
          catch (_) { favIds = favsRaw ? favsRaw.split(",") : []; }
        }
        console.log('Favorite IDs after normalization:', favIds);
        const ids = favIds.slice(0, 10);
        const movies = await Promise.all(
          ids.map((id) => getMovieById(id).catch(() => null))
        );
        if (!mounted) return;
        console.log('Loaded favorite movies:', movies.filter(Boolean).length);
        setFavoriteMovies(movies.filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    })();
    return () => (mounted = false);
  }, [profile]);

  // Avatar feltöltés kezelése
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 300;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxSize) {
            h = Math.round((h * maxSize) / w);
            w = maxSize;
          }
        } else {
          if (h > maxSize) {
            w = Math.round((w * maxSize) / h);
            h = maxSize;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL("image/jpeg", 0.7);
        setEditData({ ...editData, avatar_url: base64 });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Profil mentése
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;
      
      const response = await fetch(`http://localhost:3000/api/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: editData.username,
          bio: editData.bio,
          avatar_url: editData.avatar_url
        })
      });

      if (response.ok) {
        const json = await response.json();
        setProfile(json.data || null);
        setIsEditing(false);
        window.dispatchEvent(new CustomEvent("profileUpdated", { detail: json.data }));
      } else {
        console.error("Save failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Szerkesztés Modal */}
      {isEditing && (
        <div className="edit-modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Profil Szerkesztése</h2>
            
            {/* Avatar szerkesztés */}
            <div className="edit-section">
              <label>Profilkép:</label>
              <img
                src={editData.avatar_url || "https://placehold.co/80x80"}
                alt="preview"
                className="avatar-preview"
              />
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleAvatarChange}
                className="file-input"
              />
            </div>

            {/* Username szerkesztés */}
            <div className="edit-section">
              <label>Felhasználónév:</label>
              <input
                type="text"
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                className="edit-input"
              />
            </div>

            {/* Bio szerkesztés */}
            <div className="edit-section">
              <label>Bemutatkozás:</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="edit-textarea"
                rows={4}
              />
            </div>

            {/* Gombok */}
            <div className="edit-buttons">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="save-btn"
              >
                {isSaving ? "Mentés..." : "Mentés"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
              >
                Mégse
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="description-box">
          <h3>Leírás</h3>
          <div className="line"></div>
          <p>{profile?.bio || "Nincs még bemutatkozás. Állítsd be profilodat a Profil beállítása oldalon."}</p>
        </div>

        {/* Kedvenc filmek */}
        <div className="favorites">
          <h2>Kedvenc Filmjeim:</h2>
          <div className="movie-list">
            {favoriteMovies.length === 0 ? (
              <p style={{ color: "white", fontStyle: "italic" }}>Nincs még kedvenc filmed.</p>
            ) : (
              favoriteMovies.map((m) => (
                <img
                  key={m.id}
                  src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                  alt={m.title}
                  onClick={() => navigate(`/filmek/${m.id}`)}
                  style={{ cursor: "pointer" }}
                />
              ))
            )}
          </div>
          
        <div class="line"></div>

          {/* Statisztikák */}
          <div className="stats">
            <div>
              <h1>{(profile?.seen || []).length}</h1>
              <p>Látott Filmek Száma</p>
            </div>
            <div>
              <h1>{(profile?.planned || []).length}</h1>
              <p>Megnézendő Filmek Száma</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
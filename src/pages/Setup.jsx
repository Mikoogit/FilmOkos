import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../db/supaBaseClient";
import "../styles/Setup.css";

export default function Setup() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // token és user a navigate state-ből (fallback üzenet, ha nincs)
  const token = state?.token;
  const user = state?.user;

  // Ha a backend visszaadott tokennel érkeztünk ide, állítsuk be a kliens session-t
  useEffect(() => {
    if (!token) return;
    // setSession várhatóan triggereli az AuthContext onAuthStateChange eseményét
    (async () => {
      try {
        await supabase.auth.setSession({ access_token: token });
      } catch (err) {
        console.error("Failed to set supabase session:", err);
      }
    })();
  }, [token]);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setErr("Csak PNG, JPG vagy JPEG fájlok engedélyezettek");
      return;
    }

    // Convert to base64 and compress via canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas and resize to max 300x300
        const canvas = document.createElement("canvas");
        const maxSize = 300;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with JPEG compression
        const base64 = canvas.toDataURL("image/jpeg", 0.7);
        setAvatarUrl(base64);
        setAvatarPreview(base64);
        setErr("");
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  if (!token || !user) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        Hiányzik a bejelentkezés: jelentkezz be újra.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          bio,
          avatar_url: avatarUrl
        })
      });

      if (!res.ok) {
        const errRes = await res.json();
        setErr(errRes.error || "Hiba a feltöltésnél");
        setIsLoading(false);
        return;
      }

      // siker -> profil oldalra
      navigate("/profil");
    } catch (error) {
      setErr("Szerver hiba");
      setIsLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Profil Beállítása</h1>
          <p className="setup-subtitle">Tölts ki néhány adatot a profil létrehozásához</p>
        </div>

        {err && <div className="setup-error-box">{err}</div>}

        <form onSubmit={handleSubmit} className="setup-form">
          {/* Avatar upload */}
          <div className="setup-section">
            <label className="section-label">Profilkép</label>
            <div className="avatar-upload">
              {avatarPreview && (
                <img src={avatarPreview} alt="preview" className="avatar-preview" />
              )}
              {!avatarPreview && (
                <div className="avatar-placeholder">
                  <span>📷</span>
                </div>
              )}
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleAvatarChange}
                className="file-input"
              />
            </div>
          </div>

          {/* Username */}
          <div className="setup-section">
            <label htmlFor="username" className="section-label">Felhasználónév *</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="setup-input"
              placeholder="pl. CinemaLover123"
            />
          </div>

          {/* Bio */}
          <div className="setup-section">
            <label htmlFor="bio" className="section-label">Rövid bemutatkozás</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="setup-textarea"
              placeholder="Írj pár szót magadról..."
              rows={4}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="setup-submit-btn"
          >
            {isLoading ? "Mentés..." : "Profil Létrehozása"}
          </button>
        </form>

        <p className="setup-skip">
          <button
            type="button"
            onClick={() => navigate("/profil")}
            className="skip-btn"
          >
            Kihagyás
          </button>
        </p>
      </div>
    </div>
  );
}
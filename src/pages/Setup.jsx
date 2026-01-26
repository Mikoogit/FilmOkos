import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Setup() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // token és user a navigate state-ből (fallback üzenet, ha nincs)
  const token = state?.token;
  const user = state?.user;

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [err, setErr] = useState("");

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
        return;
      }

      // siker -> profil oldalra
      navigate("/profil");
    } catch (error) {
      setErr("Szerver hiba");
    }
  };

  return (
    <section style={{ padding: 24, color: "white" }}>
      <h2>Profil beállítása</h2>
      {err && <p style={{ color: "salmon" }}>{err}</p>}
      <form onSubmit={handleSubmit}>
        <label>Felhasználónév</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Rövid bemutatkozás</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

        <label>Avatar URL</label>
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />

        <button type="submit">Mentés</button>
      </form>
    </section>
  );
}
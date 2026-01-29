import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Profile.css"

const Profil = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const user = state?.user;
  const token = state?.token;

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/api/profile/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data.data);
      })
      .catch(() => setError("Nem sikerült betölteni a profilt"));
  }, []);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Betöltés...</p>;

  return (
    <div className="profil-page">

      <div className="profil-top">
        <img
          src={profile.avatar_url || "/default-avatar.png"}
          alt="avatar"
          className="avatar"
        />
        <h2 className="username">{profile.username}</h2>
      </div>

      <div className="profil-desc">
        <h3>Leírás</h3>
        <p>{profile.bio || "Nincs leírás"}</p>
      </div>

    </div>
  );
};

export default Profil;

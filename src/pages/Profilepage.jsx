import "../styles/Profile.css";

export default function Profilepage() {
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
      <div className="profile-tabs">
        <button>Profil</button>
        <button>Látott</button>
        <button>Tervezett látni</button>
        <button>Értékelések</button>
      </div>

      {/* Tartalom */}
      <div className="profile-content">
        {/* Leírás */}
        <div className="description-box">
          <h3>Leírás</h3>
          <p>imadom a fnaf filmet</p>
          <p>it be the nightguard</p>
        </div>

        {/* Kedvenc filmek */}
        <div className="favorites">
          <h2>Kedvenc Filmeim:</h2>

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

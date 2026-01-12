import React from "react";
import "./Profile.css";

const Profil = () => {
  return (
    
    <div className="profil-page">
      
      {/* Profil fejléc */}
      <div className="profil-top">
        <img
          src="https://i.imgur.com/0y0y0y0.png"
          alt="avatar"
          className="avatar"
        />
        <h2 className="username">fnaf_fan01</h2>
      </div>

      {/* Profil navigáció */}
      <div className="profil-tabs">
        <button className="active">Profil</button>
        <button>Látott</button>
        <button>Tervezett látni</button>
        <button>Értékelések</button>
      </div>

      {/* Tartalom */}
      <div className="profil-content">
        {/* Leírás */}
        <div className="profil-desc">
          <h3>Leírás</h3>
          <p>
            imadom a fnaf filmet <br />
            it be the nightguard
          </p>
        </div>

        {/* Kedvenc filmek */}
        <div className="profil-main">
          <h2>Kedvenc Filmjeim:</h2>

          <div className="film-list">
            {[1, 2, 3, 4, 5].map((film) => (
              <img
                key={film}
                src="https://i.imgur.com/JhZKQnH.jpg"
                alt="film"
                className="film-poster"
              />
            ))}
          </div>

          {/* Statisztika */}
          <div className="stats">
            <div className="stat">
              <h1>67</h1>
              <p>Látott Filmek Száma</p>
            </div>
            <div className="stat">
              <h1>13</h1>
              <p>Megnézendő Filmek Száma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;

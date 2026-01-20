import React, { useEffect, useState } from "react";
import { Form, useParams } from "react-router-dom";
import { getMovieById } from "../api/moviesApi";
import "../styles/MovieOpen.css"

const MovieOpen = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      const data = await getMovieById(movieId);
      console.log("FETCHED MOVIE:", data);
      setMovie(data);
    }
    fetchMovie();
  }, [movieId]);

  if (!movie) return <h1 style={{ color: "white" }}>BETÖLTÉS...</h1>;

return (
  <>
    <section
      className="movie-open-hero"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="hero-gradient">
        <div className="hero-content">
          <div className="hero-left">
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
          </div>

          <div className="hero-center">
            <h1>{movie.title}</h1>

            <div className="meta">
              <span>{movie.release_date}</span>
              <span>{movie.genres.map((g) => g.name).join(", ")}</span>
            </div>

            <div className="rating">⭐⭐⭐⭐⭐</div>

            <div className="color-dots">
              <span className="dot blue" />
              <span className="dot red" />
              <span className="dot white" />
            </div>

            <p className="overview-szoveg">{movie.overview}</p>
          </div>

          <div className="hero-right-shadow" />
        </div>
      </div>
    </section>

    {/* --- ITT KEZDŐDIK AZ ÚJ TARTALOM --- */}
    <section className="movie-open-content">
      <div className="reviews">
        <h2>Vélemények</h2>
        <div className="review-box">
          <strong>Vélemény tőle: USERNAME</strong>
            <div className="textarea"></div>
        </div>
        <p>Összes vélemény</p>
      </div>

      <div className="keywords">
        <h3>Kulcsszavak</h3>
        <ul>
          <li>Kulcsszó</li>
          <li>Kulcsszó</li>
          <li>Kulcsszó</li>
          <li>Kulcsszó</li>
        </ul>
      </div>
    </section>

    <section className="trailer-section">
      <h3>{movie.title} Trailer</h3>
      <div className="trailer-video">
        {/* Ide jöhet a Youtube iframe vagy videó */}
      </div>
    </section>

    <section className="media-section">
      <h3>Képek/Videók</h3>
      <div className="media-gallery">
        {/* Képek vagy videók listája */}
      </div>
    </section>
  </>
);

};

export default MovieOpen;

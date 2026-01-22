import React, { useEffect, useState } from "react";
import { Form, useParams } from "react-router-dom";
import {getMovieImages,
  getMovieVideos,
  getMovieKeywords,
   getMovieById } from "../api/moviesApi";
import "../styles/MovieOpen.css"
import "../styles/ImageClick.css"

const MovieOpen = () => {

  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);


useEffect(() => {
  async function fetchAllMovieData() {
    try {
      const movieData = await getMovieById(movieId);
      const imagesData = await getMovieImages(movieId);
      const videosData = await getMovieVideos(movieId);
      const keywordsData = await getMovieKeywords(movieId);

      setMovie(movieData);
      setImages(imagesData.backdrops || []);
      setVideos(videosData.results || []);
      setKeywords(keywordsData.keywords || []);
    } catch (error) {
      console.error(error);
    }
  }

  fetchAllMovieData();
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

            <div className="dots">
                <span className="dot">
                    <img src="./assets/bookmark.png" alt="" />
                </span>
              <span className="dot" />
              <span className="dot" />
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
        <a className="linkv" href="">Összes Vélemény</a>
      </div>

      <div className="keywords">
        <h3>Kulcsszavak</h3>
        <ul>
  {keywords.map((k) => (
    <li key={k.id}>{k.name}</li>
  ))}
</ul>

      </div>
    </section>

    <section className="trailer-section">
  <h3>{movie.title} Trailer</h3>
  <div className="trailer-video">
    {videos.length === 0 ? (
      <p style={{ color: "white", fontStyle: "italic" }}>Betöltés…</p>
    ) : videos.find((v) => v.type === "Trailer") ? (
      <iframe
        width="100%"
        height="600"
        src={`https://www.youtube.com/embed/${videos.find(
          (v) => v.type === "Trailer"
        ).key}`}
        title="Movie Trailer"
        frameBorder="0"
        allowFullScreen
      />
    ) : (
      <p style={{ color: "white", fontStyle: "italic" }}>Nincs elérhető trailer</p>
    )}
  </div>
</section>

<section className="image-section">
  <h3>Média:</h3>
  <div className="media-gallery">
    
    {images.slice(0, 6).map((img) => (
      <img
        key={img.file_path}
        src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
        alt="Movie still"
        className="clickable-image"
        onClick={() =>
          setSelectedImage(`https://image.tmdb.org/t/p/original${img.file_path}`)
        }
      />
    ))}
    {selectedImage && (
  <div
    className="lightbox"
    onClick={() => setSelectedImage(null)} // click anywhere to close
  >
    <img src={selectedImage} alt="Selected" className="lightbox-image" />
  </div>
)}

  </div>
</section>

  </>
);

};

export default MovieOpen;

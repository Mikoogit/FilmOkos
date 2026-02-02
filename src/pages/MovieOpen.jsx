import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieImages,
  getMovieVideos,
  getMovieKeywords,
  getMovieById,
} from "../api/moviesApi";
import MovieReview from "../pages/MovieReviewPage.jsx";
import "../styles/MovieOpen.css";
import "../styles/ImageClick.css";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../db/supaBaseClient";
import heartIcon from "../assets/heart.png";
import bookmark from "../assets/bookmark.png";
import check from "../assets/check-circle.png";




const MovieOpen = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const [inSeen, setInSeen] = useState(false);

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

  // Betölti a profilt
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/profile/${user.id}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const p = json.data || null;
        setProfile(p);
        // DB uses `planned` for watchlist and `favorites` for favorites
        const planned = p?.planned || [];
        const favsRaw = p?.favorites ?? [];
        let favsArr = [];
        if (Array.isArray(favsRaw)) favsArr = favsRaw;
        else if (typeof favsRaw === "string") {
          try { favsArr = JSON.parse(favsRaw); }
          catch (_) { favsArr = favsRaw ? favsRaw.split(",") : []; }
        }
        setInWatchlist((planned || []).map(String).includes(String(movieId)));
        setInFavorites((favsArr || []).map(String).includes(String(movieId)));
        setInSeen((p?.seen || []).map(String).includes(String(movieId)));
      } catch (err) {
        console.error(err);
      }
    })();
    return () => (mounted = false);
  }, [user, movieId]);

  const toggleList = async (listName) => {
    if (!user) {
      alert("Jelentkezz be a művelethez");
      return;
    }

    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) {
      alert("Hiányzó token");
      return;
    }

    const currentlyIn =
      listName === "watchlist" ? inWatchlist : listName === "favorites" ? inFavorites : inSeen;

    const action = currentlyIn ? "remove" : "add";

    // Map logical lists to actual DB columns
    const columnMap = { watchlist: "planned", favorites: "favorites", seen: "seen" };
    const columnName = columnMap[listName] || listName;
    const bodyPayload = { list: columnName, movieId: movieId, action };

    try {
      console.log('Sending profile list update', { userId: user.id, body: bodyPayload });
      const { data: sessData } = await supabase.auth.getSession();
      console.log('Client session data:', sessData);

      const res = await fetch(`http://localhost:3000/api/profile/${user.id}/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        // Próbáljuk JSON-ként olvasni, ha nem megy akkor plain text
        let message = "Hiba a lista frissítésénél";
        try {
          const jsonErr = await res.json();
          if (jsonErr) message = jsonErr.error || jsonErr.message || JSON.stringify(jsonErr);
        } catch (e) {
          try {
            const txt = await res.text();
            if (txt) message = txt;
          } catch (_) {}
        }
        console.error("Profile list update failed (status", res.status, "):", message);
        alert(`(${res.status}) ${message}`);
        return;
      }

      const json = await res.json();
      const updated = json.data || null;
      console.log('Profil sikeresen frissítve, válasz:', json);
      console.log('Updated object:', updated);
      alert('Profil lista sikeresen frissítve');
      
      // Refresh profile data from server to ensure we have latest
      const refreshRes = await fetch(`http://localhost:3000/api/profile/${user.id}`);
      if (refreshRes.ok) {
        const refreshJson = await refreshRes.json();
        const freshProfile = refreshJson.data || updated;
        console.log('Fresh profile after update:', freshProfile);
        setProfile(freshProfile);
        
        // dispatch event so other pages can react
        try {
          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: freshProfile }));
        } catch (e) {}

        // normalize updated fields from fresh data
        const updatedPlanned = freshProfile?.planned || [];
        const updatedFavsRaw = freshProfile?.favorites ?? [];
        console.log('updatedFavsRaw:', updatedFavsRaw, 'type:', typeof updatedFavsRaw);
        let updatedFavs = [];
        if (Array.isArray(updatedFavsRaw)) updatedFavs = updatedFavsRaw;
        else if (typeof updatedFavsRaw === "string") {
          try { updatedFavs = JSON.parse(updatedFavsRaw); }
          catch (_) { updatedFavs = updatedFavsRaw ? updatedFavsRaw.split(",") : []; }
        }
        console.log('updatedFavs after normalization:', updatedFavs);

        setInWatchlist((updatedPlanned || []).map(String).includes(String(movieId)));
        setInFavorites((updatedFavs || []).map(String).includes(String(movieId)));
        setInSeen((freshProfile?.seen || []).map(String).includes(String(movieId)));
      } else {
        console.error("Failed to refresh profile");
      }
    } catch (err) {
      console.error('Toggle list error:', err);
      alert(err?.message || 'Ismeretlen hiba');
    }
  };

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

              <p className="overview-szoveg">{movie.overview}</p>

              <div className="movie-actions">
                <button
                  className={"action-btn list" + (inWatchlist ? "active" : "")}
                  onClick={() => toggleList("watchlist")}
                >
                  <img src={bookmark} alt="mini" className="mini-logo" />
                  Megnézendő
                </button>

                <button
                  className={"action-btn favorite" + (inFavorites ? "active" : "")}
                  onClick={() => toggleList("favorites")}
                >
                  <img src={heartIcon} alt="kedvenc" className="mini-logo" />
                  Kedvenc
                </button>

                <button
                  className={"action-btn seen" + (inSeen ? "active" : "")}
                  onClick={() => toggleList("seen")}
                >
                  <img src={check} alt="mini" className="mini-logo" />
                  Láttam
                </button>
              </div>
            </div>

            <div className="hero-right-shadow" />
          </div>
        </div>
      </section>

      <section className="movie-open-content">
        <div className="reviews">
          <MovieReview filmId={movieId} />
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
              src={`https://www.youtube.com/embed/${
                videos.find((v) => v.type === "Trailer").key
              }`}
              title="Movie Trailer"
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <p style={{ color: "white", fontStyle: "italic" }}>
              Nincs elérhető trailer
            </p>
          )}
        </div>
      </section>

      <section className="image-section">
        <h3>Média:</h3>
        <div className="media-gallery">
          {images.slice(0, 30).map((img) => (
            <img
              key={img.file_path}
              src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
              alt="Movie still"
              className="clickable-image"
              onClick={() =>
                setSelectedImage(
                  `https://image.tmdb.org/t/p/original${img.file_path}`
                )
              }
            />
          ))}

          {selectedImage && (
            <div className="lightbox" onClick={() => setSelectedImage(null)}>
              <img src={selectedImage} alt="Selected" className="lightbox-image" />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MovieOpen;

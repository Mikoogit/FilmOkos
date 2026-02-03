import { useEffect, useState, useRef } from 'react';
import { supabase } from '../db/supaBaseClient';
import { getMovieById } from '../api/moviesApi';
import "../components/Reviews.css";
import ReviewCard from './ReviewCard';
import "../styles/ReviewCard.css";

export function ReviewList({ isAdmin }) {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const moviesRef = useRef({});

  // --- 1. Értékelések + profilok betöltése ---
  useEffect(() => {
    async function loadReviews() {
      setLoadError(null);
      setLoading(true);

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      setLoading(false);

      if (error) {
        console.error(error);
        setLoadError("Nem sikerült betölteni az értékeléseket.");
        return;
      }

      try {
        const userIds = Array.from(
          new Set(data.map((r) => r.user_id).filter(Boolean))
        );

        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, avatar_url, username")
            .in("id", userIds);

          const profileMap = (profiles || []).reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
          }, {});

          const merged = data.map((r) => ({
            ...r,
            avatar: profileMap[r.user_id]?.avatar_url || null,
            reviewerName: profileMap[r.user_id]?.username || r.name,
          }));

          setReviews(merged);
        } else {
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to load reviewer profiles", err);
        setReviews(data);
      }
    }

    loadReviews();
  }, []);

  // --- 2. Realtime sync ---
  useEffect(() => {
    const channel = supabase
      .channel("public:reviews")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        (payload) => {
          setReviews((current) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new, ...current];
              case "UPDATE":
                return current.map((r) =>
                  r.id === payload.new.id ? payload.new : r
                );
              case "DELETE":
                return current.filter((r) => r.id !== payload.old.id);
              default:
                return current;
            }
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // --- 3. Filmek betöltése cache-elve ---
  useEffect(() => {
    async function loadMovies() {
      const missingFilmIds = reviews
        .map((r) => r.film_api_id)
        .filter((id) => id && !moviesRef.current[id]);

      if (missingFilmIds.length === 0) return;

      const newMovies = {};

      await Promise.all(
        missingFilmIds.map(async (filmId) => {
          try {
            const movie = await getMovieById(filmId);
            newMovies[filmId] = movie;
          } catch (err) {
            console.warn("Film nem tölthető:", filmId);
          }
        })
      );

      moviesRef.current = { ...moviesRef.current, ...newMovies };
      setMovies({ ...moviesRef.current });
    }

    if (reviews.length > 0) {
      loadMovies();
    }
  }, [reviews]);

  // --- 4. Törlés ---
  const handleDelete = async (id) => {
    setDeleteError(null);

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      setDeleteError("Nem sikerült törölni az értékelést (lehet, hogy nincs jogosultság).");
    }
  };

  // --- 5. Render ---
  if (loading) {
    return (
      <div className="card">
        <h2>Értékelések</h2>
        <p>Betöltés...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="card">
        <h2>Értékelések</h2>
        <p className="error-text">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Értékelések</h2>
      {deleteError && <div className="error-text">{deleteError}</div>}

      {reviews.length === 0 ? (
        <p>Még nincs értékelés. Légy te az első!</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => {
            const movie = movies[review.film_api_id];
            if (!movie) return null;

            return (
              <div key={review.id} className="review-item">
                <div className="reviewer-profile" style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <img
                    src={review.avatar || "/default-avatar.png"}
                    alt={review.reviewerName || "Profilkép"}
                    style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10, objectFit: "cover" }}
                    onError={(e) => { e.target.src = "/default-avatar.png"; }}
                  />
                  <span style={{ fontWeight: "bold" }}>
                    {review.reviewerName || "Ismeretlen felhasználó"}
                  </span>
                </div>

                <ReviewCard
                  movieId={review.film_api_id}
                  poster={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  backdrop={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                  rating={review.rating}
                  text={review.comment}
                  reviewerName={review.reviewerName}
                  reviewerAvatar={review.avatar}
                  reviewerId={review.user_id}
                />

                {isAdmin && (
                  <div>
                    <button className="danger small" onClick={() => handleDelete(review.id)}>
                      Törlés
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReviewList;

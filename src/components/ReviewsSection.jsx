import { useEffect, useState } from "react";
import { getMovieById } from "../api/moviesApi";
import ReviewCard from "./ReviewCard";
import "../styles/ReviewSection.css";

export default function LatestReviews({ reviews = [] }) {
  const [finalReviews, setFinalReviews] = useState([]);
  const [movies, setMovies] = useState({});

  useEffect(() => {
    async function load() {
      const goodReviews = [];
      const movieMap = {};

      for (const r of reviews) {
        if (goodReviews.length >= 9) break;
        if (!r.film_api_id) continue;

        try {
          const movie = await getMovieById(r.film_api_id);
          movieMap[r.id] = movie;
          goodReviews.push(r);
        } catch (err) {
          console.warn("TMDB fetch failed for:", r.film_api_id);
        }
      }

      setMovies(movieMap);
      setFinalReviews(goodReviews);
    }

    load();
  }, [reviews]);

  return (
    <section className="latest-reviews">
      <h2>Legújabb Értékelések</h2>

      <div className="review-grid">
        {finalReviews.map((review) => {
          const movie = movies[review.id];
          if (!movie) return null;

          return (
            <ReviewCard
              key={review.id}
              movieId={review.film_api_id}
              poster={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              backdrop={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
              rating={review.rating}
              text={review.comment}
              reviewerName={review.reviewerName || review.name}
              reviewerAvatar={review.avatar}
              reviewerId={review.user_id}
            />
          );
        })}
      </div>

      <button className="more-reviews-btn">Több Értékelés</button>
    </section>
  );
}

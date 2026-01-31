import "../styles//ReviewCard.css";
import { useNavigate } from "react-router-dom";

export default function ReviewCard({ movieId, poster, backdrop, rating, text }) {
  
  const navigate = useNavigate();

  return (
    <div className="review-card">

      <div
        className="review-banner"
        style={{ backgroundImage: `url(${backdrop})` }}
      >
        <div className="review-overlay">
          <div className="review-rating">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
          <p className="review-text">{text}</p>
        </div>
      </div>

      {/* Kattintható poszter */}
      <div
        className="review-poster"
        onClick={() => navigate(`/filmek/${movieId}`)}
        style={{ cursor: "pointer" }}
      >
        <img src={poster} alt="poster" />
      </div>

    </div>
  );
}




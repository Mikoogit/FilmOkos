import "../styles//ReviewCard.css";
import { useNavigate } from "react-router-dom";

export default function ReviewCard({ movieId, poster, backdrop, rating, text, reviewerName, reviewerAvatar, reviewerId }) {
  
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
          {reviewerName && (
            <div className="reviewer-info">
              {reviewerAvatar && (
                <img
                  src={reviewerAvatar}
                  alt={reviewerName}
                  className="reviewer-avatar"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (reviewerId) navigate(`/user/${reviewerId}`);
                  }}
                  style={{ cursor: "pointer" }}
                />
              )}
              <span className="reviewer-name">{reviewerName}</span>
            </div>
          )}
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




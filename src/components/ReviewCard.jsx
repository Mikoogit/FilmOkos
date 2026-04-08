import "../styles//ReviewCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReviewModal from "./ReviewModal";

export default function ReviewCard({ movieId, poster, backdrop, rating, text, reviewerName, reviewerAvatar, reviewerId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const isReviewLong = text && text.length > 50;
  const previewText = isReviewLong ? `${text.slice(0, 50).trim()}...` : text;

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
          <div className="review-text-container">
            <p className="review-text">{previewText}</p>
            {isReviewLong && (
              <button
                className="review-more-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                Tovább...
              </button>
            )}
          </div>
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

      {isModalOpen && (
        <ReviewModal
          text={text}
          rating={rating}
          reviewerName={reviewerName}
          onClose={() => setIsModalOpen(false)}
        />
      )}

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




export default function ReviewModal({ text, onClose, reviewerName, rating }) {
  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h2>Teljes értékelés</h2>
          {reviewerName && <span className="review-modal-author">{reviewerName}</span>}
        </div>
        <div className="review-modal-stars">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
        <div className="review-modal-text">{text}</div>
        <button className="review-modal-close" onClick={onClose}>
          Bezárás
        </button>
      </div>
    </div>
  );
}

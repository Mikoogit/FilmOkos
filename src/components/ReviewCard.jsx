export default function ReviewCard({ poster, rating, text }) {
  return (
    <div className="review-card">
      <img src={"https://static.posters.cz/image/750webp/116103.webp"} alt="poster" />

      <div className="review-rating">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>

      <p className="review-text">{text}</p>
    </div>
  );
}

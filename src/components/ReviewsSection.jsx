import "./Reviews.css";
import { reviews } from "../reviews/reviews.js"; 
import { Link } from "react-router-dom";
import ReviewCard from "./ReviewCard";


export default function ReviewsSection() {
  const six = reviews.slice(0, 6);

  return (
    <section className="reviews-section">
      <h2 className="reviews-title">Legújabb Értékelések</h2>

      <div className="reviews-grid">
        {six.map((r) => (
          <ReviewCard key={r.id} {...r} />
        ))}
      </div>

      {/* <button className="reviews-button">Több Értékelés</button> */}
      <Link to="/ertekelesek" className="reviews-button">Több értékelés</Link>

    </section>
  );
}



import { useRef } from "react";
import "./Carousel.css";
import { useNavigate } from "react-router-dom";

export default function Carousel({ title, movies }) {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    const slider = sliderRef.current;
    slider.scrollBy({
      left: -slider.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const slider = sliderRef.current;
    slider.scrollBy({
      left: slider.clientWidth,
      behavior: "smooth",
    });
  };

  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / 20) * -1;
    const rotateY = (x - centerX) / 20;

    card.style.transform = `
      scale(1.08)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
  };

  const resetTilt = (e) => {
    const card = e.currentTarget;
    card.style.transform = "scale(1)";
  };

  return (
    <section className="carousel-section">
      <h2 className="section-title">{title}</h2>

      <div className="carousel-container">
        <button className="arrow left" onClick={scrollLeft}>◀</button>

        <div className="carousel-slider" ref={sliderRef}>
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/filmek/${movie.id}`)}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              style={{ cursor: "pointer" }}
            >
              <img
                loading="lazy"
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "/no-poster.png"
                }
                alt={movie.title}
              />
              <div className="movie-title">{movie.title}</div>
            </div>
          ))}
        </div>

        <button className="arrow right" onClick={scrollRight}>▶</button>
      </div>
    </section>
  );
}

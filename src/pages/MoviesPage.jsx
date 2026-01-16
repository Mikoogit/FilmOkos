import React, { useState } from "react";
import "../styles/MoviePages.css";
import "../api/moviesApi.js";

const filters = {
  genres: ["Műfaj", "Akció", "Dráma", "Vígjáték"],
  years: ["Év", "2026", "2025", "2024"],
  ratings: ["Értékelés", "5+", "4+", "3+"],
  sortBy: ["Sorrend", "Népszerűség", "Újdonság", "Értékelés"],
};

export default function MoviePages() {
  const [activeFilters, setActiveFilters] = useState({
    genre: "Műfaj",
    year: "Év",
    rating: "Értékelés",
    sort: "Sorrend",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 999;

  const handleFilterClick = (type, value) => {
    setActiveFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pagesToShow = [1, 2, 3, 4, "...", totalPages];

  const movies = Array(30).fill(null).map((_, i) => ({
    id: i + 1,
    title: `FNAF Freddy ${i + 1}`,
    poster_path: "/fpdH92J9FGiCFhT6NS8Ib6NplVI.jpg",
  }));

  return (
    <div className="movie-grid-wrapper">
      <div className="filter-bar">
        {Object.entries(filters).map(([key, options]) => (
          <div key={key} className="filter-group">
            {options.map((opt) => (
              <button
                key={opt}
                className={activeFilters[key.slice(0, -1)] === opt ? "active" : ""}
                onClick={() => handleFilterClick(key.slice(0, -1), opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
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

      <div className="pagination">
        {pagesToShow.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="dots">...</span>
          ) : (
            <button
              key={p}
              className={currentPage === p ? "active" : ""}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>
    </div>
  );
}

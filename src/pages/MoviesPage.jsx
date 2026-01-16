import React, { useState, useEffect } from "react";
import "../styles/MoviePages.css";
import { getPopularMovies } from "../api/moviesApi.js"; // helyes útvonal szerint

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

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const moviesFromApi = await getPopularMovies(currentPage);
        setMovies(moviesFromApi);
      } catch (error) {
        console.error("API hiba:", error);
        setMovies([]);
      }
    }
    fetchMovies();
  }, [currentPage]);

  const handleFilterClick = (type, value) => {
    setActiveFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
    // később ide jöhet az API hívás szűréssel
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pagesToShow = [1, 2, 3, 4, "...", totalPages];

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
        {movies.length > 0 ? (
          movies.map((movie) => (
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
          ))
        ) : (
          <p>Nincsenek filmek.</p>
        )}
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

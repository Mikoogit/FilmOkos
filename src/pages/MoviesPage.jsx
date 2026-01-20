import React, { useState, useEffect } from "react";
import "../styles/MoviePages.css";
import { getPopularMovies } from "../api/moviesApi.js"; 
import { useNavigate } from "react-router-dom";


const filters = {
  genres: ["Műfaj", "Akció", "Dráma", "Vígjáték"],
  years: ["Év", "2026", "2025", "2024"],
  ratings: ["Értékelés", "5+", "4+", "3+"],
  sortBy: ["Sorrend", "Népszerűség", "Újdonság", "Értékelés"],
};

export default function MoviePages() {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    genre: "Műfaj",
    year: "Év",
    rating: "Értékelés",
    sort: "Sorrend",
  });

  const [openMenus, setOpenMenus] = useState({
    genre: false,
    year: false,
    rating: false,
    sort: false,
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

  const toggleMenu = (type) => {
    setOpenMenus((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleFilterClick = (type, value) => {
    setActiveFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
    toggleMenu(type);
    // később ide jöhet az API hívás szűréssel
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pagesToShow = [1, 2, 3, "...", totalPages];

  return (
    <div className="movie-grid-wrapper">
      <div className="filter-bar">
        {Object.entries(filters).map(([key, options]) => {
          const typeKey = key.slice(0, -1);
          const isOpen = openMenus[typeKey];
          return (
            <div key={key} className="filter-menu-wrapper">
              <button
                className="hamburger-button"
                onClick={() => toggleMenu(typeKey)}
                aria-expanded={isOpen}
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span className="filter-label">{options[0]}</span>
              </button>
              {isOpen && (
                <div className="filter-dropdown">
                  {options.slice(1).map((opt) => (
                    <button
                      key={opt}
                      className={`filter-option ${activeFilters[typeKey] === opt ? "active" : ""}`}
                      onClick={() => handleFilterClick(typeKey, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
           <div
  key={movie.id}
  className="movie-card"
  onClick={() => navigate(`/filmek/${movie.id}`)}
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

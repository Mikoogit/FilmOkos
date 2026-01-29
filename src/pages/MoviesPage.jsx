// src/pages/MoviesPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { discoverMovies, getGenres } from "../api/moviesApi.js";
import { useNavigate } from "react-router-dom";
import "../styles/MoviePages.css";

const staticFilters = {
  years: ["Év", "2026", "2025", "2024"],
  ratings: ["Értékelés", "5+", "4+", "3+"],
  sortBy: ["Sorrend", "Népszerűség", "Újdonság", "Értékelés"],
};

const sortMap = {
  Népszerűség: "popularity.desc",
  Újdonság: "primary_release_date.desc",
  Értékelés: "vote_average.desc",
};
const ratingMap = {
  "5+": 5,
  "4+": 4,
  "3+": 3,
};

export default function MoviesPage() {
  const navigate = useNavigate();

  const [genres, setGenres] = useState([{ id: null, name: "Műfaj" }]);
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
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(
    () => ({
      genres: genres.map((g) => g.name),
      years: staticFilters.years,
      ratings: staticFilters.ratings,
      sortBy: staticFilters.sortBy,
    }),
    [genres]
  );

  useEffect(() => {
    async function loadGenres() {
      try {
        const g = await getGenres();
        setGenres([{ id: null, name: "Műfaj" }, ...g]);
      } catch (e) {
        console.error("Genres API hiba:", e);
      }
    }
    loadGenres();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const selectedGenre = genres.find((g) => g.name === activeFilters.genre);
        const params = {
          page: currentPage,
          genreId: selectedGenre && selectedGenre.id ? selectedGenre.id : undefined,
          year:
            activeFilters.year && activeFilters.year !== "Év"
              ? activeFilters.year
              : undefined,
          minRating: ratingMap[activeFilters.rating],
          sortBy: sortMap[activeFilters.sort],
        };
        const { results, total_pages } = await discoverMovies(params);
        setMovies(results || []);
        setTotalPages(total_pages || 1);
      } catch (error) {
        console.error("API hiba:", error);
        setMovies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeFilters, genres]);

  const toggleMenu = (type) => {
    setOpenMenus((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleFilterClick = (type, value) => {
    setActiveFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
    setOpenMenus((prev) => ({ ...prev, [type]: false }));
  };

  const handlePageChange = (page) => {
    if (typeof page !== "number") return;
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPagesToShow = (current, last) => {
    const pages = [];
    if (last <= 7) {
      for (let i = 1; i <= last; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const left = Math.max(2, current - 1);
    const right = Math.min(last - 1, current + 1);

    if (left > 2) pages.push("left-ellipsis");

    for (let p = left; p <= right; p++) pages.push(p);

    if (right < last - 1) pages.push("right-ellipsis");

    pages.push(last);

    return pages;
  };

  const pagesToShow = getPagesToShow(currentPage, totalPages);

  // add fallback class to .poster if browser doesn't support aspect-ratio
  useEffect(() => {
    if (!window.CSS || !CSS.supports || !CSS.supports("aspect-ratio", "1 / 1")) {
      document.querySelectorAll(".poster").forEach((p) => p.classList.add("fallback"));
    }
  }, [movies]);

  // Close menus when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      const wrappers = document.querySelectorAll(".filter-menu-wrapper");
      let inside = false;
      wrappers.forEach((wr) => {
        if (wr.contains(e.target)) inside = true;
      });
      if (!inside) {
        setOpenMenus({ genre: false, year: false, rating: false, sort: false });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="movie-grid-wrapper">
      <div className="filter-bar" role="toolbar" aria-label="Filters">
        {Object.entries(filters).map(([key, options]) => {
          const typeKey =
            key === "genres"
              ? "genre"
              : key === "sortBy"
              ? "sort"
              : key === "ratings"
              ? "rating"
              : "year";
          const isOpen = openMenus[typeKey];
          const label = activeFilters[typeKey] || options[0];
          return (
            <div key={key} className="filter-menu-wrapper">
              <button
                className="hamburger-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(typeKey);
                }}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-controls={`filter-${typeKey}`}
              >
                <span className="hamburger-icon" aria-hidden>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span className="filter-label">{label}</span>
              </button>
              {isOpen && (
                <div
                  id={`filter-${typeKey}`}
                  className={`filter-dropdown open`}
                  role="menu"
                  aria-hidden={!isOpen}
                >
                  <div className="filter-options">
                    {options.map((opt) => (
                      <button
                        key={opt}
                        role="menuitem"
                        className={`filter-option ${
                          activeFilters[typeKey] === opt ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterClick(typeKey, opt);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="movie-grid" role="list">
        {loading ? (
          <p>Betöltés…</p>
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/filmek/${movie.id}`)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(`/filmek/${movie.id}`);
              }}
            >
              <div className="poster">
                <img
                  loading="lazy"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "/no-poster.png"
                  }
                  alt={movie.title}
                />
              </div>
              <div className="movie-title">{movie.title}</div>
            </div>
          ))
        ) : (
          <p>Nincsenek filmek.</p>
        )}
      </div>

      <div className="pagination" role="navigation" aria-label="Pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Prev
        </button>

        {pagesToShow.map((p, idx) =>
          p === "left-ellipsis" || p === "right-ellipsis" ? (
            <span key={p + idx} className="dots" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={p}
              className={currentPage === p ? "active" : ""}
              onClick={() => handlePageChange(p)}
              aria-current={currentPage === p ? "page" : undefined}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { GENRE_MAP } from "../genres/genreMap";
import { fetchGenres } from "../genres/genreService";

import "../styles/SearchResult.css";

const API_KEY = "87eee4638866715a67d09c89be17ca69";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q")?.toLowerCase().trim() || "";

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const seenIdsRef = useRef(new Set());
  const isFetchingRef = useRef(false);

  const isGenreSearch = GENRE_MAP.hasOwnProperty(query);
  const genreId = GENRE_MAP[query];

  // 🎭 Műfajok
  useEffect(() => {
    async function loadGenres() {
      const list = await fetchGenres(API_KEY);
      const map = {};
      list.forEach((g) => (map[g.id] = g.name));
      setGenres(map);
    }
    loadGenres();
  }, []);

  // 🎬 Fetch + filter + dedupe (LOCKOLT)
  const loadMovies = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    const url = isGenreSearch
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&language=hu-HU`
      : `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}&page=${page}&language=hu-HU`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results?.length) {
        setHasMore(false);
        return;
      }

      const clean = [];

      for (const movie of data.results) {
        if (!movie.poster_path) continue;
        if (seenIdsRef.current.has(movie.id)) continue;

        seenIdsRef.current.add(movie.id);
        clean.push(movie);
      }

      if (clean.length === 0) {
        // ha az egész oldal kuka volt, próbáljuk a következőt
        setPage((p) => p + 1);
      } else {
        setMovies((prev) => [...prev, ...clean]);
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [query, page, isGenreSearch, genreId, hasMore]);

  // 🔄 Új keresés = teljes reset
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    seenIdsRef.current.clear();
  }, [query]);

  // ⬇️ Page change trigger
  useEffect(() => {
    loadMovies();
  }, [page, loadMovies]);

  // ♾️ Infinite scroll (STABIL)
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 400
      ) {
        if (!loading && hasMore && !isFetchingRef.current) {
          setPage((p) => p + 1);
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  if (!loading && movies.length === 0) {
    return <p style={{ padding: "1rem" }}>Nincs találat</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>
        Találatok erre: <em>{query}</em>
      </h2>

      <div className="movie-grid">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/filmek/${movie.id}`}
            className="movie-kartya"
          >
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
            />

            <h3>{movie.title}</h3>
            <p>Megjelenés: {movie.release_date?.slice(0, 4) || "N/A"}</p>
            <p>
              Műfajok:{" "}
              {movie.genre_ids?.map((id) => genres[id] || id).join(", ")}
            </p>
          </Link>
        ))}
      </div>

      {loading && (
        <div className="skeleton-container">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      )}
    </div>
  );
}

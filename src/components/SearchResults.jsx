import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { GENRE_MAP } from "../genres/genreMap";
import { fetchGenres } from "../genres/genreService";

const API_KEY = "87eee4638866715a67d09c89be17ca69";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q")?.toLowerCase().trim() || "";

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isGenreSearch = GENRE_MAP.hasOwnProperty(query);
  const genreId = GENRE_MAP[query];

  // Genre ID -> név visszafejtés
  useEffect(() => {
    async function loadGenres() {
      const list = await fetchGenres(API_KEY);
      const map = {};
      list.forEach((g) => (map[g.id] = g.name));
      setGenres(map);
    }
    loadGenres();
  }, []);

  // Filmek betöltése API-ból)
  const loadMovies = useCallback(async () => {
    setLoading(true);

    let url = "";
    if (isGenreSearch) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&language=hu-HU`;
    } else {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}&language=hu-HU`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.results?.length) {
      setMovies((prev) => [...prev, ...data.results]);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [query, page, isGenreSearch, genreId]);

  // Új keresés esetén reset
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  // Betöltés page alapján
  useEffect(() => {
    loadMovies();
  }, [page, loadMovies]);

  // Infinite scroll
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loading &&
        hasMore
      ) {
        setPage((p) => p + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  if (!loading && movies.length === 0)
    return <p style={{ padding: "1rem" }}>Nincs találat</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>
        Találatok: <em>{query}</em>
      </h2>

      <div style={styles.grid}>
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/filmek/${movie.id}`}
            style={styles.card}
            className="movie-card"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=Nincs+kép"
              }
              alt={movie.title}
              style={styles.poster}
            />

            <h3>{movie.title}</h3>
            <p>Megjelenés: {movie.release_date?.slice(0, 4) || "N/A"}</p>

            <p>
              Műfajok:{" "}
              {movie.genre_ids
                ?.map((id) => genres[id] || id)
                .join(", ")}
            </p>
          </Link>
        ))}
      </div>

      {/* Skeleton loader animáció */}
      {loading && (
        <div style={styles.skeletonContainer}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={styles.skeletonCard} className="skeleton" />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#000000",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    textDecoration: "none",
    color: "white",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  poster: {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "0.5rem",
  },
  skeletonContainer: {
    marginTop: "2rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  skeletonCard: {
    height: "350px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #eee, #ddd, #eee)",
    animation: "loading 1.5s infinite",
  },
};

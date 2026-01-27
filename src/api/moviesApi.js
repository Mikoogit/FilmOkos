// src/api/moviesApi.js
const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "87eee4638866715a67d09c89be17ca69";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }
  return res.json();
}

/* --- New preferred APIs --- */

export const getGenres = async (language = "hu-HU") => {
  const url = `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=${language}`;
  const data = await fetchJson(url);
  return data.genres;
};

export const discoverMovies = async ({
  page = 1,
  genreId,
  year,
  minRating,
  sortBy,
  minVoteCount,
  language = "hu-HU",
} = {}) => {
  const url = new URL(`${BASE_URL}/discover/movie`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", language);
  url.searchParams.set("page", page);

  if (genreId) url.searchParams.set("with_genres", genreId);
  if (year) url.searchParams.set("primary_release_year", year);
  if (minRating) url.searchParams.set("vote_average.gte", minRating);
  if (minVoteCount) url.searchParams.set("vote_count.gte", minVoteCount);
  if (sortBy) url.searchParams.set("sort_by", sortBy);

  url.searchParams.set("include_adult", "false");

  const data = await fetchJson(url.toString());
  return { results: data.results, total_pages: data.total_pages, total_results: data.total_results };
};

/* --- Compatibility / convenience wrappers --- */

export const getWeeklyPopularMovies = async (language = "hu-HU") => {
  const url = `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=${language}`;
  const data = await fetchJson(url);
  return data.results;
};

export const getUpcomingMovies = async (language = "hu-HU", page = 1) => {
  const url = `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=${language}&page=${page}`;
  const data = await fetchJson(url);
  return data.results;
};

// TopRated now defaults to minVoteCount = 300
export const TopRated = async (language = "hu-HU", page = 1, minVoteCount = 300) => {
  const url = new URL(`${BASE_URL}/discover/movie`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", language);
  url.searchParams.set("page", page);
  url.searchParams.set("sort_by", "vote_average.desc");
  url.searchParams.set("vote_count.gte", String(minVoteCount));
  url.searchParams.set("include_adult", "false");

  const data = await fetchJson(url.toString());
  return data.results;
};

export const getPopularMovies = async (page = 1, language = "hu-HU") => {
  const url = `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=${language}&page=${page}`;
  const data = await fetchJson(url);
  return data.results;
};

export const getMovieById = async (movieId, language = "hu-HU") => {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=${language}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Nem sikerült lekérni a filmet");
  return res.json();
};

export const getMovieImages = async (movieId) => {
  const url = `${BASE_URL}/movie/${movieId}/images?api_key=${TMDB_API_KEY}`;
  return fetchJson(url);
};

export const getMovieVideos = async (movieId, language = "hu-HU") => {
  const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=${language}`;
  return fetchJson(url);
};

export const getMovieKeywords = async (movieId) => {
  const url = `${BASE_URL}/movie/${movieId}/keywords?api_key=${TMDB_API_KEY}`;
  return fetchJson(url);
};

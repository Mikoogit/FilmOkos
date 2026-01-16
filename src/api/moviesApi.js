const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "87eee4638866715a67d09c89be17ca69";

export const getWeeklyPopularMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=hu-HU`
  );
  const data = await res.json();
  return data.results;
};

export const getUpcomingMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=hu-HU`
  );
  const data = await res.json();
  return data.results;
};

export const TopRated = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=hu-HU`
  );
  const data = await res.json();
  return data.results;
};
export const getPopularMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=hu-HU`
  );
  const data = await res.json();
  return data.results;
};


// genreService.js
export async function fetchGenres(API_KEY) {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=hu-HU`
    );
    const data = await res.json();
    return data.genres; // [{id:28, name:"Akció"}, ...]
  }
  
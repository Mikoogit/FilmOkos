import { useEffect, useState } from "react";
import {
  getWeeklyPopularMovies,
  getUpcomingMovies
} from "../api/moviesApi";

import { BrowserRouter, Routes, Route,useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Separator from "../components/Separator";
import Carousel from "../components/Carousel";
import ReviewsSection from "../components/ReviewsSection";

export default function HomePage() {
  const navigate = useNavigate();
  const [weeklyMovies, setWeeklyMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
  async function loadData() {
    const popular = await getWeeklyPopularMovies();
    const upcoming = await getUpcomingMovies();

    // Normalizáló függvény: kisbetű, ékezet nélkül, whitespace nélkül
    const normalize = (str) =>
      str
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

    const filteredUpcoming = upcoming.filter((movie) => {
      return !popular.some((p) => {
        const sameId = p.id === movie.id;
        const sameTitle = normalize(p.title) === normalize(movie.title);
        const sameYear =
          p.release_date?.slice(0, 4) === movie.release_date?.slice(0, 4);
        // Ha azonos az ID, vagy ha azonos a cím és a megjelenési év, akkor duplikált
        return sameId || (sameTitle && sameYear);
      });
    });

    setWeeklyMovies(popular);
    setUpcomingMovies(filteredUpcoming);
  }

  loadData();
}, []);



  return (
    <>
      <Hero />
      <Separator thickness="2px" />

      <Carousel
        title="Népszerű a héten"
        movies={weeklyMovies}
      />

      <Carousel
        title="Közelgő Filmek"
        movies={upcomingMovies}
      />

      <ReviewsSection />
    </>
  );
}

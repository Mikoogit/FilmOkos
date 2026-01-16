import { useEffect, useState } from "react";
import {
  getWeeklyPopularMovies,
  getUpcomingMovies
} from "../api/moviesApi";

import Hero from "../components/Hero";
import Separator from "../components/Separator";
import Carousel from "../components/Carousel";
import ReviewsSection from "../components/ReviewsSection";

export default function HomePage() {
  const [weeklyMovies, setWeeklyMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
    getWeeklyPopularMovies().then(data => setWeeklyMovies(data.slice(0, 6)));
    getUpcomingMovies().then(data => setUpcomingMovies(data.slice(0, 6)));
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

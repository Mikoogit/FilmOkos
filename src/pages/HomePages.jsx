import { useEffect, useState } from "react";
import {
  getWeeklyPopularMovies,
  getUpcomingMovies
} from "../api/moviesApi";

import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Separator from "../components/Separator";
import Carousel from "../components/Carousel";
import LatestReviews from "../components/ReviewsSection";
import { supabase } from "../db/supaBaseClient.js";

export default function HomePage() {
  const navigate = useNavigate();
  const [weeklyMovies, setWeeklyMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [reviews, setReviews] = useState([]);

  // TMDB filmek betöltése
  useEffect(() => {
    async function loadData() {
      const popular = await getWeeklyPopularMovies();
      const upcoming = await getUpcomingMovies();

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
          return sameId || (sameTitle && sameYear);
        });
      });

      setWeeklyMovies(popular);
      setUpcomingMovies(filteredUpcoming);
    }

    loadData();
  }, []);

  // Review-k betöltése
  useEffect(() => {
    async function loadReviews() {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      setReviews(data || []);
    }

    loadReviews();
  }, []);

  return (
    <>
      <Hero />
      <Separator thickness="2px" />

      <Carousel title="Népszerű a héten" movies={weeklyMovies} />
      <Carousel title="Közelgő Filmek" movies={upcomingMovies} />

      <LatestReviews
        reviews={reviews.slice(0, 6)}
      />
    </>
  );
}

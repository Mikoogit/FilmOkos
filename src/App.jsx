import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePages.jsx";
import Filmek from "./pages/MoviesPage.jsx";
import Profil from "./pages/ProfilePage.jsx";
import Login from "./pages/LoginPages.jsx";
import RegisterPages from "./pages/RegisterPages.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import MovieReview from "./pages/MovieReviewPage.jsx";
import MovieSeen from "./pages/MoviesSeenPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import MoviePages from "./pages/MoviesPage.jsx";
import MovieOpen from "./pages/MovieOpen.jsx";
import SearchResults from "./components/SearchResults.jsx";

import Loader from "./components/Loader.jsx";   
import { useState, useEffect } from "react";    

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Loader megjelenítése*/}
        {loading && (
          <div className="fullscreen-loader">
            <Loader />
          </div>
        )}

        <Navbar />

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/bejelentkezes" element={<Login />} />
          <Route path="/regisztracio" element={<RegisterPages />} />
          <Route path="/filmek" element={<MoviePages />} />
          <Route path="/filmek/:movieId" element={<MovieOpen />} />

          {/* ÚJ: TMDB keresés */}
          <Route path="/search" element={<SearchResults />} />

          {/* USER + ADMIN ROUTES */}
          <Route
            path="/profil"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Profil />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ertekelesek"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <MovieReview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/megnezve"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <MovieSeen />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ONLY ROUTE */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

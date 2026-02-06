import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePages.jsx";
import Profil from "./pages/Profilepage.jsx";
import Login from "./pages/LoginPages.jsx";
import RegisterPages from "./pages/RegisterPages.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import MovieReview from "./pages/MovieReviewPage.jsx";
import ReviewList from "./components/ReviewList.jsx";
import MovieSeen from "./pages/MoviesSeenPage.jsx";
import MoviePages from "./pages/MoviesPage.jsx";
import MovieOpen from "./pages/MovieOpen.jsx";
import SearchResults from "./components/SearchResults.jsx";
import Setup from "./pages/Setup.jsx";
import Loader from "./components/Loader.jsx";
import Megnezendo from "./pages/ToBeSeen.jsx";

import { useState, useEffect } from "react";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import AdminRoute from "./auth/AdminRoute.jsx";

// ADMIN OLDALAK
import AdminDashboard from "./pages/admin/AdminDashBoard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminMovies from "./pages/admin/AdminMovies.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
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
        <Route path="/setup" element={<Setup />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Publikus user profil (view-only) */}
        <Route path="/user/:userId" element={<Profil />} />

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
              <ReviewList />
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

        <Route
          path="/megnezendo"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Megnezendo />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/movies"
          element={
            <AdminRoute>
              <AdminMovies />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

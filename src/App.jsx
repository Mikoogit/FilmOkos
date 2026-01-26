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
import MovieSeen from "./pages/MoviesSeenPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import MoviePages from "./pages/MoviesPage.jsx";
import MovieOpen from "./pages/MovieOpen.jsx";
import SearchResults from "./components/SearchResults.jsx";
import Setup from "./pages/Setup.jsx";
import Loader from "./components/Loader.jsx";   
import { useState, useEffect } from "react";    

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
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


          {/* ÚJ: TMDB keresés */}
          <Route path="/search" element={<SearchResults />} />

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

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

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

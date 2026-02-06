import { useEffect, useState } from "react";
import { supabase } from "../../db/supaBaseClient";
import AdminLayout from "../../admin/layout/AdminLayout";
import { Link } from "react-router-dom";
import "../../admin/layout/dashboard/dashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);

    // Összes user
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Adminok
    const { count: adminCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    // Tiltottak
    const { count: bannedCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "banned");

    // Kedvencek összesen
    const { data: favData } = await supabase
      .from("profiles")
      .select("favorites");

    const totalFavorites = favData?.reduce(
      (sum, u) => sum + (u.favorites?.length || 0),
      0
    );

    // Megnézendők összesen
    const { data: plannedData } = await supabase
      .from("profiles")
      .select("planned");

    const totalPlanned = plannedData?.reduce(
      (sum, u) => sum + (u.planned?.length || 0),
      0
    );

    // Top 10 aktív user
    const { data: allUsers } = await supabase
      .from("profiles")
      .select("id, username, favorites, planned, seen");

    const sorted = allUsers
      .map((u) => ({
        ...u,
        activity:
          (u.favorites?.length || 0) +
          (u.planned?.length || 0) +
          (u.seen ? Object.keys(u.seen).length : 0),
      }))
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 10);

    setTopUsers(sorted);

    // Legutóbbi 10 regisztráció
    const { data: recent } = await supabase
      .from("profiles")
      .select("id, username, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    setRecentUsers(recent);

    // Legnépszerűbb filmek
    const movieCounts = {};

    favData.forEach((u) => {
      (u.favorites || []).forEach((movieId) => {
        movieCounts[movieId] = (movieCounts[movieId] || 0) + 1;
      });
    });

    const topMovies = Object.entries(movieCounts)
      .map(([movieId, count]) => ({ movieId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setPopularMovies(topMovies);

    setStats({
      totalUsers,
      adminCount,
      bannedCount,
      totalFavorites,
      totalPlanned,
    });

    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="admin-title">Admin Dashboard</h1>

        {loading && <p>Betöltés...</p>}

        {stats && (
          <>
            {/* STAT KÁRTYÁK */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Összes felhasználó</h3>
                <p>{stats.totalUsers}</p>
              </div>

              <div className="stat-card">
                <h3>Adminok</h3>
                <p>{stats.adminCount}</p>
              </div>

              <div className="stat-card">
                <h3>Tiltott felhasználók</h3>
                <p>{stats.bannedCount}</p>
              </div>

              <div className="stat-card">
                <h3>Kedvencek összesen</h3>
                <p>{stats.totalFavorites}</p>
              </div>

              <div className="stat-card">
                <h3>Megnézendők összesen</h3>
                <p>{stats.totalPlanned}</p>
              </div>
            </div>

            {/* TOP 10 USER */}
            <h2 className="section-title">Top 10 legaktívabb felhasználó</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Felhasználó</th>
                  <th>Aktivitás</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username || u.id}</td>
                    <td>{u.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOP 10 FILM */}
            <h2 className="section-title">Top 10 legnépszerűbb film</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Film ID</th>
                  <th>Kedvencek száma</th>
                </tr>
              </thead>
              <tbody>
                {popularMovies.map((m) => (
                  <tr key={m.movieId}>
                    <td>{m.movieId}</td>
                    <td>{m.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* LEGUTÓBBI 10 REGISZTRÁCIÓ */}
            <h2 className="section-title">Legutóbbi 10 regisztráció</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Felhasználó</th>
                  <th>Regisztrált</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username || u.id}</td>
                    <td>{new Date(u.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* GYORS LINKEK */}
            <h2 className="section-title">Gyors műveletek</h2>
            <div className="quick-links">
              <Link className="quick-link" to="/admin/users">Felhasználók kezelése</Link>
              <Link className="quick-link" to="/admin/movies">Filmek kezelése</Link>
              <Link className="quick-link" to="/admin/dashboard">Dashboard frissítése</Link>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

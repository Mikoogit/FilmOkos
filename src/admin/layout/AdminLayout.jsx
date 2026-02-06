import { Link } from "react-router-dom";
import "./admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>

        <nav className="admin-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Felhasználók</Link>
          <Link to="/admin/movies">Filmek</Link>
          <Link to="/admin/settings">Beállítások</Link>
          <Link to="/admin/logs">Logok</Link>

        </nav>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

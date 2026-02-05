import { useEffect, useState } from "react";
import { supabase } from "../../db/supaBaseClient";
import AdminLayout from "../../admin/layout/AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // melyik usert frissítjük

  const loadUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, created_at, favorites, planned, bio, role, seen")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(data);
    } catch (err) {
      console.error("User load error:", err);
      setError("Nem sikerült betölteni a felhasználókat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔥 Szerepkör váltás
  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      setUpdating(userId);

      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      // UI frissítése
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Role update error:", err);
      alert("Nem sikerült módosítani a szerepkört.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-users-page">
      <div className="admin-container">
        <h1 className="admin-title">Felhasználók</h1>

        {loading && <p>Betöltés...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Felhasználónév</th>
                <th>Avatar</th>
                <th>Regisztrált</th>
                <th>Kedvencek</th>
                <th>Megnézendő</th>
                <th>Bio</th>
                <th>Szerepkör</th>
                <th>Művelet</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username || "—"}</td>

                  <td>
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        alt="avatar"
                        style={{ width: 40, height: 40, borderRadius: "50%" }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleString()
                      : "—"}
                  </td>

                  <td>{u.favorites?.length || 0}</td>
                  <td>{u.planned?.length || 0}</td>
                  <td>{u.bio || "—"}</td>

                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background: u.role === "admin" ? "#c62828" : "#1565c0",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => toggleRole(u.id, u.role)}
                      disabled={updating === u.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        background: "#444",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      {updating === u.id
                        ? "Mentés..."
                        : u.role === "admin"
                        ? "Userré tesz"
                        : "Adminná tesz"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </AdminLayout>
  );
}

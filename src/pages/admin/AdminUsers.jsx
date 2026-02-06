import { useEffect, useState } from "react";
import { supabase } from "../../db/supaBaseClient";
import AdminLayout from "../../admin/layout/AdminLayout";
import { useAuth } from "../../auth/AuthContext";

export default function AdminUsers() {
  const { user } = useAuth(); // saját user azonosításához (a tiltás ellen)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  // -------------------------------------------------------
  // USERS BETÖLTÉSE
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // SZEREPKÖR VÁLTÁS (admin <-> user)
  // -------------------------------------------------------
  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      setUpdating(userId);

      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

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

  // -------------------------------------------------------
  // TILTÁS / FELOLDÁS (banned <-> user)
  // -------------------------------------------------------
  const toggleBan = async (userId, currentRole) => {
    if (userId === user?.id) {
      alert("Saját magadat nem tilthatod le.");
      return;
    }

    const newRole = currentRole === "banned" ? "user" : "banned";

    try {
      setUpdating(userId);

      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Ban update error:", err);
      alert("Nem sikerült módosítani a tiltást.");
    } finally {
      setUpdating(null);
    }
  };
  const deleteUser = async (userId) => {
    if (!confirm("Biztosan törlöd ezt a felhasználót? Ez végleges.")) return;

    if (userId === user?.id) {
      alert("Saját magadat nem törölheted.");
      return;
    }

    try {
      setUpdating(userId);

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!res.ok) {
        throw new Error("Törlés sikertelen");
      }

      // UI frissítése
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Nem sikerült törölni a felhasználót.");
    } finally {
      setUpdating(null);
    }
  };


  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
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
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    Műveletek
                  </th>

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
                          background:
                            u.role === "admin"
                              ? "#c62828"
                              : u.role === "banned"
                                ? "#6a1b9a"
                                : "#1565c0",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* TILTÁS */}
                    <td>
                      <button
                        onClick={() => toggleBan(u.id, u.role)}
                        disabled={updating === u.id}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          background:
                            u.role === "banned" ? "#2e7d32" : "#b71c1c",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        {updating === u.id
                          ? "Mentés..."
                          : u.role === "banned"
                            ? "Feloldás"
                            : "Tiltás"}
                      </button>
                    </td>

                    {/* SZEREPKÖR VÁLTÁS */}
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
                    <td>
                      <button
                        onClick={() => deleteUser(u.id)}
                        disabled={updating === u.id}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          background: "#d32f2f",
                          color: "white",
                          cursor: "pointer",
                          hover: { background: "#b71c1c" },
                        }}
                      >
                        {updating === u.id ? "Törlés..." : "Törlés"}
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

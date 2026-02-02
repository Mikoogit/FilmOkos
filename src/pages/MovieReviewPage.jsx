import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../db/supaBaseClient";
import { useAuth } from "../auth/AuthContext.jsx";
import "../components/Reviews.css";

export default function MovieReview({ filmId }) {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", rating: "5", comment: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "5", comment: "" });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // -----------------------------
  // VALIDÁCIÓ
  // -----------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Név megadása kötelező.";

    const ratingNumber = Number(form.rating);
    if (!ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
      newErrors.rating = "Az értékelésnek 1 és 5 között kell lennie.";
    }

    if (!form.comment.trim()) {
      newErrors.comment = "Szöveges vélemény megadása kötelező.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // ÚJ ÉRTÉKELÉS 
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      setSubmitError("Be kell jelentkezned az értékeléshez.");
      return;
    }

    if (!validate()) return;

    const tempId = "temp-" + Math.random().toString(36).slice(2);

    const optimisticReview = {
      id: tempId,
      name: form.name.trim(),
      rating: Number(form.rating),
      comment: form.comment.trim(),
      film_api_id: filmId,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    // HOZZÁADÁS
    setReviews((prev) => [optimisticReview, ...prev]);

    const oldForm = form;
    setForm({ name: "", rating: "5", comment: "" });
    setSubmitting(true);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        name: optimisticReview.name,
        rating: optimisticReview.rating,
        comment: optimisticReview.comment,
        film_api_id: filmId,
        user_id: user.id,
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      console.error(error);
      setSubmitError("Hiba történt a mentés során.");
      // visszaállítjuk a listát
      setReviews((prev) => prev.filter((r) => r.id !== tempId));
      setForm(oldForm);
      return;
    }

    // temp helyett a valódi DB rekord
    setReviews((prev) =>
      prev.map((r) => (r.id === tempId ? data : r))
    );
  };

  // -----------------------------
  // SZERKESZTÉS – UPDATE
  // -----------------------------
  const startEdit = (review) => {
    setEditingId(review.id);
    setEditForm({
      rating: review.rating.toString(),
      comment: review.comment,
    });
  };

  const saveEdit = async (id) => {
    const updated = {
      rating: Number(editForm.rating),
      comment: editForm.comment.trim(),
    };

    // UPDATE
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );

    setEditingId(null);

    const { error } = await supabase
      .from("reviews")
      .update(updated)
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Nem sikerült frissíteni a véleményt.");
    }
  };

  // -----------------------------
  // TÖRLÉS 
  // -----------------------------
  const handleDelete = async (id) => {
    setDeleteError(null);

    // INSTANT TÖRLÉS
    const oldReviews = reviews;
    setReviews((prev) => prev.filter((r) => r.id !== id));

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      console.error(error);
      setDeleteError("Nem sikerült törölni az értékelést.");
      setReviews(oldReviews); // rollback
    }
  };

  // -----------------------------
  // LISTA BETÖLTÉSE
  // -----------------------------
  // Ha bejelentkezett felhasználó van, töltsük be a profil nevét alapértelmezettnek
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/profile/${user.id}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const name = json.data?.username || (user.email ? user.email.split('@')[0] : "");
        setForm((f) => ({ ...f, name }));
      } catch (err) {
        console.error('Failed to load profile for review name autofill', err);
      }
    })();

    // listen for external profile updates
    const handler = (e) => {
      const updated = e?.detail || null;
      if (!updated) return;
      const name = updated?.username || (user.email ? user.email.split('@')[0] : "");
      setForm((f) => ({ ...f, name }));
    };
    window.addEventListener('profileUpdated', handler);

    return () => {
      mounted = false;
      window.removeEventListener('profileUpdated', handler);
    };
  }, [user]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("film_api_id", filmId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoadError("Nem sikerült betölteni az értékeléseket.");
      } else {
        // fetch reviewer profiles to show avatars
        try {
          const userIds = Array.from(new Set((data || []).map((r) => r.user_id).filter(Boolean)));
          if (userIds.length > 0) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("id, avatar_url, username")
              .in("id", userIds);

            const profileMap = (profiles || []).reduce((acc, p) => {
              acc[p.id] = p;
              return acc;
            }, {});

            const merged = (data || []).map((r) => ({
              ...r,
              avatar: profileMap[r.user_id]?.avatar_url || null,
              reviewerName: profileMap[r.user_id]?.username || r.name,
            }));

            setReviews(merged);
          } else {
            setReviews(data || []);
          }
        } catch (err) {
          console.error("Failed to load reviewer profiles", err);
          setReviews(data || []);
        }
      }

      setLoading(false);
    };

    fetchReviews();
  }, [filmId]);

  // -----------------------------
  // REALTIME – mások változásaihoz
  // -----------------------------
  useEffect(() => {
    const channel = supabase
      .channel(`reviews-${filmId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        (payload) => {
          const newFilmId = payload.new?.film_api_id;
          const oldFilmId = payload.old?.film_api_id;

          if (newFilmId !== filmId && oldFilmId !== filmId) return;

          setReviews((current) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new, ...current];
              case "UPDATE":
                return current.map((r) =>
                  r.id === payload.new.id ? payload.new : r
                );
              case "DELETE":
                return current.filter((r) => r.id !== payload.old.id);
              default:
                return current;
            }
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [filmId]);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="card">
      <h2>Értékelések</h2>

      {!user ? (
        <p style={{ color: "#ccc", marginBottom: "1rem" }}>
          Értékelés írásához be kell jelentkezned.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Név</label>
            <input
              type="text"
              value={form.name}
              readOnly
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Értékelés</label>
            <select
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: e.target.value }))
              }
            >
              <option value="1">1 - Nagyon rossz</option>
              <option value="2">2 - Gyenge</option>
              <option value="3">3 - Közepes</option>
              <option value="4">4 - Jó</option>
              <option value="5">5 - Kiváló</option>
            </select>
          </div>

          <div className="form-group">
            <label>Vélemény</label>
            <textarea
              rows={4}
              value={form.comment}
              onChange={(e) =>
                setForm((f) => ({ ...f, comment: e.target.value }))
              }
            />
          </div>

          {submitError && <div className="error-text">{submitError}</div>}

          <div className="elkuld">
            <button type="submit" disabled={submitting}>
              {submitting ? "Mentés..." : "Értékelés elküldése"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Betöltés...</p>
      ) : reviews.length === 0 ? (
        <p>Még nincs értékelés.</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => {
            const isOwner = review.user_id === user?.id;

            return (
              <div key={review.id} className="review-item">
                {editingId === review.id ? (
                  <>
                    <strong>{review.name}</strong>

                    <select
                      value={editForm.rating}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, rating: e.target.value }))
                      }
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>

                    <textarea
                      rows={3}
                      value={editForm.comment}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          comment: e.target.value,
                        }))
                      }
                    />

                    <button onClick={() => saveEdit(review.id)}>Mentés</button>
                    <button onClick={() => setEditingId(null)}>Mégse</button>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img
                        src={review.avatar || "https://placehold.co/48x48"}
                        alt={review.reviewerName || review.name}
                        style={{ width: 48, height: 48, borderRadius: 24, cursor: "pointer", objectFit: "cover" }}
                        onClick={() => navigate(`/user/${review.user_id}`)}
                      />
                      <strong>{review.reviewerName || review.name}</strong>
                    </div>{" "}
                    <span style={{ color: "#f59e0b" }}>
                      {"★".repeat(review.rating)}
                    </span>
                    <p>{review.comment}</p>

                    {(isOwner || isAdmin) && (
                      <div className="review-actions">
                        {isOwner && (
                          <button onClick={() => startEdit(review)}>
                            Szerkesztés
                          </button>
                        )}
                        <div className="torles">
                          <button onClick={() => handleDelete(review.id)}>
                            Törlés
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {deleteError && <div className="error-text">{deleteError}</div>}
    </div>
  );
}

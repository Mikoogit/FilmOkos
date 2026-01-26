import { useState, useEffect } from "react";
import { supabase } from "../db/supaBaseClient";
import { useAuth } from "../auth/AuthContext.jsx";
import "../components/Reviews.css";


export default function MovieReview() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // -----------------------------
  // FORM STATE
  // -----------------------------
  const [form, setForm] = useState({
    name: "",
    rating: "5",
    comment: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // -----------------------------
  // LISTA STATE
  // -----------------------------
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
    if (!form.rating || Number.isNaN(ratingNumber)) {
      newErrors.rating = "Értékelés megadása kötelező.";
    } else if (ratingNumber < 1 || ratingNumber > 5) {
      newErrors.rating = "Az értékelésnek 1 és 5 között kell lennie.";
    }

    if (!form.comment.trim()) {
      newErrors.comment = "Szöveges vélemény megadása kötelező.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // FORM SUBMIT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);

    const ratingNumber = Number(form.rating);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        name: form.name.trim(),
        rating: ratingNumber,
        comment: form.comment.trim(),
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      console.error(error);
      setSubmitError("Hiba történt a mentés során. Próbáld újra.");
      return;
    }

    setForm({
      name: "",
      rating: "5",
      comment: "",
    });
  };

  // -----------------------------
  // LISTA BETÖLTÉS
  // -----------------------------
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoadError("Nem sikerült betölteni az értékeléseket.");
      } else {
        setReviews(data || []);
      }

      setLoading(false);
    };

    fetchReviews();
  }, []);

  // -----------------------------
  // REALTIME SUBSCRIPTION
  // -----------------------------
  useEffect(() => {
    const channel = supabase
      .channel("public:reviews")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        (payload) => {
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
  }, []);

  // -----------------------------
  // ADMIN TÖRLÉS
  // -----------------------------
  const handleDelete = async (id) => {
    setDeleteError(null);

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      console.error(error);
      setDeleteError("Nem sikerült törölni az értékelést.");
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="card">
      <h2>Értékelések</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Név</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Add meg a neved"
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="rating">Értékelés (1–5)</label>
          <select
            id="rating"
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
          >
            <option value="1">1 - Nagyon rossz</option>
            <option value="2">2 - Gyenge</option>
            <option value="3">3 - Közepes</option>
            <option value="4">4 - Jó</option>
            <option value="5">5 - Kiváló</option>
          </select>
          {errors.rating && <div className="error-text">{errors.rating}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="comment">Vélemény</label>
          <textarea
            id="comment"
            rows={4}
            value={form.comment}
            onChange={(e) =>
              setForm((f) => ({ ...f, comment: e.target.value }))
            }
            placeholder="Írd le a tapasztalataidat..."
          />
          {errors.comment && <div className="error-text">{errors.comment}</div>}
        </div>

        {submitError && <div className="error-text">{submitError}</div>}

        <button type="submit" className="primary-ertekel" disabled={submitting}>
          {submitting ? "Mentés..." : "Értékelés elküldése"}
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      {/* LISTA */}
      {loading ? (
        <p>Betöltés...</p>
      ) : loadError ? (
        <p className="error-text">{loadError}</p>
      ) : reviews.length === 0 ? (
        <p>Még nincs értékelés.</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-main">
                <strong>{review.name}</strong>{" "}
                <span style={{ color: "#f59e0b" }}>
                  {"★".repeat(review.rating)}
                </span>
                <div className="review-date">
                  {new Date(review.created_at).toLocaleString()}
                </div>
                <p>{review.comment}</p>
              </div>

              {isAdmin && (
                <button
                  className="danger small"
                  onClick={() => handleDelete(review.id)}
                >
                  Törlés
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteError && <div className="error-text">{deleteError}</div>}
    </div>
  );
}

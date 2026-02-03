import { useEffect, useState } from 'react';
import { supabase } from '../db/supaBaseClient';
import "../components/Reviews.css";
import ReviewCard from './ReviewCard';


export function ReviewList({ isAdmin }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadError(null);
      setLoading(true);

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      setLoading(false);

      if (error) {
        console.error(error);
        setLoadError('Nem sikerült betölteni az értékeléseket.');
        return;
      }

      setReviews(data || []);
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('public:reviews')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
        },
        (payload) => {
          setReviews((current) => {
            switch (payload.eventType) {
              case 'INSERT': {
                const newReview = payload.new;
                return [newReview, ...current];
              }
              case 'UPDATE': {
                const updated = payload.new;
                return current.map((r) => (r.id === updated.id ? updated : r));
              }
              case 'DELETE': {
                const deleted = payload.old;
                return current.filter((r) => r.id !== deleted.id);
              }
              default:
                return current;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id) => {
    setDeleteError(null);

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      setDeleteError('Nem sikerült törölni az értékelést (lehet, hogy nincs jogosultság).');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Értékelések</h2>
        <p>Betöltés...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="card">
        <h2>Értékelések</h2>
        <p className="error-text">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Értékelések</h2>
      {deleteError && <div className="error-text">{deleteError}</div>}
      {reviews.length === 0 ? (
        <p>Még nincs értékelés. Légy te az első!</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-main">
                <div className="review-header">
                  <span className="review-name">{review.name}</span>
                  <span className="review-rating">
                    {'★'.repeat(review.rating)}{' '}
                    <span style={{ color: '#9ca3af' }}>
                      ({review.rating}/5)
                    </span>
                  </span>
                </div>
                <div className="review-date">
                  {new Date(review.created_at).toLocaleString()}
                </div>
                <div className="review-comment">{review.comment}</div>
              </div>
              {isAdmin && (
                <div>
                  <button
                    className="danger small"
                    onClick={() => handleDelete(review.id)}
                  >
                    Törlés
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ReviewList;

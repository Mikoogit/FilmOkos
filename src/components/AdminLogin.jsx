import { useState } from 'react';
import { supabase } from '../db/supaBaseClient';

export function AdminLogin({ onLogin, onLogout, isLoggedIn }) {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setError('Sikertelen bejelentkezés. Ellenőrizd az adatokat.');
      return;
    }

    if (data.session) {
      onLogin();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (isLoggedIn) {
    return (
      <div className="admin-bar">
        <span className="admin-status">Bejelentkezve adminként</span>
        <button className="small" onClick={handleLogout}>
          Kijelentkezés
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h2>Admin bejelentkezés</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="admin-password">Jelszó</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Jelszó"
          />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button
          type="submit"
          className="primary"
          disabled={loading}
        >
          {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
        </button>
      </form>
    </div>
  );
}

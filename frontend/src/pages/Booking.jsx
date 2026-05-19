import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const movie = state?.movie || null;

  const [form, setForm] = useState(() => {
    const user = getStoredUser();
    return {
      movieId: movie?._id || '',
      showtime: movie?.showtime?.[0] || '',
      seats: 1,
      customerName: user.name || '',
      email: user.email || ''
    };
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
  }, [navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/bookings', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('🎉 Booking confirmed! Redirecting to your bookings...');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return (
    <div className="page">
      <h2>No movie selected</h2>
      <p>Please go to <a href="/movies">Movies</a> and click "Book Now".</p>
    </div>
  );

  return (
    <div className="form-page booking-page">
      <div className="page">
        <h1>Book Tickets</h1>

        <div className="booking-movie-info">
          <div className="booking-poster">{movie.title.charAt(0)}</div>
          <div>
            <h2>{movie.title}</h2>
            <div className="movie-meta">
              <span className="badge">{movie.genre}</span>
              <span className="badge">{movie.duration} min</span>
              <span className="badge">Rs. {movie.price} / seat</span>
            </div>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <label>Select Showtime</label>
          <select name="showtime" value={form.showtime} onChange={handleChange} required>
            {movie.showtime.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <label>Number of Seats</label>
          <input
            type="number"
            name="seats"
            min="1"
            max={movie.availableSeats}
            value={form.seats}
            onChange={handleChange}
            required
          />

          <label>Your Name</label>
          <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <div className="booking-total">
            Total: <strong>Rs. {movie.price * form.seats}</strong>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </div>
  );
}

export default Booking;

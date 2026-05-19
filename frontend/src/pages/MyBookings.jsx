import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    api.get('/api/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBookings(res.data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="page"><p>Loading bookings...</p></div>;

  return (
    <div className="page">
      <h1>My Bookings</h1>
      <p className="page-subtitle">All your reserved movie tickets in one place.</p>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>🎟️ No bookings yet.</p>
          <a href="/movies" className="hero-btn primary-btn" style={{ display: 'inline-block', marginTop: '12px' }}>Browse Movies</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b._id} className="booking-card">
              <div className="booking-card-left">
                <div className="booking-initial">{b.movieTitle.charAt(0)}</div>
              </div>
              <div className="booking-card-body">
                <h3>{b.movieTitle}</h3>
                <div className="booking-details">
                  <span>🕐 {b.showtime}</span>
                  <span>🪑 {b.seats} seat{b.seats > 1 ? 's' : ''}</span>
                  <span>💰 Rs. {b.totalPrice}</span>
                </div>
                <div className="booking-details">
                  <span>👤 {b.customerName}</span>
                  <span>📧 {b.email}</span>
                </div>
              </div>
              <div className="booking-card-right">
                <span className="booking-date">
                  {new Date(b.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="booking-status confirmed">Confirmed</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;

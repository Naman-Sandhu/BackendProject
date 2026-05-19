import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(freshUser => {
          if (freshUser._id) {
            const userData = {
              id: freshUser._id,
              name: freshUser.name,
              email: freshUser.email,
              profilePic: freshUser.profilePic
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
        })
        .catch(() => {});
    }

    const syncUser = () => setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    window.addEventListener('storage', syncUser);
    window.addEventListener('userUpdated', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('userUpdated', syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🎬 Movie Tickets</h2>
        <span>Book your show in seconds</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/booking">Booking</Link>
        <Link to="/my-bookings">My Bookings</Link>

        {user ? (
          <div className="nav-profile">
            <Link to="/profile" className="nav-avatar-link">
              {user.profilePic
                ? <img
                    src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:3000${user.profilePic}`}
                    alt={user.name}
                    className="nav-avatar"
                    referrerPolicy="no-referrer"
                  />
                : <div className="nav-avatar nav-avatar-initials">{user.name?.charAt(0).toUpperCase()}</div>
              }
              <span className="nav-username">{user.name}</span>
            </Link>
            <button className="nav-btn nav-logout" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/signup" className="nav-btn secondary">Signup</Link>
            <Link to="/login" className="nav-btn primary">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
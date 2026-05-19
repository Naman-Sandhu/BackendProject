import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
                ? <img src={`http://localhost:3000${user.profilePic}`} alt={user.name} className="nav-avatar" />
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
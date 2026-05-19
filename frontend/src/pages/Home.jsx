import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">Online Movie Reservation</p>
          <h1>Experience Movies the Smart Way</h1>
          <p className="hero-text">
            Browse available movies, reserve your seats, manage your bookings,
            and enjoy a smooth cinema booking experience with secure login.
          </p>

          <div className="hero-buttons">
            <Link to="/movies" className="hero-btn primary-btn">Explore Movies</Link>
            <Link to="/signup" className="hero-btn secondary-btn">Create Account</Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>Why choose us?</h3>
          <ul>
            <li>✔ Easy signup and login</li>
            <li>✔ Fast movie browsing</li>
            <li>✔ Secure seat booking</li>
            <li>✔ Personal booking history</li>
          </ul>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <h3>🎥 Latest Movies</h3>
          <p>Check all running movies with timings, price, and available seats.</p>
        </div>

        <div className="feature-card">
          <h3>🪑 Easy Booking</h3>
          <p>Book tickets in a few clicks with a smooth and simple experience.</p>
        </div>

        <div className="feature-card">
          <h3>🔐 Secure Access</h3>
          <p>JWT based authentication keeps user booking features protected.</p>
        </div>

        <div className="feature-card">
          <h3>📂 My Bookings</h3>
          <p>Users can view their own bookings anytime after login.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
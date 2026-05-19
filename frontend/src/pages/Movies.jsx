import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/movies')
      .then(res => setMovies(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (movie) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    navigate('/booking', { state: { movie } });
  };

  if (loading) return <div className="page"><p>Loading movies...</p></div>;

  return (
    <div className="page">
      <h1>Now Showing</h1>
      <p className="page-subtitle">Pick a movie and book your seats instantly.</p>

      {movies.length === 0 ? (
        <p>No movies available right now.</p>
      ) : (
        <div className="movies-grid">
          {movies.map(movie => (
            <div key={movie._id} className="movie-card">
              <div className="movie-poster">{movie.title.charAt(0)}</div>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-meta">
                  <span className="badge">{movie.genre}</span>
                  <span className="badge">{movie.duration} min</span>
                </div>
                <p className="movie-showtimes">
                  🕐 {movie.showtime.join('  •  ')}
                </p>
                <div className="movie-footer">
                  <span className="movie-price">Rs. {movie.price}</span>
                  <span className={`seats-badge ${movie.availableSeats < 10 ? 'low' : ''}`}>
                    {movie.availableSeats} seats left
                  </span>
                </div>
                <button
                  className="book-btn"
                  onClick={() => handleBook(movie)}
                  disabled={movie.availableSeats === 0}
                >
                  {movie.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;

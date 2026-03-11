const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'Movie Ticket Reservation API',
    endpoints: {
      movies: '/api/movies',
      bookings: '/api/bookings'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

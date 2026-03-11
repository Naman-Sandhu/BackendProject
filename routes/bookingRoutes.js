const express = require('express');
const router = express.Router();
const { readFile, writeFile, appendFile } = require('../modules/fileHandler');
const { validateBooking } = require('../middleware/validator');

router.get('/', (req, res, next) => {
  try {
    const bookings = readFile('data/bookings.json');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateBooking, (req, res, next) => {
  try {
    const { movieId, showtime, seats, customerName, email } = req.body;
    const movies = readFile('data/movies.json');
    const movie = movies.find(m => m.id === parseInt(movieId));
    
    if (!movie) {
      const error = new Error('Movie not found');
      error.status = 404;
      return next(error);
    }
    
    if (movie.availableSeats < seats) {
      const error = new Error('Not enough seats available');
      error.status = 400;
      return next(error);
    }
    
    const booking = {
      id: Date.now(),
      movieId: parseInt(movieId),
      movieTitle: movie.title,
      showtime,
      seats,
      customerName,
      email,
      totalPrice: movie.price * seats,
      bookingDate: new Date().toISOString()
    };
    
    appendFile('data/bookings.json', booking);
    
    movie.availableSeats -= seats;
    writeFile('data/movies.json', movies);
    
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const bookings = readFile('data/bookings.json');
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    
    if (!booking) {
      const error = new Error('Booking not found');
      error.status = 404;
      return next(error);
    }
    
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

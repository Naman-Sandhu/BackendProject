const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { validateBooking } = require('../middleware/validator');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, validateBooking, async (req, res, next) => {
  try {
    const { movieId, showtime, seats, customerName, email } = req.body;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      const error = new Error('Movie not found');
      error.status = 404;
      return next(error);
    }

    if (movie.availableSeats < Number(seats)) {
      const error = new Error('Not enough seats available');
      error.status = 400;
      return next(error);
    }

    const booking = new Booking({
      userId: req.user.userId,
      movieId: movie._id,
      movieTitle: movie.title,
      showtime,
      seats: Number(seats),
      customerName,
      email,
      totalPrice: movie.price * Number(seats)
    });

    await booking.save();

    movie.availableSeats = movie.availableSeats - Number(seats);
    await movie.save();

    res.status(201).json({
      message: 'Booking successful',
      booking
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

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
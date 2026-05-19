const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      const error = new Error('Movie not found');
      error.status = 404;
      return next(error);
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
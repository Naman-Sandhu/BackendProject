const express = require('express');
const router = express.Router();
const { readFile } = require('../modules/fileHandler');

router.get('/', (req, res, next) => {
  try {
    const movies = readFile('data/movies.json');
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const movies = readFile('data/movies.json');
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    
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

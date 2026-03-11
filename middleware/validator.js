const validateBooking = (req, res, next) => {
  const { movieId, showtime, seats, customerName, email } = req.body;
  
  if (!movieId || !showtime || !seats || !customerName || !email) {
    const error = new Error('Missing required fields');
    error.status = 400;
    return next(error);
  }
  
  if (seats <= 0) {
    const error = new Error('Seats must be greater than 0');
    error.status = 400;
    return next(error);
  }
  
  next();
};

module.exports = { validateBooking };

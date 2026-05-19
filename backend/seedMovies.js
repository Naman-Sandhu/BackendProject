const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const movies = [
  {
    title: 'The Matrix',
    genre: 'Sci-Fi',
    duration: 136,
    showtime: ['10:00 AM', '2:00 PM', '6:00 PM'],
    price: 12,
    availableSeats: 44
  },
  {
    title: 'Inception',
    genre: 'Thriller',
    duration: 148,
    showtime: ['11:00 AM', '3:00 PM', '7:00 PM'],
    price: 15,
    availableSeats: 45
  },
  {
    title: 'The Dark Knight',
    genre: 'Action',
    duration: 152,
    showtime: ['12:00 PM', '4:00 PM', '8:00 PM'],
    price: 14,
    availableSeats: 60
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Movie.deleteMany();
    await Movie.insertMany(movies);
    console.log('Movies seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to enable CORS
app.use(cors()); // This allows requests from all origins by default

// Middleware to parse incoming requests
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantsRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Routes Middleware
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

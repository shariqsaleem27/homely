const mongoose = require('mongoose');
const { Schema } = mongoose;
 
const restaurantSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  restaurantName: { type: String, required: true },
  location: { type: String, required: true },
  password: { type: String, required: true }, // Added password field
  items: [{
    dishName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
  }],
}, {
  timestamps: true,
});
 
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
 
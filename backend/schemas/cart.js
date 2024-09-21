const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    dishName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }, // User can select the quantity
    totalPrice: { type: Number, required: true }, // price * quantity
  });
  
  const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, required: true }, // Total price for all items in the cart
  }, {
    timestamps: true,
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  module.exports = Cart;
  
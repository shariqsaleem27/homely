const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const Restaurant = require('../schemas/restaurant');
const Cart = require('../schemas/cart');
const Order = require('../schemas/order');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ firstName, lastName, phoneNumber, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all items from all restaurants
router.get('/items', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}, 'restaurantName items');
    const allItems = restaurants.map(restaurant => ({
      restaurantName: restaurant.restaurantName,
      items: restaurant.items
    }));
    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/cart', async (req, res) => {
  const { userId, restaurantId, dishName, price, quantity } = req.body;

  try {
    // Calculate total price
    const totalPrice = price * quantity;

    // Find user cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    // Add item to cart
    cart.items.push({ restaurantId, dishName, price, quantity, totalPrice });
    cart.totalAmount += totalPrice;

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cart items for a user
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.restaurantId', 'restaurantName');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Place an order
router.post('/order', async (req, res) => {
  const { userId, items, deliveryAddress } = req.body;

  try {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'Pending',
      paymentStatus: 'Unpaid'
    });

    await newOrder.save();

    // Empty the user's cart after placing the order
    await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).populate('items.restaurantId', 'restaurantName');
    if (!orders) return res.status(404).json({ message: 'No orders found' });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

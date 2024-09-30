const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const Restaurant = require("../schemas/restaurant");
const Cart = require("../schemas/cart");
const Order = require("../schemas/order");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, "yourSecretKey", {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token, data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/items", async (req, res) => {
  try {
    // Find restaurants with non-empty items
    const restaurants = await Restaurant.find(
      { "items.0": { $exists: true } },
      "restaurantName items _id" // Include _id for the restaurant
    );

    // Map the results to the desired format, including restaurantId in each item
    const allItems = restaurants.map((restaurant) => ({
      restaurantName: restaurant.restaurantName,
      items: restaurant.items.map((item) => ({
        dishName: item.dishName,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        _id: item._id,
        restaurantId: restaurant._id, // Add restaurantId to each item
      })),
    }));

    console.log("all items", JSON.stringify(allItems));

    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Add item to cart or update quantity if it already exists
router.post("/cart", async (req, res) => {
  const { userId, restaurantId, dishName, price, quantity } = req.body;

  try {
    // Calculate total price
    const totalPrice = price * quantity;

    // Find user cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>{
        console.log(item)
        item.dishName === dishName &&
        item.restaurantId.toString() === restaurantId
  });

    if (existingItemIndex > -1) {
      // Item exists, update the quantity and total price
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice += totalPrice;
    } else {
      // Add new item to the cart
      cart.items.push({ restaurantId, dishName, price, quantity, totalPrice });
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete item from cart
router.delete("/cart/:userId/:dishName", async (req, res) => {
  const { userId, dishName } = req.params;

  try {
    // Find user cart
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find the index of the item to be deleted
    const itemIndex = cart.items.findIndex(
      (item) => item.dishName === dishName
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    // Remove the item from the cart
    const removedItem = cart.items[itemIndex];
    cart.items.splice(itemIndex, 1);

    // Recalculate total amount
    cart.totalAmount -= removedItem.totalPrice;

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update item quantity in cart
router.patch("/cart/:userId/:dishName", async (req, res) => {
  const { userId, dishName } = req.params;
  const { quantity } = req.body; // New quantity to set

  try {
    // Find user cart
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find the index of the item to be updated
    const itemIndex = cart.items.findIndex(
      (item) => item.dishName === dishName
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    // Update the quantity and recalculate total price
    const item = cart.items[itemIndex];
    const previousQuantity = item.quantity;

    item.quantity = quantity; // Update to new quantity
    item.totalPrice = item.price * quantity; // Recalculate total price based on new quantity

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Quantity updated successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get cart items for a user
router.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    console.log("cart", cart);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Place an order
router.post("/order", async (req, res) => {
  const { userId, items, deliveryAddress } = req.body;

  console.log("items", items);

  try {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      status: "Pending",
      paymentStatus: "Unpaid",
    });

    await newOrder.save();

    // Empty the user's cart after placing the order
    await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's orders
router.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).populate(
      "items.restaurantId",
      "restaurantName"
    );
    if (!orders) return res.status(404).json({ message: "No orders found" });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

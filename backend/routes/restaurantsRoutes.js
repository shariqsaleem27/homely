const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../schemas/restaurant");
const { ObjectId } = require('mongodb');


const router = express.Router();

// Register Route for Restaurant
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    restaurantName,
    location,
    password,
  } = req.body;

  try {
    console.log(req.body)

    const existingRestaurant = await Restaurant.findOne({ phoneNumber });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new restaurant
    const newRestaurant = new Restaurant({
      firstName,
      lastName,
      phoneNumber,
      restaurantName,
      location,
      password: hashedPassword,
    });

    // Save the restaurant to the database
    const result = await newRestaurant.save();
    res
      .status(201)
      .json({ message: "Restaurant registered successfully", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route for Restaurant
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Check if the restaurant exists
    const restaurant = await Restaurant.findOne({ phoneNumber });
    if (!restaurant) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create an item for a restaurant
router.post("/:restaurantId/items", async (req, res) => {
  const { restaurantId } = req.params;
  const { dishName, price, description, imageUrl } = req.body;

  try {
    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Add new item to the restaurant's items array
    restaurant.items.push({ dishName, price, description, imageUrl });
    await restaurant.save();

    res
      .status(201)
      .json({
        message: "Item added successfully",
        item: restaurant.items[restaurant.items.length - 1],
      });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all items for a restaurant
router.get("/:restaurantId/items", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ items: restaurant.items });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific item by itemId for a restaurant
router.get("/:restaurantId/items/:itemId", async (req, res) => {
  const { restaurantId, itemId } = req.params;

  try {
    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find the item
    const item = restaurant.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update an item for a restaurant
router.put("/:restaurantId/items/:itemId", async (req, res) => {
  const { restaurantId, itemId } = req.params;
  const { dishName, price, description, imageUrl } = req.body;

  try {
    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find the item
    const item = restaurant.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update the item
    item.dishName = dishName || item.dishName;
    item.price = price || item.price;
    item.description = description || item.description;
    item.imageUrl = imageUrl || item.imageUrl;
    await restaurant.save();

    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an item for a restaurant
router.delete("/:restaurantId/items/:itemId", async (req, res) => {
  const { restaurantId, itemId } = req.params;

  try {
    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find and remove the item from the items array
    const itemIndex = restaurant.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    restaurant.items.splice(itemIndex, 1);
    await restaurant.save();

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;

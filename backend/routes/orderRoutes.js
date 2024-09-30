const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../schemas/order");

// Get all orders for a specific restaurant and filter by restaurantId
router.get("/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Fetch all orders
    const orders = await Order.find();

    // Initialize arrays for categorized orders
    const pendingOrders = [];
    const acceptedOrders = [];
    const completedOrders = [];

    // Categorize orders based on item statuses
    orders.forEach(order => {
      const filteredItems = order.items.filter(item => 
        item.restaurantId.toString() === restaurantId
      );

      if (filteredItems.length > 0) {
        const orderWithFilteredItems = {
          ...order._doc,
          items: filteredItems,
        };

        // Check the status of each item and categorize the order
        if (filteredItems.some(item => item.status === "Pending")) {
          pendingOrders.push(orderWithFilteredItems);
        } else if (filteredItems.some(item => item.status === "Accepted")) {
          acceptedOrders.push(orderWithFilteredItems);
        } else if (filteredItems.some(item => item.status === "Completed")) {
          completedOrders.push(orderWithFilteredItems);
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        pendingOrders,
        acceptedOrders,
        completedOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
});

// Add this route to your router file

router.put("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Find the order by ID and update the status of its items
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Update the status of the items in the order
    order.items.forEach(item => {
      item.status = status; // Update status for all items in the order
    });

    // Save the updated order
    await order.save();

    return res.status(200).json({ success: true, message: "Order status updated." });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: "Failed to update order status." });
  }
});



module.exports = router;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderStatusEnum = ["Pending", "Accepted", "Completed"];

const orderItemSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  dishName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: orderStatusEnum, default: "Pending" }, // Individual item status
});

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    paymentStatus: { type: String, default: "Unpaid" },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

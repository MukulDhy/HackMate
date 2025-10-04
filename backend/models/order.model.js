import mongoose from "mongoose";

// Define the Order schema
const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    payment_id: {
      type: String,
    },
    signature: {
      type: String,
    },
  },
  { timestamps: true }
);

// Optional: Auto-generate a unique order ID if not provided
orderSchema.pre("save", function (next) {
  if (!this.order_id) {
    this.order_id = `ORDER_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;

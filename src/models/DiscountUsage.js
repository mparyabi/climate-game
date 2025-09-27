// models/DiscountUsage.js
import mongoose from "mongoose";

const discountUsageSchema = new mongoose.Schema({
  discountCode: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "DiscountCode", 
    required: true 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  usedAt: { type: Date, default: Date.now },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
}, { timestamps: true });

export default mongoose.models.DiscountUsage ||
  mongoose.model("DiscountUsage", discountUsageSchema);

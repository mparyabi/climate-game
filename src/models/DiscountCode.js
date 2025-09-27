// models/DiscountCode.js
import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: ["coupon", "referral"], // کوپن عادی یا کد دعوت
      default: "coupon",
    },
    value: { type: Number, default: 0 }, // مثلا 10 => 10 درصد
    maxUsage: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // مالک کد دعوت یا سازنده کوپن
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.DiscountCode ||
  mongoose.model("DiscountCode", discountCodeSchema);

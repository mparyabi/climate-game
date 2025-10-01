import mongoose from "mongoose";

const PaymentReport = new mongoose.Schema(
  {
    Authority: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "cancelled"],
      default: "pending",
    },
    card_hash: {
      type: String,
    },
    card_pan: {
         type: String 
        },
    discount : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiscountCode",
    }
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentReport);

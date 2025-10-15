import mongoose from "mongoose";

const DecisionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // شناسه کاربر
    playIndex: { type: Number, required: true}, // شماره بازی (مثلاً 1 تا 3)
    data: { type: Object, required: true }, // کل ساختار data از localStorage
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // خودکار createdAt و updatedAt
  }
);

export default mongoose.models.Decision ||
  mongoose.model("Decision", DecisionSchema);

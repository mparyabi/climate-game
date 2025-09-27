import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^09\d{9}$/, // فرمت شماره ایران
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: {
      type: String, // URL تصویر پروفایل کاربر (اختیاری)
    },
    lastLogin: {
      type: Date,
    },

    // --- فیلدهای مربوط به OTP ---
    otpCode: {
      type: String, // کد OTP فعلی
    },
    otpHash: {
    type: String,
    default: "undefined"
    },
    otpExpiresAt: {
      type: Date, // زمان انقضای کد
    },
    otpVerified: {
      type: Boolean,
      default: false, // بعد از اولین تایید شماره، true میشه
    },
    loginAttempts: {
      type: Number,
      default: 0, // میتونی برای محدود کردن اسپم استفاده کنی
    },
    payStatus:{
      type:Boolean,
      default:false
    }, 
    organ: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Organ", 
        required: true 
      }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

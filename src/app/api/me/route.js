import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import DiscountCode from "@/models/DiscountCode";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    // اتصال به دیتابیس
    await connectDB();

    // گرفتن کوکی
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // بررسی توکن
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // گرفتن اطلاعات کاربر از دیتابیس
    const user = await User.findById(decoded.userId).populate("organ").select("-otpHash");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const refferalcode = await DiscountCode.findOne({createdBy : user._id} , "code");

    return NextResponse.json({ user , refferalcode }, { status: 200 });
  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

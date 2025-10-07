import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import DiscountCode from "@/models/DiscountCode";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = 60 * 60 * 3; // 3 ساعت

async function generateRandomCode(length = 5) {
  const chars = 'ABDCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

export async function POST(req) {
  try {
    await connectDB();
    const { mobile, otp } = await req.json();
    if (!mobile || !otp) return new Response(JSON.stringify({ message: "موبایل و OTP الزامی است" }), { status: 400 });

    const user = await User.findOne({ mobile });
    if (user.otpVerified) return new Response(JSON.stringify({ message: "کاربر قبلا ثبت نام شده" }), { status: 404 });

    if (!user.otpHash || !user.otpExpiresAt || Date.now() > user.otpExpiresAt.getTime()) {
      return new Response(JSON.stringify({ message: "کد یکبار مصرف منقضی یا نامعتبر است" }), { status: 401 });
    }

    const isValid = await bcrypt.compare(otp, user.otpHash);
    if (!isValid) return new Response(JSON.stringify({ message: "کد یکبار مصرف منقضی یا نامعتبر است" }), { status: 401 });

    // ✅ OTP درست بود → حذف OTP و فعال کردن کاربر
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpVerified= true;
    user.isActive= true;
    await user.save();
    
  
    //ساخت کد دعوت
    const code = await generateRandomCode();
    await DiscountCode.create({
    code,
    type:"referral",
    createdBy: user._id
    })

    // ✅ تولید JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    // ✅ ست کردن کوکی امن
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_EXPIRES_IN
    });

    return new Response(JSON.stringify({ message: "ورود موفق", mobile }), {
      status: 200,
      headers: { "Set-Cookie": cookie },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "خطا در تایید OTP" }), { status: 500 });
  }
}

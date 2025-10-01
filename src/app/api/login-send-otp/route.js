import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { sendOtp } from "@/lib/sendOtp";
import Organ from "@/models/Organ";

async function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(otp, 10); 
  return { otp, hash };
}

export async function POST(req) {
  try {
    await connectDB();

    let { mobile , organ } = await req.json();
    organ = organ.trim();
    if (!mobile || !organ)
      return new Response(JSON.stringify({ message: "موبایل الزامی است" }), { status: 400 });

    const user = await User.findOne({ mobile });

    if (!user)
      return new Response(JSON.stringify({ message: "کاربری یافت نشد" }), { status: 401 });
    
    if (!user.otpVerified)
      return new Response(JSON.stringify({ message: "کاربری یافت نشد" }), { status: 401 });
    
    if (user.otpExpiresAt && user.otpExpiresAt > new Date()) {
      return new Response(
        JSON.stringify({ message: "کد قبلاً ارسال شده است، لطفاً چند لحظه بعد دوباره تلاش کنید" }),
        { status: 429 } // 429 Too Many Requests
      );
    }

    let userOrgan = await Organ.findOne({link:organ});
    if (!userOrgan) return new Response(JSON.stringify({ message: "ارگان معتبر نیست!" }), { status: 402 });

    const { otp, hash } = await generateOtp();
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 دقیقه

    user.otpHash = hash;
    user.otpExpiresAt = expires;
    await user.save();
    
    console.log("otp Code: " , otp);
    const result = await sendOtp(user.mobile, otp);
    if (!result.success) {
      return new Response(JSON.stringify({ message: "ارسال پیامک ناموفق بود" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "کد تایید ارسال شد", mobile }), { status: 201 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || "خطا در ارسال OTP" }), { status: 500 });
  }
}

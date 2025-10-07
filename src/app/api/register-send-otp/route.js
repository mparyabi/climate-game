import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Organ from "@/models/Organ";
import bcrypt from "bcrypt";
import { sendOtp } from "@/lib/sendOtp";

async function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(otp, 10);
  return { otp, hash };
}

export async function POST(req) {
  try {
    await connectDB();

    let { firstName, lastName, mobile, organ } = await req.json();
    organ = organ.trim();
    if (!mobile || !firstName || !lastName || !organ)
      return new Response(JSON.stringify({ message: "اطلاعات کامل نیست" }), {
        status: 400,
      });

    let user = await User.findOne({ mobile });
    let userOrgan = await Organ.findOne({ link: organ });

    if (!userOrgan)
      return new Response(JSON.stringify({ message: "ارگان معتبر نیست!" }), {
        status: 401,
      });

    if (user) {
      if (user.otpVerified) {
        return new Response(
          JSON.stringify({ message: "کاربر با این شماره قبلاً ثبت‌نام کرده" }),
          { status: 409 }
        );
      }
      // بررسی اعتبار OTP قبلی
      if (user.otpExpiresAt && Date.now() < user.otpExpiresAt.getTime()) {
        return new Response(
          JSON.stringify({ message: "هنوز کد یکبارمصرف قبلی اعتبار دارد" }),
          { status: 422 }
        );
      }

      const { otp, hash } = await generateOtp();
      const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 دقیقه اعتبار
      user.otpHash = hash;
      user.otpExpiresAt = expires;
      user.firstName = firstName;
      user.lastName = lastName;
      user.organ = userOrgan._id;
      await user.save();

      console.log("otp Code: ", otp);
      const result = await sendOtp(user.mobile, otp);

      if (!result.success) {
        return new Response(
          JSON.stringify({ message: "ارسال پیامک ناموفق بود" }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ message: "کد تایید ارسال شد", mobile }),
        { status: 201 }
      );
    }

    const { otp, hash } = await generateOtp();
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 دقیقه

    user = await User.create({
      firstName,
      lastName,
      mobile,
      otpHash: hash,
      otpExpiresAt: expires,
      otpVerified: false,
      organ: userOrgan._id,
    });

 
    const result = await sendOtp(user.mobile, otp);
    if (!result.success) {
      return new Response(
        JSON.stringify({ message: "ارسال پیامک ناموفق بود" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "کد تایید ارسال شد", mobile }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: err.message || "خطا در ارسال OTP" }),
      { status: 500 }
    );
  }
}

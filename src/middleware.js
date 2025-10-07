import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./lib/mongodb";
import User from "./models/User";

export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.redirect(new URL("/", req.nextUrl.origin));

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded " , decoded);
  } catch (err) {
    console.log("Token invalid or expired:", err.message);
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }


    // اگر مسیر Game است، بررسی پرداخت
    if (req.nextUrl.pathname.startsWith("/game")) {
      await connectDB(); // اتصال به دیتابیس
      const hasPaid = await User.exists({
        _id: decoded.userId,
        payStatus: true,
        isCompeletedProfile : true
      });
  
      if (!hasPaid) {
        return NextResponse.redirect(new URL("/user-dashboard/home", req.nextUrl.origin));
      }
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/user-dashboard/:path*", "/game/:path*"]
};

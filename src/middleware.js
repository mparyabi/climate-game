import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs"; 

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.redirect(new URL("/", req.url));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token valid:", decoded);
    return NextResponse.next();
  } catch (err) {
    console.log("Token invalid or expired:", err.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/user-dashboard/:path*"],
};

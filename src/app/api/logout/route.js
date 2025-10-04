import { NextResponse } from "next/server";

export async function POST() {
  try {
    // پاک کردن کوکی با همان نام "token"
    const response = NextResponse.json({ message: "Logout موفق" });
    response.cookies.set({
      name: "token",
      value: "",
      path: "/",          // مسیر کوکی
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,          // منقضی شدن فوری
      sameSite: "strict",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "خطا در خروج" }, { status: 500 });
  }
}

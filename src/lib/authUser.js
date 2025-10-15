import { cookies, headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import DiscountCode from "@/models/DiscountCode";
import jwt from "jsonwebtoken";
import Organ from "@/models/Organ";

const JWT_SECRET = process.env.JWT_SECRET;

export async function getUserFromRequest() {
  await connectDB();

  const cookieStore = await cookies();
  const headerList = await headers();

  const token =
    cookieStore.get("token")?.value ||
    headerList.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }

  const user = await User.findById(decoded.userId)
    .populate("organ")
    .select("-otpHash");

  if (!user) return null;

  const referralCode = await DiscountCode.findOne(
    { createdBy: user._id },
    "code"
  );

  return { user, referralCode };
}

import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/authUser";

export async function GET(req) {
  try {
    const result = await getUserFromRequest(req);

    if (!result) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

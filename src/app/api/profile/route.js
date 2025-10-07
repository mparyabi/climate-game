import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const {
      id,
      gender,
      studyField,
      educationLevel,
      educationLocation,
      job,
      jobLocationName,
    } = await req.json();

    if (
      !id ||
      !gender ||
      !studyField ||
      !educationLevel ||
      !educationLocation ||
      !job ||
      !jobLocationName
    ) {
      return NextResponse.json(
        { message: "اطلاعات ارسالی کامل نیست" },
        { status: 401 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    user.gender = gender;
    user.studyField = studyField;
    user.educationLevel = educationLevel;
    user.educationLocation = educationLocation;
    user.job = job;
    user.jobLocationName = jobLocationName;
    user.isCompeletedProfile = true;

    await user.save();
    

    return NextResponse.json(
      { message: "پروفایل کاربر با موفقیت تکمیل شد" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "خطا در خروج" }, { status: 500 });
  }
}

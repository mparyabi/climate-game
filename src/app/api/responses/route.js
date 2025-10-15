import { getUserFromRequest } from "@/lib/authUser";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Decision from "@/models/Decision"

function tryParsePossibleString(v) {
  if (typeof v !== "string") return v;
  // حالت متداول: رشتهٔ JSON (مث: "[{\"id\":0,...}]")
  try {
    return JSON.parse(v);
  } catch (e) {
    // اگر double-escaped باشه (نادر) سعی می‌کنیم unescape کنیم
    try {
      const unescaped = v.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      return JSON.parse(unescaped);
    } catch (e2) {
      // اگر باز هم نشد، مقدار اصلی رشته رو برگردون
      return v;
    }
  }
}

export async function POST(req) {
  try {
    await connectDB();
    // بخوانیم body (هم با req.json و هم با req.text سازگار)
    const contentType = (req.headers.get?.("content-type") || "").toLowerCase();
    let body;
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const txt = await req.text();
      body = txt ? JSON.parse(txt) : {};
    }

    // تبدیل ایمن برای هر فیلد (decisions, images, trophies, _persist و ...)
    const parsed = {};
    for (const [k, v] of Object.entries(body)) {
      parsed[k] = tryParsePossibleString(v);
    }
    const user = await getUserFromRequest();
    if (!user) { return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 401 }); }

      // بررسی اینکه مرحله intro است (شروع بازی جدید)
    const isIntro = parsed.decisions.length === 1 && parsed.decisions[0]?.type === "intro";

    const previousGames = await Decision.find({ userId : user.user._id }).sort({ playIndex: -1 });

     if (isIntro && previousGames.length >= 3) {
      return NextResponse.json(
        { message: "حداکثر ۳ بار بازی مجاز است" },
        { status: 403 }
      );
    }

     // اگر intro است → رکورد جدید بساز
    if (isIntro) {
      const newPlayIndex = (previousGames[0]?.playIndex || 0) + 1;

      const newDecision = new Decision({
        userId : user.user._id,
        playIndex: newPlayIndex,
        data:parsed.decisions,
      });
      await newDecision.save();

      return NextResponse.json(
        { message: "new game created", playIndex: newPlayIndex },
        { status: 200 }
      );
    }
        // اگر intro نیست → فقط رکورد آخر را آپدیت کن
    if (previousGames.length === 0) {
      return NextResponse.json(
        { message: "هیچ بازی فعالی برای آپدیت وجود ندارد" },
        { status: 400 }
      );
    }
    const currentGame = previousGames[0];
    
  if (parsed.decisions.length >= currentGame.data.length){
    currentGame.data = parsed.decisions;
    await currentGame.save();
        return NextResponse.json(
      { message: "game updated", playIndex: currentGame.playIndex },
      { status: 200 }
        
    )};
  } catch (error) {
    console.error("Save-decisions error:", error);
    return NextResponse.json({ message: "خطا در پردازش داده" }, { status: 500 });
  }
}

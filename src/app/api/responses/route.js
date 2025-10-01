import { NextResponse } from "next/server";

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


    console.log("parsed.decisions:", parsed.decisions);
    // TODO: ذخیره در DB یا هر کاری که لازم دارید
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Save-decisions error:", error);
    return NextResponse.json({ message: "خطا در پردازش داده" }, { status: 500 });
  }
}

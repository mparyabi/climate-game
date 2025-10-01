import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
    const filePath = path.join(process.cwd(), "src", "app", "game", "index.html");
  const file = fs.readFileSync(filePath, "utf8");

  return new NextResponse(file, {
    headers: { "Content-Type": "text/html" },
  });
}

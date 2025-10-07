import { connectDB } from "@/lib/mongodb";
import Organ from "@/models/Organ";

export async function GET(request , { params }) {
  try {
    await connectDB();
    const { name } = await params;
    const organ = await Organ.findOne({ link:name }).select("name img");

    if (!organ){
      return new Response(
        JSON.stringify({ message: "ارگان یافت نشد" }),
        { status: 404 }
      );
    }
   
    return new Response(
      JSON.stringify({ message: "ارگان ها یافت شد", organ }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || "خطا " }), {
      status: 500,
    });
  }
}

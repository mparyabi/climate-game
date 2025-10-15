import { connectDB } from "@/lib/mongodb";
import Decision from "@/models/Decision";


export async function GET(request , { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const games = await Decision.find({ userId : id }).sort({ playIndex: -1 });

    if (!games){
      return new Response(
        JSON.stringify({ message: "بازی یافت نشد" }),
        { status: 404 }
      );
    }
   
    return new Response(
      JSON.stringify({ message: "بازی ها یافت شد", games }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || "خطا " }), {
      status: 500,
    });
  }
}

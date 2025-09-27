import { connectDB } from "@/lib/mongodb";
import Organ from "@/models/Organ";


export async function POST(req) {
  try {
    await connectDB();

   // در اینجا باید ادمین بعدا authorize شود

    const { name, gamePrice, discountValue ,link , startDate,endDate} = await req.json();

    if (!name || !gamePrice || !discountValue || !link || !endDate) 
      return new Response(JSON.stringify({ message: "اطلاعات کامل نیست" }), { status: 400 });
     
    const organ = await Organ.create(
    {
        name,gamePrice,discountValue,link,startDate,endDate
    }
    )
    
    return new Response(JSON.stringify({ message: "ارگان جدید ایجاد شد!", organ }), { status: 201 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || "خطا " }), { status: 500 });
  }
}

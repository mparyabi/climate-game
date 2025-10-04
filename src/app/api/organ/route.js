import { getUserFromRequest } from "@/lib/authUser";
import { connectDB } from "@/lib/mongodb";
import Organ from "@/models/Organ";


export async function POST(req) {
  try {
    await connectDB();
   const user =await getUserFromRequest();

   if (user.user.role != "admin"){
   return new Response(JSON.stringify({ message: "دسترسی فقط ادمین" }), { status: 402 });
   }

    const { name, gamePrice, discountValue ,link , startDate,endDate , img} = await req.json();

    if (!name || !gamePrice || !discountValue || !link || !endDate || !img) 
      return new Response(JSON.stringify({ message: "اطلاعات کامل نیست" }), { status: 400 });
     
    const organ = await Organ.create(
    {
        name,gamePrice,discountValue,link,startDate,endDate,img
    }
    )
    
    return new Response(JSON.stringify({ message: "ارگان جدید ایجاد شد!", organ }), { status: 201 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || "خطا " }), { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
   const publishedOrgans =await Organ.find();
    
    return new Response(JSON.stringify({ message: "ارگان ها یافت شد", publishedOrgans }), { status: 201 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || "خطا " }), { status: 500 });
  }
}

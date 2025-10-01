import { connectDB } from "@/lib/mongodb";
import DiscountCode from "@/models/DiscountCode";
import { getUserFromRequest } from "@/lib/authUser";
import Organ from "@/models/Organ";

export async function POST(req) {
  try {
    await connectDB();
    let { code } = await req.json();

    if (!code)
      return new Response(JSON.stringify({ message: "ارسال کد الزامی است" }), {
        status: 400,
      });
    code = code.trim().toUpperCase();

    let Discount = await DiscountCode.findOne({ code });

    if (!Discount)
      return new Response(JSON.stringify({ message: "کد نا معتبر است" }), {
        status: 404,
      });

    if (Discount.maxUsage > 0) {
      if (Discount.maxUsage <= Discount.usedCount) {
        return new Response(
          JSON.stringify({ message: "سقف تعداد استفاده از کد تمام شد" }),
          { status: 401 }
        );
      }
    }

    const now = Date.now();
    if (
      (Discount.startDate && Discount.startDate.getTime() > now) ||
      (Discount.endDate && Discount.endDate.getTime() < now)
    ) {
      return new Response(
        JSON.stringify({ message: "زمان استفاده از کد نامعتبر است" }),
        { status: 401 }
      );
    }

     const userData = await getUserFromRequest(req);

    // if (userData.user._id.equals(Discount.createdBy)){
    //   return new Response(
    //     JSON.stringify({ message: "این کد دعوت مخصوص استفاده دوستان شماست!" }),
    //     { status: 401 }
    //   );
    // }

   const organ =await Organ.findById(userData.user.organ)

   if (Discount.type == 'referral' && organ) {
    Discount.value = organ.discountValue;
   }

    return new Response(JSON.stringify({ message: "کد معتبر", Discount }));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "خطا در بررسی کد تخفیف" }), {
      status: 500,
    });
  }
}

import { NextResponse } from "next/server";
import User from "@/models/User";
import DiscountCode from "@/models/DiscountCode";
import Organ from "@/models/Organ";
import PaymentReport from "@/models/PaymentReport";

export async function POST(req) {
  try {
    let { id, code } = await req.json();
    code = code.trim().toUpperCase();

    const user = await User.findById(id);
    const Discount = await DiscountCode.findOne({ code });

    if (!user) return new Response(JSON.stringify({ message: "کاربر یافت نشد" }));  

    const userOrgan = await Organ.findById(user.organ);

    if (!userOrgan) return new Response(JSON.stringify({ message: "ارگان کاربر یافت نشد" })); 
    
    let amount = userOrgan.gamePrice;
    const mobile = user.mobile;
    const email = 'mparyabi@gmail.com';
    const description = `پرداخت بازی آب و هوا مربوط به ${user.firstName} ${user.lastName} از ${userOrgan.name}` ;
    const callback_url = 'https://netzeroway.ir/verify' ;

    if (Discount) {
    if (Discount.type === 'referral'){
        amount = amount - (amount * userOrgan.discountValue) / 100 
    }
    else if (Discount.type === 'coupon'){
        amount = amount - (amount * Discount.value)/100
      } 
    }

    const res = await fetch(
      "https://payment.zarinpal.com/pg/v4/payment/request.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount,
          callback_url,
          currency : 'IRT',
          description,
          metadata: {
            mobile,
            email,
          },
        }),
      }
    );

    const data = await res.json();

    if(data.data.code){
     await PaymentReport.create({
     Authority: data.data.authority,
     user: user._id,
     amount ,
     description,
     discount : Discount ? Discount._id : null,
     })
     return NextResponse.json(data, { status: 200 }); 
    }

    return NextResponse.json({status: 404 }); 

  } catch (error) {
    console.error("Payment request error:", error);
    return NextResponse.json(
      { message: "خطا در ایجاد تراکنش" },
      { status: 500 }
    );
  }
}

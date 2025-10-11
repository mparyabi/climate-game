import { NextResponse } from "next/server";
import PaymentReport from "@/models/PaymentReport";
import DiscountCode from "@/models/DiscountCode";
import DiscountUsage from "@/models/DiscountUsage";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { authority, status } = await req.json();

    const payment = await PaymentReport.findOne({ Authority: authority });
    if (!payment) {
      return NextResponse.json(
        { message: "این پرداخت معتبر نیست" },
        { status: 401 }
      );
    }

    if (payment.status !== "pending") {
      return NextResponse.json(
        { message: "این پرداخت قبلا پردازش شده" },
        { status: 403 }
      );
    }

    if (status === "NOK") {
      payment.status = "cancelled";
      await payment.save();
      return NextResponse.json(
        { message: "این پرداخت لغو شده است" },
        { status: 401 }
      );
    }

    const res = await fetch(
      "https://payment.zarinpal.com/pg/v4/payment/verify.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: payment.amount,
          authority,
        }),
      }
    );

    if (!res.ok) {
      console.error("Zarinpal verify failed:", res.status);
      return NextResponse.json(
        { message: "خطا در ارتباط با درگاه پرداخت" },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (data?.data?.code === 100 || data?.data?.code === 101) {

      payment.card_hash = data.data.card_hash;
      payment.card_pan = data.data.card_pan;
      payment.status = "verified";
      await payment.save();

      if (payment.discount) {
        const discountCode = await DiscountCode.findById(payment.discount);
        if (discountCode) {
          discountCode.usedCount++;
          await discountCode.save();

          await DiscountUsage.create({
            discountCode: discountCode._id,
            user: payment.user,
            orderId: payment._id,
          });
        }
      }

      const user = await User.findById(payment.user);
      user.payStatus = true;
      await user.save();

      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(
      { message: "پرداخت تایید نشد" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment request error:", error);
    return NextResponse.json(
      { message: "خطا در ایجاد تراکنش" },
      { status: 500 }
    );
  }
}

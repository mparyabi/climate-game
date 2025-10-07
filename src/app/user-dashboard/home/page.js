"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { MdPayment } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LogoutButton from "@/components/LogoutButton";
import CompeleteProfile from "@/components/CompeleteProfile";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponConfirm, setCouponConfirm] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [compeletedProfile , setCompeletedProfile] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setReferralCode(data.referralCode.code);
        setCompeletedProfile(data.user.isCompeletedProfile)
      } else {
        setUser(null);
      }
    };
    fetchMe();
  }, []);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">در حال بارگذاری...</p>
      </div>
    );

  const handlePay = async () => {
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user._id, code: coupon }),
      });

      // دریافت پاسخ JSON
      const data = await res.json();

      // بررسی وضعیت پاسخ
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "خطا",
          text: data.message || "مشکلی پیش آمد",
        });
        setCoupon("");
        setCouponConfirm(false);
        return;
      }

      if (data.data.code) {
        window.location.href = `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "ارتباط با سرور برقرار نشد",
      });
    }
  };

  const handleCouponCode = async () => {
    try {
      if (couponConfirm) return;
      // ارسال درخواست
      const res = await fetch("/api/coupon/checkcoupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: coupon }),
      });

      // دریافت پاسخ JSON
      const data = await res.json();

      // بررسی وضعیت پاسخ
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "خطا",
          text: data.message || "مشکلی پیش آمد",
        });
        setCoupon("");
        setCouponConfirm(false);
        return;
      }
      setCouponConfirm(true);
      setDiscount(data.Discount);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "ارتباط با سرور برقرار نشد",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          خانه داشبورد - {user.organ.name}
        </h1>
        <LogoutButton organ={user.organ} /> {/* اینجا دکمه خروج */}
      </div>
      <p className="text-xl">
        {" "}
        {user.firstName} {user.lastName} عزیز خوش آمدید!
      </p>
      {new Date(user.organ.startDate).getTime() <= Date.now() &&
      new Date(user.organ.endDate).getTime() >= Date.now() ? (
        user.payStatus ? (
          <div className=" bg-green-300 rounded-lg shadow p-4 text-center mt-4 flex items-center justify-center gap-2 flex-col">
            <div className="flex">
              <FaCheck className="text-2xl text-green-800 ml-2" /> پرداخت با
              موفقیت انجام شد{" "}
            </div>
            <div>
              {compeletedProfile ? (
                <a
                  href="/game"
                  className="bg-gray-100 p-2 rounded-lg shadow mt-2 cursor-pointer flex items-center gap-2 mx-auto"
                >
                  ورود به بازی
                </a>
              ) : (
                <>
                  <p className="mt-1.5 mb-1.5 font-bold">
                    {" "}
                    لطفا جهت ورود به بازی اطلاعات پروفایل خود را کامل کنید{" "}
                  </p>
                  <CompeleteProfile id={user._id} setCompeletedProfile={setCompeletedProfile}/>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className=" bg-red-300 rounded-lg shadow p-4 text-center mt-4 flex items-center justify-center gap-2 flex-col">
            <div className="flex">
              <IoCloseCircleOutline className="text-2xl text-red-800 ml-2" />
              هنوز هزینه بازی را پرداخت نکرده اید
            </div>
            {couponConfirm ? (
              <div className="text-2xl mb-1.5">
                قیمت بازی :{" "}
                <span className="line-through text-base">
                  {" "}
                  {user.organ.gamePrice.toLocaleString("fa")} تومان{" "}
                </span>
                <span className="mr-2">
                  {" "}
                  {(
                    user.organ.gamePrice -
                    (user.organ.gamePrice * discount.value) / 100
                  ).toLocaleString("fa")}{" "}
                  تومان{" "}
                </span>
              </div>
            ) : (
              <div className="text-2xl mb-1.5">
                قیمت بازی : {user.organ.gamePrice.toLocaleString("fa")} تومان
              </div>
            )}

            <div className="flex">
              <input
                type="text"
                placeholder="کد دعوت یا کد تخفیف"
                className="bg-amber-50 border-0 rounded-lg h-8 text-center w-3x font-[sans-serif]"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              ></input>
              <button
                onClick={handleCouponCode}
                className="bg-gray-800 text-white mr-2 p-1 rounded-sm cursor-pointer px-3 text-md"
              >
                اعمال کد
              </button>
            </div>
            <div>
              <button
                onClick={handlePay}
                className="bg-green-300 p-2 rounded-lg shadow mt-2 cursor-pointer flex items-center gap-2 mx-auto"
              >
                {" "}
                <MdPayment />
                پرداخت
              </button>
            </div>
          </div>
        )
      ) : (
        <>
          <div className=" bg-red-300 rounded-lg shadow p-4 text-center mt-4 flex items-center justify-center gap-2 flex-col">
            <p className="text-2xl text-center">
              متاسفیم ! بازی غیرفعال می باشد
            </p>
            <p className="text-xl text-center mt-3">
              زمان اجرای بازی فقط از{" "}
              {new Date(user.organ.startDate).toLocaleDateString("fa-IR")}
              {"  "} تا {"  "}{" "}
              {new Date(user.organ.endDate).toLocaleDateString("fa-IR")}
              {"  "}
              می‌باشد
            </p>
          </div>
        </>
      )}

      <div className="text-center mt-4 rounded shadow p-4 bg-amber-100">
        {" "}
        کد دعوت اختصاصی شما :{" "}
        <span className="font-[math] text-2xl"> {referralCode} </span>{" "}
        <p className="text-gray-600 mt-1.5">
          دوستان شما می توانند با این کد دعوت {user.organ.discountValue} درصد
          تخفیف بگیرند.
        </p>{" "}
      </div>
    </DashboardLayout>
  );
}

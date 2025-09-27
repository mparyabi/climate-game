"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { MdPayment } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setReferralCode(data.refferalcode.code);
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

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        خانه داشبورد - {user.organ.name}
      </h1>
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
              <button className="bg-gray-100 p-2 rounded-lg shadow mt-2 cursor-pointer flex items-center gap-2 mx-auto">
                ورود به بازی
              </button>
            </div>
          </div>
        ) : (
          <div className=" bg-red-300 rounded-lg shadow p-4 text-center mt-4 flex items-center justify-center gap-2 flex-col">
            <div className="flex">
              <IoCloseCircleOutline className="text-2xl text-red-800 ml-2" />
              هنوز هزینه بازی را پرداخت نکرده اید
            </div>
            <div className="text-2xl mb-1.5">
              قیمت بازی : {user.organ.gamePrice.toLocaleString("fa")} تومان
            </div>
            <div>
              <button className="bg-green-300 p-2 rounded-lg shadow mt-2 cursor-pointer flex items-center gap-2 mx-auto">
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
          <p className="text-2xl text-center">متاسفیم ! بازی غیرفعال می باشد</p>
          <p className="text-xl text-center mt-3">
              زمان اجرای بازی فقط از{" "}
            {new Date(user.organ.startDate).toLocaleDateString("fa-IR")}
            {"  "} تا {"  "} {new Date(user.organ.endDate).toLocaleDateString("fa-IR")}{"  "}
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

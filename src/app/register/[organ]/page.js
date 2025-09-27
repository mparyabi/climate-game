"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

function RegisterPage({ params }) {
  const resolvedParams = React.use(params);
  const { organ } = resolvedParams;
  const router = useRouter();
  const [step, setStep] = useState(1); // 1=ثبت‌نام، 2=ورود OTP
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [counter, setCounter] = useState(0);
  const [disabled, setDisabled] = useState(false);

  // کانتر برای OTP
  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    } else {
      setDisabled(false);
    }
    return () => clearInterval(timer);
  }, [counter]);

  // ارسال فرم ثبت نام
  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");

    // ✅ چک کردن فرمت شماره موبایل قبل از ارسال به سرور
    const mobileRegex = /^09\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      setMessage("شماره موبایل باید با 09 شروع شود و 11 رقم باشد");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register-send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, mobile, organ }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setMessage(
            <>
              این شماره قبلاً ثبت‌نام کرده.{" "}
              <Link href="/login" className="text-blue-600 underline">
                لطفاً وارد شوید
              </Link>{" "}
              یا شماره دیگری استفاده کنید.
            </>
          );
        } else if (res.status === 422) {
          setMessage(
            "هنوز کد یکبارمصرف قبلی اعتبار دارد. لطفا 2 دقیقه صبر کنید."
          );
        } else if (res.status === 401) {
          Swal.fire({
            icon: "error",
            title: "متاسفیم، لینک ثبت نام شما اشتباه است",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/"); // صفحه مقصد
            }
          });
        } else {
          setMessage(data.message || "خطایی رخ داده است");
        }
      } else {
        setMessage(data.message || "کد تایید ارسال شد");
        setDisabled(true);
        setCounter(120);
        setStep(2); // رفتن به مرحله OTP
      }
    } catch (err) {
      console.error("Register Error:", err);
      setMessage("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  // تایید OTP
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "OTP اشتباه است");
      } else {
        Swal.fire({
          icon: "success",
          title: "ثبت نام شما با موفقیت انجام شد",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/user-dashboard/home"); // صفحه مقصد
          }
        });
      }
    } catch (err) {
      console.error("OTP Error:", err);
      setMessage("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          ثبت‌نام
        </h1>

        {step === 1 && (
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* نام */}
            <input
              type="text"
              placeholder="نام"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            {/* نام خانوادگی */}
            <input
              type="text"
              placeholder="نام خانوادگی"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            {/* شماره موبایل */}
            <input
              type="tel"
              placeholder="شماره موبایل"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
              dir="rtl"
            />

            <button
              type="submit"
              disabled={loading || disabled}
              className="cursor-pointer w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            >
              {loading
                ? "در حال ارسال..."
                : disabled
                ? ` (${counter}) تا ارسال مجدد کد`
                : "دریافت کد یکبارمصرف"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-5" onSubmit={handleOtpSubmit}>
            <input
              type="text"
              placeholder="کد را وارد کنید"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            >
              {loading ? "در حال بررسی..." : "تایید کد یکبار مصرف"}
            </button>

            <p
              className="mt-2 text-center text-sm text-blue-600 cursor-pointer"
              onClick={() => {
                setStep(1);
                setCounter(0);
                setDisabled(false);
                setMessage("");
                setOtp("");
              }}
            >
              آیا می‌خواهید شماره خود را ویرایش کنید؟
            </p>
          </form>
        )}
        <Link className="flex justify-center mt-3" href="/login">
          {" "}
          آیا حساب کاربری دارید؟ وارد شوید...{" "}
        </Link>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </main>
  );
}

export default RegisterPage;

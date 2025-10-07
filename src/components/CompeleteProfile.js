"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

function CompeleteProfile({ id, setCompeletedProfile }) {
  const [form, setForm] = useState({
    gender: "",
    studyField: "",
    educationLevel: "",
    educationLocation: "",
    job: "",
    jobLocationName: "",
    id,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setSubmitting(false);
        setCompeletedProfile(true);
        Swal.fire({
          icon: "success",
          title: "اطلاعات پروفایل شما با موفقیت تکمیل شد",
          confirmButtonText: "باشه",
        });
      }
    } catch (err) {
      console.log("error eccured", err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="text-right max-w-lg bg-white border border-gray-200 rounded-xl p-6 space-y-5 mt-4 shadow-sm"
      dir="rtl"
    >
      {/* جنسیت */}
      <div>
        <label className="block font-bold text-gray-800 mb-2">جنسیت</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
              className="accent-blue-600 w-4 h-4"
              required
            />
            آقا
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
              className="accent-pink-600 w-4 h-4"
            />
            خانم
          </label>
        </div>
      </div>

      {/* آخرین رشته تحصیلی */}
      <div>
        <label className="block font-bold text-gray-800 mb-2">
          آخرین رشته تحصیلی
        </label>
        <input
          name="studyField"
          value={form.studyField}
          onChange={handleChange}
          placeholder="مثال: مهندسی نرم‌افزار"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          required
        />
      </div>

      {/* آخرین مقطع تحصیلی */}
      <div>
        <label className="block font-bold text-gray-800 mb-2">
          آخرین مقطع تحصیلی
        </label>
        <select
          name="educationLevel"
          value={form.educationLevel}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          required
        >
          <option value="">انتخاب کنید</option>
          <option value="دیپلم">دیپلم</option>
          <option value="کاردانی">کاردانی</option>
          <option value="کارشناسی">کارشناسی</option>
          <option value="کارشناسی ارشد">کارشناسی ارشد</option>
          <option value="دکتری">دکتری</option>
        </select>
      </div>

      {/* محل تحصیل */}
      <div>
        <label className="block font-bold text-gray-800 mb-2">محل تحصیل</label>
        <input
          name="educationLocation"
          value={form.educationLocation}
          onChange={handleChange}
          placeholder="نام دانشگاه یا مدرسه"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          required
        />
      </div>

      {/* شغل و محل اشتغال */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-bold text-gray-800 mb-2">شغل</label>
          <input
            name="job"
            required
            value={form.job}
            onChange={handleChange}
            placeholder="مثال: استاد دانشگاه"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-800 mb-2">
            نام محل اشتغال
          </label>
          <input
            name="jobLocationName"
            required
            value={form.jobLocationName}
            onChange={handleChange}
            placeholder="نام شرکت یا محل کار"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* دکمه ارسال */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2.5 text-sm disabled:opacity-60"
        >
          {submitting ? "در حال ارسال..." : "ارسال اطلاعات و ورود به بازی"}
        </button>

        {success && (
          <p className="mt-3 text-sm text-green-600 text-center">
            اطلاعات با موفقیت ارسال شد.
          </p>
        )}
      </div>
    </form>
  );
}

export default CompeleteProfile;

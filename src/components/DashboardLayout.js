"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight ,MdOutlinePayments} from "react-icons/md";



// Props: children => محتوای هر صفحه داخلی داشبورد
function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-blue-50">
      {/* سایدبار */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-6 border-b">
          <h2 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>
            داشبورد
          </h2>
          <button
            className="text-gray-500 focus:outline-none cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ?  <MdKeyboardDoubleArrowRight /> : <MdKeyboardDoubleArrowLeft />
            }
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-2">
          <Link
            href="/user-dashboard/home"
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-blue-100 transition"
          >
            <span className="material-icons"><IoMdHome /></span>
            {sidebarOpen && <span>خانه</span>}
          </Link>

          <Link
            href="/user-dashboard/payment"
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-blue-100 transition"
          >
            <span className="material-icons"><MdOutlinePayments /></span>
            {sidebarOpen && <span>سوابق پرداخت</span>}
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-blue-100 transition"
          >
            <span className="material-icons">settings</span>
            {sidebarOpen && <span>تنظیمات</span>}
          </Link>
        </nav>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 p-6">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl p-6 shadow-xl">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;

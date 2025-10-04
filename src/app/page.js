"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [organs, setOrgans] = useState([]);

  useEffect(() => {
    const getOrgans = async () => {
      const res = await fetch("/api/organ");
      if (res.ok) {
        const data = await res.json();
        setOrgans(data.publishedOrgans);
      }
    };
    getOrgans();
  }, []);
  return (
    <main className="bg-[#0a0f1a] text-white font-sans">
      {/* Hero Section */}
      <section
        className="relative h-[90vh] flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/static/bg-carbon-price.DBevM3F6.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-5xl font-extrabold mb-4 text-cyan-400 drop-shadow-lg">
            NetZeroWay
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            تجربه‌ای نو از بازی‌های سازمانی برای تیم‌های حرفه‌ای. رقابت، همکاری
            و استراتژی در دنیایی مجازی.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#organizations"
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-lg transition"
            >
              سازمان‌های فعال
            </a>
            <a
              href="#organizations"
              className="px-6 py-3 border border-cyan-400 hover:bg-cyan-400 hover:text-black rounded-xl transition"
            >
              اطلاعات بیشتر
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#0f172a] text-center px-6">
        <h2 className="text-3xl font-bold text-cyan-400 mb-8">
          درباره NetZeroWay
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
          NetZeroWay یک بازی استراتژیک سازمانی است که برای افزایش همکاری،
          تصمیم‌گیری و تفکر سیستمی در تیم‌ها طراحی شده. این بازی به شما کمک
          می‌کند تا در محیطی رقابتی و امن، مهارت‌های مدیریتی خود را تقویت کنید.
        </p>
      </section>

      {/* Organizations Section */}
      <section id="organizations" className="py-20 bg-[#111827]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-12">
            سازمان‌هایی که از NetZeroWay استفاده می‌کنند
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">

            {organs.filter(org => org.isPublish).map((org, i) => (
              <Link href={`/login/${org.link}`} key={i}>
              <div
                className="bg-[#1e293b] rounded-2xl p-6 shadow-xl hover:shadow-cyan-500/30 transition transform hover:-translate-y-2 w-full max-w-sm"
              >
                <Image
                  src={org.img}
                  alt={org.name}
                  width={300}
                  height={300}
                  className="w-28 mx-auto mb-6 object-contain bg-white rounded-2xl p-3"
                />
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">
                  {org.name}
                </h3>
                 <p className="text-gray-950 text-sm rounded-2xl mt-4 h-6 bg-[#95989e]">ورود به بازی</p> 
              </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 text-center text-gray-500 text-sm font-serif" dir="ltr">
        © 2025 NetZeroWay. All rights reserved   <p><a href="https://paryabi.ir"> made with ❤ by mparyabi </a></p>
      </footer>
    </main>
  );
}

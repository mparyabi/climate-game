"use client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { MdLogout } from "react-icons/md";

export default function LogoutButton({ organ }) {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید می‌خواهید خارج شوید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، خروج",
      cancelButtonText: "انصراف",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("/api/logout", { method: "POST" });
        if (res.ok) {
          Swal.fire(
            "خروج انجام شد!",
            "شما به صفحه اصلی منتقل می‌شوید.",
            "success"
          );
          router.push(`/login/${organ.link}`);
        } else {
          Swal.fire("خطا!", "مشکلی در خروج رخ داد.", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("خطا!", "مشکل اتصال به سرور.", "error");
      }
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 text-red-600 font-bold hover:text-red-800 transition cursor-pointer"
    >
      <MdLogout size={20} />
      خروج
    </button>
  );
}

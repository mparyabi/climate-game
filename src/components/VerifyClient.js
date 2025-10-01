"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function VerifyClient({ status, authority }) {
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/pay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, authority }),
      });

      const data = await res.json();

      if (!res.ok || status === "NOK") {
        Swal.fire({
          icon: "error",
          title: "پرداخت ناموفق",
          text: data.message || "در صورت کسر مبلغ ظرف 72 ساعت بازگردانده می‌شود",
          confirmButtonText: "باشه",
        }).then(() => router.push("/user-dashboard/home"));
        return;
      }

      if (data?.data?.code) {
        Swal.fire({
          icon: "success",
          title: "پرداخت موفق",
          text: "حالا می‌توانید به بازی ورود کنید",
          confirmButtonText: "باشه",
        }).then(() => router.push("/user-dashboard/home"));
      }
    }

    fetchData();
  }, [status, authority]);

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* می‌توانی loader اضافه کنی */}
    </div>
  );
}

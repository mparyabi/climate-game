import DashboardLayout from "@/components/DashboardLayout";
import { getUserFromRequest } from "@/lib/authUser";
import PaymentReport from "@/models/PaymentReport";
import React from "react";

async function PaymentHistory() {
  const user = await getUserFromRequest();
  const payment = await PaymentReport.find({
    user: user.user._id,
  }).sort({ updatedAt: -1 });

  if (payment.length === 0) {
    return (
      <DashboardLayout>
        <p className="text-center py-6">هیچ تراکنشی یافت نشد</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                مبلغ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                تاریخ پرداخت
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                توضیحات
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                وضعیت پرداخت
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payment.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-right whitespace-nowrap text-gray-800 font-medium">
                  {item.amount} تومان
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap text-gray-500">
                  {new Date(item.updatedAt).toLocaleString("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 text-right text-gray-600">
                  {item.description || "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  {item.status === "verified" ? (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                      موفق
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
                      ناموفق
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default PaymentHistory;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";

const SubscriptionResult = () => {
  const [message, setMessage] = useState("결제 처리 중...");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    if (status === "success") {
      setMessage("✅ 결제가 완료되었습니다!");
    } else if (status === "cancel") {
      setMessage("❌ 결제가 취소되었습니다.");
    } else if (status === "fail") {
      setMessage("⚠️ 결제에 실패했습니다. 다시 시도해주세요.");
    } else {
      setMessage("알 수 없는 결제 상태입니다.");
    }
  }, [location]);

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">
      <Header />

      <main className="mt-52 w-full max-w-5xl font-cafe24 mx-auto justify-center items-center">
        <div className="w-full flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-12">
          <h1 className="text-4xl font-bold text-gray-900">{message}</h1>
          <a href="/subscribe"
            className="mt-20 px-6 py-2 rounded-lg text-white transition hover:border-transparent border hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]" style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }}
          >
            결제 페이지로 돌아가기
          </a>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionResult;

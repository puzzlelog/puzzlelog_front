import React, { useState, useEffect } from "react";
import Header from "../components/Header";

const TimeCapsuleBox = () => {
  const [timeCapsules, setTimeCapsules] = useState([]);

  useEffect(() => {
    // 로컬 스토리지 또는 API에서 타임캡슐 데이터 가져오기
    const storedCapsules = JSON.parse(localStorage.getItem("timeCapsules")) || [];
    setTimeCapsules(storedCapsules);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header />
      <main className="mt-10 w-full max-w-4xl">
        <h2 className="text-4xl font-semibold text-center text-[#6B4F35] mb-6">타임캡슐 모음집</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {timeCapsules.length > 0 ? (
            timeCapsules.map((capsule, index) => (
              <div key={index} className="p-4 bg-[#EADDC5] rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold">{capsule.openDate}</h3>
                <p className="text-gray-700 mt-2">{capsule.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">저장된 타임캡슐이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TimeCapsuleBox;

import React, { useState, useEffect } from "react";
import Header from "../components/Header";

const auroraStyle = `
@keyframes aurora {
  0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
  50% { transform: translateX(100%) rotate(10deg); opacity: 0.5; }
  100% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
    transform: scale(1);
  }
}

@keyframes pulseGlow2 {
  0% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
  }
}

`;

const TimeCapsuleBox = () => {
  const [timeCapsules, setTimeCapsules] = useState([]);

  useEffect(() => {
    // 로컬 스토리지 또는 API에서 타임캡슐 데이터 가져오기
    const storedCapsules = JSON.parse(localStorage.getItem("timeCapsules")) || [];
    setTimeCapsules(storedCapsules);
  }, []);

  return (
    <>
    <style>{auroraStyle}</style>

    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">
      <Header />
      <main className="mt-44 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
      <div className="text-center">

        <h2 className="text-3xl font-semibold text-center text-[#6B4F35] mb-6">타임캡슐 모음집</h2>
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

      </div>
      </main>
    </div>

    </>
  );
};

export default TimeCapsuleBox;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/AdminHeader"; 

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

const AdminPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem("role")); //role을 useState로 관리

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); //최신 role 값 가져오기
    setUserRole(storedRole); //state 업데이트

    if (storedRole !== "ADMIN") {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/home"); //관리자가 아니라면 홈으로 리다이렉트
    }
  }, []); //처음 렌더링될 때 한 번만 실행

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
      <Header />
      <style>{auroraStyle}</style>
      <main className="mt-48 w-full max-w-7xl font-cafe24 mx-auto justify-center items-center">
        <h2 className="text-4xl font-semibold text-left text-[#6B4F35] mb-6">
          환영합니다, 관리자님
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          여기에서 **스티커 추가, 광고 수정 및 챌린지 활성화**를 관리할 수 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/*스티커 관리 */}
          <div className="p-8 bg-white rounded-lg shadow-lg flex flex-col items-center"
            style={{
              animation: "pulseGlow2 3s infinite",
              background: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <h3 className="text-2xl font-semibold mb-8">스티커 관리</h3>
            <button
              onClick={() => navigate("/adminEditAsset")}
              className="px-4 py-2 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105"
            >
              스티커 추가
            </button>
          </div>

          {/* 광고 관리 */}
          <div className="p-8 bg-white rounded-lg shadow-lg flex flex-col items-center"
            style={{
              animation: "pulseGlow2 3s infinite",
              background: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <h3 className="text-2xl font-semibold mb-8">광고 관리</h3>
            <button
              onClick={() => navigate("/adminEditAds")}
              className="px-4 py-2 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105"
            >
              광고 수정
            </button>
          </div>

          {/* 챌린지 관리 */}
          <div className="p-8 bg-white rounded-lg shadow-lg col-span-2 flex flex-col items-center"
            style={{
              animation: "pulseGlow2 3s infinite",
              background: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <h3 className="text-2xl font-semibold mb-8">챌린지 관리</h3>
            <button
              onClick={() => navigate("/adminEditChallenge")}
              className="px-4 py-2 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105"
            >
              챌린지 활성화
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

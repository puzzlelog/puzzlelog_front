import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/AdminHeader"; 

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
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header />
      <main className="mt-10 w-full max-w-5xl">
        <h2 className="text-4xl font-semibold text-left text-[#6B4F35] mb-6">
          환영합니다, 관리자님
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          여기에서 **스티커 추가, 광고 수정 및 챌린지 활성화**를 관리할 수 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/*스티커 관리 */}
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-3">스티커 관리</h3>
            <button
              onClick={() => navigate("/adminEditSticker")}
              className="mt-3 px-4 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
            >
              스티커 추가
            </button>
          </div>

          {/* 광고 관리 */}
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-3">광고 관리</h3>
            <button
              onClick={() => navigate("/adminEditAds")}
              className="mt-3 px-4 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
            >
              광고 수정
            </button>
          </div>

          {/* 챌린지 관리 */}
          <div className="p-6 bg-white rounded-lg shadow-lg col-span-2 flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-3">챌린지 관리</h3>
            <button
              onClick={() => navigate("/adminEditChallenge")}
              className="mt-3 px-4 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
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

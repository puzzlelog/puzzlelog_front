<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import FabricCanvasViewer from "./FabricCanvasViewer";
import { useLocation, useNavigate } from "react-router-dom";
=======
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import FabricCanvasViewer from "./FabricCanvasViewer";
import { useLocation } from "react-router-dom"; // 추가
>>>>>>> b504c1f (subscription)

// MakePiece에서 사용된 애니메이션 스타일
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

const DiaryBox = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> b504c1f (subscription)
  const [diaries, setDiaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDiary, setSelectedDiary] = useState(null);
<<<<<<< HEAD
  const pageSize = 8;
=======
  const pageSize = 9;
>>>>>>> b504c1f (subscription)
  const userId = localStorage.getItem("userId");

  // 쿼리 파라미터 읽기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get("date"); // 예: "2025-03-30"

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("로그인이 필요합니다.");
        if (!userId) throw new Error("userId가 없습니다.");

        const res = await axios.get(
          `https://api.puzzlelog.me/diaries?userId=${userId}&includeElements=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
<<<<<<< HEAD
        const diariesData = res.data.data?.diaries || [];
        const onlyDiaries = diariesData.filter(
          (d) => !d.openAt || d.openAt === ""
        );
        setDiaries(onlyDiaries);
      } catch (err) {
        setError(err.message);
=======
        console.log("API 응답 전체:", JSON.stringify(res.data, null, 2));
        const diariesData = res.data.data?.diaries || res.data.diaries || [];
        const onlyDiaries = diariesData.filter(
          (d) => !d.openAt || d.openAt === ""
        );
        console.log("필터링된 일기:", onlyDiaries);
        setDiaries(onlyDiaries);
      } catch (err) {
        console.error(
          "일기 데이터를 불러오는 중 오류 발생:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.message || err.message);
>>>>>>> b504c1f (subscription)
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
<<<<<<< HEAD
      fetchDiaries();
    } else {
      setError("로그인 해주세요.");
=======
      console.log("userId:", userId);
      fetchDiaries();
    } else {
      console.warn("userId가 없습니다.");
      setError("userId가 필요합니다. 로그인이 필요합니다.");
>>>>>>> b504c1f (subscription)
      setLoading(false);
      window.location.href = "/login";
    }
  }, [userId]);

<<<<<<< HEAD
  // 날짜 필터링 적용
  const diariesToShow =
    dateParam && dateParam !== "all"
      ? diaries.filter((d) => d.createdAt?.split("T")[0] === dateParam)
      : diaries;
=======
  useEffect(() => {
    console.log("diaries 상태 업데이트됨:", diaries);
  }, [diaries]);

  // 날짜 필터링 적용: dateParam이 있으면 해당 날짜에 맞는 일기만 사용
  const diariesToShow =
  dateParam && dateParam !== "all"
    ? diaries.filter((d) => d.createdAt?.split("T")[0] === dateParam)
    : diaries;

>>>>>>> b504c1f (subscription)

  const totalPages = Math.ceil(diariesToShow.length / pageSize);
  const paginatedDiaries = diariesToShow.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleDiaryClick = (diary) => {
    setSelectedDiary(diary);
  };

<<<<<<< HEAD
  if (loading) return <p className="text-center text-white">로딩 중...</p>;
  if (error) return <p className="text-center text-white">오류: {error}</p>;
=======
  if (loading)
    return <p className="text-center text-gray-700">로딩 중...</p>;
  if (error)
    return <p className="text-center text-red-500">오류: {error}</p>;
>>>>>>> b504c1f (subscription)

  return (
    <>
      <style>{auroraStyle}</style>
<<<<<<< HEAD
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
        <Header />
=======
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
        {/* 상단 헤더 */}
        <Header />

        {/* 헤더 높이만큼 여백을 넉넉하게 주어 겹침 방지 (pt-28) */}
>>>>>>> b504c1f (subscription)
        <div className="max-w-[1200px] mx-auto flex gap-14 pt-28 px-4">
          {/* 좌측: 일기 목록 + 페이지네이션 */}
          <div className="w-1/3">
            {paginatedDiaries.length === 0 ? (
<<<<<<< HEAD
              <p className="text-center text-white text-xl font-cafe24">
                일기가 없습니다.
              </p>
            ) : (
              <ul className="space-y-4">
                {paginatedDiaries.map((diary) => (
                  <li
                    key={diary.diaryId}
                    className="rounded-lg shadow-2xl shadow-indigo-500/50 transition-transform duration-300 hover:scale-105"
=======
              <p className="text-center text-gray-700 text-xl font-cafe24">
                일기가 없습니다.
              </p>
            ) : (
              <ul className="space-y-2">
                {paginatedDiaries.map((diary) => (
                  <li
                    key={diary.diaryId}
                    className="rounded-lg shadow-2xl shadow-indigo-500/50 flex justify-between items-center transition-transform duration-300 hover:scale-105"
>>>>>>> b504c1f (subscription)
                    style={{
                      animation: "pulseGlow2 3s infinite",
                      background: "rgba(255, 255, 255, 0.3)",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleDiaryClick(diary)}
                  >
                    <div>
<<<<<<< HEAD
                      <h3 className="text-xl font-semibold text-white font-cafe24">
                        {diary.title || "제목 없음"}
                      </h3>
                      <p className="text-lg text-white mt-1 font-cafe24">
                        {new Date(diary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
=======
                      <h3 className="text-xl font-semibold text-gray-800 font-cafe24">
                        {diary.title || "제목 없음"}
                      </h3>
                      <p className="text-lg text-gray-700 mt-1 font-cafe24">
                        {new Date(diary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-gray-400">➔</span>
>>>>>>> b504c1f (subscription)
                  </li>
                ))}
              </ul>
            )}

            {/* 페이지네이션 */}
            {totalPages > 0 && (
              <div className="flex justify-center mt-12 gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
<<<<<<< HEAD
                  className="px-4 py-2 bg-white bg-opacity-30 text-white rounded-lg shadow-md hover:bg-opacity-50 transition disabled:opacity-50 font-cafe24"
=======
                  className="px-4 py-2 bg-white bg-opacity-30 text-gray-800 rounded-lg shadow-md hover:bg-opacity-50 transition disabled:opacity-50 font-cafe24"
>>>>>>> b504c1f (subscription)
                  style={{ animation: "pulseGlow2 3s infinite" }}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-4 py-2 rounded-lg shadow-md font-cafe24 ${
                      currentPage === i
                        ? "bg-[#6B4F35] text-white"
<<<<<<< HEAD
                        : "bg-white bg-opacity-30 text-white hover:bg-opacity-50"
=======
                        : "bg-white bg-opacity-30 text-gray-800 hover:bg-opacity-50"
>>>>>>> b504c1f (subscription)
                    }`}
                    style={{ animation: "pulseGlow2 3s infinite" }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage === totalPages - 1}
<<<<<<< HEAD
                  className="px-4 py-2 bg-white bg-opacity-30 text-white rounded-lg shadow-md hover:bg-opacity-50 transition disabled:opacity-50 font-cafe24"
=======
                  className="px-4 py-2 bg-white bg-opacity-30 text-gray-800 rounded-lg shadow-md hover:bg-opacity-50 transition disabled:opacity-50 font-cafe24"
>>>>>>> b504c1f (subscription)
                  style={{ animation: "pulseGlow2 3s infinite" }}
                >
                  »
                </button>
              </div>
            )}
          </div>

          {/* 우측: 선택된 일기(캔버스) */}
          <div className="w-2/3">
            {selectedDiary ? (
              <div
                className="rounded-xl shadow-2xl shadow-indigo-500/50 flex justify-center items-center w-full h-[800px] bg-white bg-opacity-30"
                style={{ animation: "pulseGlow2 3s infinite" }}
              >
                <FabricCanvasViewer
                  diary={selectedDiary}
                  debugId={selectedDiary.diaryId}
                />
              </div>
            ) : (
<<<<<<< HEAD
              <div className="flex items-center justify-center w-full h-[800px]">
                <p className="text-center text-white text-xl font-cafe24">
                  일기를 선택해주세요.
                </p>
=======
              <div className="text-center text-gray-700 text-xl font-cafe24 mt-20">
                일기를 선택해주세요.
>>>>>>> b504c1f (subscription)
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

<<<<<<< HEAD
export default DiaryBox;
=======
export default DiaryBox;
>>>>>>> b504c1f (subscription)

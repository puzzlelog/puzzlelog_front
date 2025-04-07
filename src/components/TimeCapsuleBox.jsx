import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import FabricCanvasViewer from "./FabricCanvasViewer";

const auroraStyle = `...`; // 기존 스타일

const TimeCapsuleBox = () => {
  const [diaries, setDiaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 8;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token || !userId) throw new Error("로그인이 필요합니다.");

        const res = await axios.get(
          `https://api.puzzlelog.me/diaries?userId=${userId}&includeElements=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const diariesData = res.data.data?.diaries || [];
        // openAt이 있고, participants가 1명 이하인 경우 -> 타임캡슐
        const timeCapsules = diariesData.filter((d) => {
          const isTimeCapsule = !!d.openAt;
          const isNotCollaborative = !d.participants || d.participants.length <= 1;
          return isTimeCapsule && isNotCollaborative;
        });
        setDiaries(timeCapsules);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDiaries();
    } else {
      setError("userId가 필요합니다.");
      setLoading(false);
    }
  }, [userId]);

  const totalPages = Math.ceil(diaries.length / pageSize);
  const paginatedDiaries = diaries.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleDiaryClick = (diary) => {
    setSelectedDiary(diary);
  };

  if (loading) return <p className="text-center mt-20">로딩 중...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">오류: {error}</p>;

  return (
    <>
      <style>{auroraStyle}</style>
<<<<<<< HEAD
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
=======
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
>>>>>>> b504c1f (subscription)
        <Header />

        <div className="max-w-[1200px] mx-auto flex gap-14 pt-28 px-4">
          {/* 좌측: 타임캡슐 목록 */}
          <div className="w-1/3">
            {paginatedDiaries.length === 0 ? (
<<<<<<< HEAD
              <p className="text-center text-white text-xl font-cafe24">
=======
              <p className="text-center text-gray-700 text-xl font-cafe24">
>>>>>>> b504c1f (subscription)
                타임캡슐이 없습니다.
              </p>
            ) : (
              <ul className="space-y-2">
                {paginatedDiaries.map((diary) => {
                  const openAt = new Date(diary.openAt);
                  const openDate = openAt.toLocaleDateString("ko-KR");

                  return (
                    <li
                      key={diary.diaryId}
                      onClick={() => handleDiaryClick(diary)}
                      className="rounded-lg shadow-2xl shadow-amber-300/50 flex justify-between items-center transition-transform duration-300 hover:scale-105"
                      style={{
                        animation: "pulseGlow2 3s infinite",
                        background: "rgba(255, 255, 255, 0.3)",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      <div>
<<<<<<< HEAD
                        <h3 className="text-xl font-semibold text-white font-cafe24">
                          {diary.title || "제목 없음"}
                        </h3>
                        <p className="text-lg text-white mt-1 font-cafe24">
                          {openDate}
                        </p>
                      </div>
                      <span className="text-white">➔</span>
=======
                        <h3 className="text-xl font-semibold text-gray-800 font-cafe24">
                          {diary.title || "제목 없음"}
                        </h3>
                        <p className="text-lg text-gray-700 mt-1 font-cafe24">
                          {openDate}
                        </p>
                      </div>
                      <span className="text-gray-400">➔</span>
>>>>>>> b504c1f (subscription)
                    </li>
                  );
                })}
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

          {/* 우측: 선택된 타임캡슐 미리보기 */}
          <div className="w-2/3 flex items-center justify-center">
            {selectedDiary ? (
              (() => {
                const openAt = new Date(selectedDiary.openAt);
                const now = new Date();
                const isLocked = openAt > now;

                return (
                  <div
                    // w-[800px] h-[800px] 로 고정
                    className="rounded-xl shadow-2xl shadow-amber-300/50 w-[800px] h-[800px] bg-white bg-opacity-30 relative"
                    style={{ animation: "pulseGlow2 3s infinite" }}
                  >
                    {isLocked ? (
                      <>
                        <img
                          src="/images/lock-background.jpeg"
                          alt="잠금배경"
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                        <div className="z-10 w-full h-full flex flex-col items-center justify-center">
                          <div className="text-6xl mb-4">🔒</div>
                          <div className="text-lg font-semibold">
                            {openAt.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}에 열립니다
                          </div>
                        </div>
                      </>
                    ) : (
                      <FabricCanvasViewer
                        diary={selectedDiary}
                        debugId={selectedDiary.diaryId}
                      />
                    )}
                  </div>
                );
              })()
            ) : (
<<<<<<< HEAD
  <div className="flex items-center justify-center w-full h-[800px]">
                <p className="text-center text-white text-xl font-cafe24">
                  타입캡슐을 선택해주세요.
                </p>
=======
              <div className="text-center text-gray-700 text-xl font-cafe24 mt-20">
                타임캡슐을 선택해주세요.
>>>>>>> b504c1f (subscription)
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeCapsuleBox;

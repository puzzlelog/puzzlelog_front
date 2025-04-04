import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import FabricCanvasViewer from "./FabricCanvasViewer";
import { useLocation, useNavigate } from "react-router-dom";

// 애니메이션 스타일 (DiaryBox와 동일)
const auroraStyle = `
@keyframes aurora {
  0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
  50% { transform: translateX(100%) rotate(10deg); opacity: 0.5; }
  100% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6);
    transform: scale(1);
  }
}

@keyframes pulseGlow2 {
  0% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8); }
  100% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
}
`;

const CollaborativeDiaryBox = () => {
  const [diaries, setDiaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const pageSize = 9;
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get("date");

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("로그인이 필요합니다.");
        if (!userId) throw new Error("userId가 없습니다.");

        const res = await axios.get(
          `https://api.puzzlelog.me/diaries?includeElements=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("API 응답 전체:", JSON.stringify(res.data, null, 2));
        const diariesData = res.data.data?.diaries || res.data.diaries || [];

        // 협업일기 필터링: participants 배열에 2명 이상 포함 + 현재 사용자가 참여자에 포함
        const collaborativeDiaries = diariesData.filter((d) => {
          const isCollaborative = d.participants && d.participants.length > 1;
          const userIsParticipant = d.participants?.includes(userId); // 문자열 배열로 처리
          console.log(`Diary ${d.diaryId}: isCollaborative=${isCollaborative}, userIsParticipant=${userIsParticipant}`);
          return isCollaborative && userIsParticipant;
        });

        console.log("필터링된 협업일기:", collaborativeDiaries);
        setDiaries(collaborativeDiaries);
      } catch (err) {
        console.error("일기 데이터를 불러오는 중 오류 발생:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      console.log("userId:", userId);
      fetchDiaries();
    } else {
      console.warn("userId가 없습니다.");
      setError("userId가 필요합니다. 로그인이 필요합니다.");
      setLoading(false);
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    console.log("diaries 상태 업데이트됨:", diaries);
  }, [diaries]);

  const diariesToShow =
    dateParam && dateParam !== "all"
      ? diaries.filter((d) => d.createdAt?.split("T")[0] === dateParam)
      : diaries;

  const totalPages = Math.ceil(diariesToShow.length / pageSize);
  const paginatedDiaries = diariesToShow.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleDiaryClick = (diary) => {
    setSelectedDiary(diary);
  };

  if (loading)
    return <p className="text-center text-gray-700">로딩 중...</p>;
  if (error)
    return <p className="text-center text-red-500">오류: {error}</p>;

  return (
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
        <Header />
        <div className="max-w-[1200px] mx-auto flex gap-14 pt-28 px-4">
          <div className="w-1/3">
            {paginatedDiaries.length === 0 ? (
              <p className="text-center text-white text-xl font-cafe24">
                참여한 협업 일기가 없습니다.
              </p>
            ) : (
              <ul className="space-y-2">
                {paginatedDiaries.map((diary) => (
                  <li
                    key={diary.diaryId}
                    className="rounded-lg shadow-2xl shadow-indigo-500/50 flex justify-between items-center transition-transform duration-300 hover:scale-105"
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
                      <h3 className="text-xl font-semibold text-white font-cafe24">
                        {diary.title || "제목 없음"}
                      </h3>
                      <p className="text-lg text-white mt-1 font-cafe24">
                        {new Date(diary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-white">➔</span>
                  </li>
                ))}
              </ul>
            )}
            {totalPages > 0 && (
              <div className="flex justify-center mt-12 gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-white bg-opacity-30 text-white rounded-lg shadow-md hover:bg-opacity-50 transition disabled:opacity-50 font-cafe24"
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
                        : "bg-white bg-opacity-30 text-white hover:bg-opacity-50"
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
                  className="px-4 py-2 bg-white bg-opacity-30 text-white rounded-lg shadow-md hover:bg-opacity-50 transition disabled:opacity-50 font-cafe24"
                  style={{ animation: "pulseGlow2 3s infinite" }}
                >
                  »
                </button>
              </div>
            )}
          </div>
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
              <div className="flex items-center justify-center w-full h-[800px]">
                <p className="text-center text-white text-xl font-cafe24">
                  협업일기를 선택해주세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollaborativeDiaryBox;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import FabricCanvasViewer from "./FabricCanvasViewer";
import { useNavigate } from "react-router-dom";

const auroraStyle = `
@keyframes aurora {
  0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
  50% { transform: translateX(100%) rotate(10deg); opacity: 0.5; }
  100% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); transform: scale(1); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8); transform: scale(1.05); }
  100% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); transform: scale(1); }
}

@keyframes pulseGlow2 {
  0% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8); }
  100% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
}
`;

const UploadPost = () => {
  const [diaries, setDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8;
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 일기 목록 불러오기 (elements 필드 보강)
  useEffect(() => {
    const fetchDiaries = async () => {
      try {
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
        const diariesData = res.data.data?.diaries || res.data.diaries || [];
        // 공개되지 않은 일기만 선택 (openAt이 null 또는 빈 값)
        const onlyDiaries = diariesData.filter((d) => !d.openAt || d.openAt === "");
        // elements 필드 보강: 없으면 빈 배열 할당
        const diariesWithElements = onlyDiaries.map((d) => ({
          ...d,
          elements: d.elements || [],
        }));
        setDiaries(diariesWithElements);
      } catch (err) {
        console.error("일기 불러오기 실패 :", err.response?.data || err.message);
      }
    };

    if (userId) {
      fetchDiaries();
    } else {
      window.location.href = "/login";
    }
  }, [userId]);

  const totalPages = Math.ceil(diaries.length / pageSize);
  const paginatedDiaries = diaries.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  // 일기 클릭 시, 콘솔에 선택된 일기 객체와 diaryId를 출력하고 선택 상태 토글
  const handleDiaryClick = (diary) => {
    console.log("선택된 일기 객체:", diary);
    console.log("선택된 일기 id:", diary.diaryId);
    if (selectedDiary && selectedDiary.diaryId === diary.diaryId) {
      setSelectedDiary(null);
    } else {
      setSelectedDiary(diary);
    }
  };

  // 업로드 버튼 클릭: 선택된 일기의 diaryId, title, userId를 API에 전송
  const handleUpload = async () => {
    if (!selectedDiary) {
      alert("공유할 일기를 선택해주세요.");
      return;
    }
    try {
      await axios.post(
        "https://api.puzzlelog.me/posts",
        {
          userId,
          diaryId: selectedDiary.diaryId, // diaryId 필드 사용
          title: selectedDiary.title,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("게시글이 성공적으로 업로드되었습니다.");
      setSelectedDiary(null);
      navigate("/postList");
    } catch (error) {
      console.error("게시글 업로드 실패 : ", error.response?.data || error.message);
      alert("게시글 업로드에 실패했습니다.");
    }
  };

  return (
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
        <Header />
        <div className="max-w-[1200px] mx-auto flex gap-14 pt-28 px-4 mb-4">
          {/* 좌측: 일기 목록 + 페이지네이션 */}
          <div className="w-1/3">
            {paginatedDiaries.length === 0 ? (
              <p className="text-center text-gray-700 text-xl font-cafe24">
                일기가 없습니다.
              </p>
            ) : (
              <ul className="space-y-2">
                {paginatedDiaries.map((diary) => (
                  <li
                    key={diary.diaryId}  // 고유 키로 diary.diaryId 사용
                    className="rounded-lg shadow-2xl shadow-indigo-500/50 flex justify-between items-center transition-transform duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      animation: "pulseGlow2 3s infinite",
                      background: "rgba(255, 255, 255, 0.3)",
                      padding: "0.5rem 1rem",
                    }}
                    onClick={() => handleDiaryClick(diary)}
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 font-cafe24">
                        {diary.title || "제목 없음"}
                      </h3>
                      <p className="text-lg text-gray-700 mt-1 font-cafe24">
                        {new Date(diary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-gray-400">➔</span>
                  </li>
                ))}
              </ul>
            )}
            {totalPages > 0 && (
              <div className="flex justify-center mt-12 gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-white bg-opacity-30 text-gray-800 rounded-lg shadow-md hover:bg-opacity-50 transition disabled:opacity-50 font-cafe24"
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
                        : "bg-white bg-opacity-30 text-gray-800 hover:bg-opacity-50"
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
                  className="px-4 py-2 bg-white bg-opacity-30 text-gray-800 rounded-lg shadow-md hover:bg-opacity-50 transition disabled:opacity-50 font-cafe24"
                  style={{ animation: "pulseGlow2 3s infinite" }}
                >
                  »
                </button>
              </div>
            )}
          </div>

          {/* 우측: 선택된 일기 미리보기와 업로드 버튼 */}
          <div className="w-2/3 flex flex-col items-center">
            {selectedDiary ? (
              <>
                <div
                  className="rounded-xl shadow-2xl shadow-indigo-500/50 flex justify-center items-center w-full h-[800px] bg-white bg-opacity-30"
                  style={{ animation: "pulseGlow2 3s infinite" }}
                >
                  <FabricCanvasViewer
                    diary={selectedDiary}
                    debugId={selectedDiary.diaryId}
                    size={600}
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleUpload}
                    className="px-4 py-2 rounded-lg text-white transition text-base hover:border-transparent hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98] border"
                    style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }}
                  >
                    업로드
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-700 text-xl font-cafe24 mt-20">
                공유할 일기를 선택해주세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPost;
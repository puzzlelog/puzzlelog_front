import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import FabricCanvasViewer from "./FabricCanvasViewer";

const DiaryBox = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDiaryList = async () => {
      try {
        const response = await axios.get(`https://api.puzzlelog.me/diaries?userId=${userId}`, {
          withCredentials: true,
        });

        console.log("📦 Diary API 응답:", response.data.data.diaries);


        const diaries = Array.isArray(response.data.data?.diaries) ? response.data.data.diaries : [];
        setDiaryEntries(diaries);
      } catch (error) {
        console.error("일기 목록 불러오기 실패:", error);
        setDiaryEntries([]);
      }
    };

    if (userId) fetchDiaryList();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header />
      <main className="mt-10 w-full max-w-4xl">
        <h2 className="text-4xl font-semibold text-center text-[#6B4F35] mb-6">일기 모음집</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diaryEntries.length > 0 ? (
            diaryEntries.map((entry, index) => {
              

              console.log(`📖 Diary elements 확인 (diaryId: ${entry.diaryId})`, entry.elements);

              return (
                <div key={index} className="p-4 bg-[#EADDC5] rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold mb-2">{entry.title || "제목 없음"}</h3>
                  <p className="text-gray-700">작성일: {new Date(entry.createdAt).toLocaleDateString()}</p>
                  <FabricCanvasViewer diaryId={entry.diaryId} />
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">저장된 일기가 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DiaryBox;

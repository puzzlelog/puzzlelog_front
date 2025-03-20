import React, { useState, useEffect } from "react";
import Header from "../components/Header";

const DiaryBox = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);

  useEffect(() => {
    // 로컬 스토리지 또는 API에서 다이어리 데이터 가져오기
    const storedEntries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    setDiaryEntries(storedEntries);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header />
      <main className="mt-10 w-full max-w-4xl">
        <h2 className="text-4xl font-semibold text-center text-[#6B4F35] mb-6">일기 모음집</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diaryEntries.length > 0 ? (
            diaryEntries.map((entry, index) => (
              <div key={index} className="p-4 bg-[#EADDC5] rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold">{entry.date}</h3>
                <p className="text-gray-700 mt-2">{entry.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">저장된 일기가 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DiaryBox;

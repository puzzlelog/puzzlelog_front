import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const CollaborativeDiary = () => {
  const { diaryId } = useParams();
  const [diary, setDiary] = useState(null);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  // 서버에서 일기 정보를 받아오는 함수
  const fetchDiary = async () => {
    try {
      const res = await axios.get(`https://api.puzzlelog.me/diaries/${diaryId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      setDiary(res.data.data);
    } catch (err) {
      console.error("일기 불러오기 실패:", err);
      setError(
        "일기 정보를 불러오는 데 실패했습니다: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  useEffect(() => {
    if (diaryId && accessToken) {
      fetchDiary();
    } else {
      setError("로그인이 필요합니다.");
    }

    // 폴링: 5초 간격으로 최신 일기 상태를 불러옵니다.
    const intervalId = setInterval(() => {
      if (diaryId && accessToken) {
        fetchDiary();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [diaryId, accessToken]);

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col">
      <Header />
      <div className="flex flex-col items-center p-10">
        <h2 className="text-2xl font-bold mb-4">🧩 협업 일기 보기</h2>
        {error && <p className="text-red-500">{error}</p>}
        {!diary ? (
          <p className="text-gray-600">일기를 불러오는 중...</p>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow w-full max-w-3xl">
            <h3 className="text-xl font-semibold mb-2">{diary.title}</h3>
            <p className="text-sm text-gray-500 mb-4">
              날짜:{" "}
              {diary.openAt
                ? new Date(diary.openAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "미정"}{" "}
              | 참여자: {diary.participants?.join(", ")}
            </p>
            <div className="space-y-3">
              {diary.elements.map((el, idx) => (
                <div key={idx} className="border rounded p-3 bg-gray-50">
                  <p>
                    <strong>타입:</strong> {el.elementType}
                  </p>
                  <p>
                    <strong>Content ID:</strong> {el.contentId}
                  </p>
                  <p>
                    <strong>위치:</strong> {el.position?.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeDiary;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Header from "./Header";
import PuzzlePiece from '../assets/PuzzlePiece.svg'; // PuzzlePiece.svg 파일 import

// 애니메이션 스타일
const auroraStyle = `
@keyframes aurora {
  0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
  50% { transform: translateX(100%) rotate(10deg); opacity: 0.5; }
  100% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
}

@keyframes pulseGlow2 {
  0% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8); }
  100% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
}

.puzzle-mask {
  -webkit-mask-image: url(${PuzzlePiece});
  mask-image: url(${PuzzlePiece});
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
`;

function CollaborativeDiarySelectPieces() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 다중 친구 ID 받기
  const { date, friendIds } = location.state || {};

  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [pieces, setPieces] = useState([]);
  const [filteredPieces, setFilteredPieces] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const userIds = [userId, ...(friendIds || [])]; // ✅ 나 + 친구들
        console.log("🟢 API 호출 - 날짜:", date, "유저 IDs:", userIds);

        const res = await axios.get("https://api.puzzlelog.me/pieces", {
          params: {
            date,
            userIds: userIds.join(","),
          },
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        const data = res.data.data;
        const piecesArray = Array.isArray(data) ? data : data.pieces || [];
        console.log("🟢 불러온 조각:", piecesArray);
        setPieces(piecesArray);
      } catch (err) {
        console.error("조각 불러오기 실패:", err);
        setError("조각을 불러오는 데 실패했습니다.");
      }
    };

    if (date && friendIds && userId && accessToken) {
      fetchPieces();
    } else {
      setError("필수 정보가 누락되었습니다. (날짜, 친구 ID, 사용자 ID, 토큰)");
    }
  }, [date, friendIds, userId, accessToken]);

  useEffect(() => {
    if (!date || !pieces.length) {
      setFilteredPieces([]);
      return;
    }

    const selectedDate = new Date(date).toISOString().split("T")[0];
    const filtered = pieces.filter((piece) => {
      const pieceDate = new Date(piece.createdAt).toISOString().split("T")[0];
      return pieceDate === selectedDate;
    });

    setFilteredPieces(filtered);
  }, [pieces, date]);

  const handleTogglePiece = (piece) => {
    setSelectedPieces((prev) => {
      const exists = prev.find((p) => p.id === piece.id);
      if (exists) {
        return prev.filter((p) => p.id !== piece.id);
      } else {
        if (prev.length >= 10) {
          alert("최대 10개까지 선택 가능합니다.");
          return prev;
        }
        return [...prev, piece];
      }
    });
  };

  const handleNext = () => {
    if (selectedPieces.length === 0) {
      alert("최소 1개 이상의 조각을 선택해주세요!");
      return;
    }
    navigate("/collaborative-create-diary", {
      state: {
        date,
        friendIds, // ✅ friendIds 배열 그대로 넘김
        selectedPieces,
      },
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] flex flex-col">
      <style>{auroraStyle}</style>
      <Header />

      <main className="flex flex-col items-center mt-10 px-6 pt-24">
        <h1 className="text-3xl font-semibold mb-6 text-center text-white">조각 선택</h1>
        {error && <p className="text-red-500">{error}</p>}

        <div className="text-white mb-4">
          <p>날짜: {date}</p>
          <p>친구 ID: {(friendIds || []).join(', ')}</p>
        </div>

        <div className="w-full max-w-7xl p-6 rounded-lg h-[600px] overflow-y-auto">
          {filteredPieces.length === 0 ? (
            <p className="text-gray-600 text-center">
              {date}에 나와 친구가 생성한 조각이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-5 gap-6 justify-items-center">
              {filteredPieces.map((piece) => {
                const isSelected = selectedPieces.some((p) => p.id === piece.id);
                return (
                  <div
                    key={piece.id}
                    onClick={() => handleTogglePiece(piece)}
                    className={`cursor-pointer flex flex-col items-center w-56 h-80 justify-between p-3
                      ${isSelected ? "border-4 border-[#D6B896]" : ""}`}
                    style={{
                      animation: "pulseGlow2 3s infinite",
                      background: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <h3 className="font-semibold text-base mb-2">{piece.type}</h3>

                    <div className="puzzle-mask flex flex-col items-center justify-center w-[200px] h-[245px]">
                      {piece.type === "TEXT" && (
                        <p className="text-gray-600 text-base text-center overflow-hidden w-[220px] h-20 flex items-center justify-center line-clamp-3">
                          {piece.text?.trim() ? piece.text : "내용 없음"}
                        </p>
                      )}
                      {piece.type === "IMAGE" && piece.mediaId && (
                        <img
                          src={piece.mediaId}
                          alt="조각 이미지"
                          className="w-[220px] h-[190px] object-contain"
                        />
                      )}
                      {piece.type === "VIDEO" && piece.mediaId && (
                        <video controls className="w-[220px] h-[220px] object-cover">
                          <source src={piece.mediaId} type="video/mp4" />
                          브라우저가 비디오 태그를 지원하지 않습니다.
                        </video>
                      )}
                      {piece.type === "AUDIO" && piece.mediaId && (
                        <div className="w-[220px] h-[190px] flex items-center justify-center bg-gray-200 rounded-full">
                          <span>🎵</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto w-full flex flex-col items-center gap-1">
                      {piece.tags && piece.tags.length > 0 && (
                        <p className="text-sm text-blue-500 text-center line-clamp-1">
                          태그: {piece.tags.join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 text-center">
                        {new Date(piece.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 text-center">
                        작성자: {piece.userId === userId ? "나" : "친구"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          className="mt-8 px-6 py-2 bg-[#D6B896] text-white rounded-lg shadow-md hover:bg-[#C6A87D]"
        >
          다음
        </button>
      </main>
    </div>
  );
}

export default CollaborativeDiarySelectPieces;

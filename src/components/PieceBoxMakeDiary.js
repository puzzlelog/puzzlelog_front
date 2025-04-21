  import React, { useState, useEffect } from 'react';
  import { useNavigate, useLocation } from 'react-router-dom';
  import axios from "axios";
  import Header from "./Header";
  

  // 빛나는 애니메이션 스타일 추가
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

  // 퍼즐 모양 마스크 스타일
  .puzzle-mask {
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M50 0 C75 0 100 25 100 50 C120 50 130 70 130 90 C130 110 120 130 100 130 C100 155 75 180 50 180 C25 180 0 155 0 130 C-20 130 -30 110 -30 90 C-30 70 -20 50 0 50 C0 25 25 0 50 0 Z" fill="black"/></svg>');
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M50 0 C75 0 100 25 100 50 C120 50 130 70 130 90 C130 110 120 130 100 130 C100 155 75 180 50 180 C25 180 0 155 0 130 C-20 130 -30 110 -30 90 C-30 70 -20 50 0 50 C0 25 25 0 50 0 Z" fill="black"/></svg>');
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }
  `;

  function PieceBox() {
    const navigate = useNavigate();
    const location = useLocation();

    const [pieces, setPieces] = useState([]);
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [openAt, setOpenAt] = useState('');
    const [filterDate, setFilterDate] = useState(''); // 날짜 필터 상태 추가

    const isTimeCapsule = location.state?.isTimeCapsule || false;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // 조각 불러오기 API 호출
    const fetchPieces = async () => {
      try {
        const response = await axios.get(`https://api.puzzlelog.me/pieces?userId=${userId}&token=${token}`, {
          withCredentials: true
        });
        setPieces(Array.isArray(response.data.data) ? response.data.data : response.data.data.pieces || []);
      } catch (error) {
        console.error("조각 불러오기 실패:", error);
      }
    };

    // 페이지가 처음 열릴 때 조각 불러오기
    useEffect(() => {
      fetchPieces();
    }, [userId]);

    // 조각이 선택되었는지 확인
    const isPieceSelected = (pieceId) => selectedPieces.some(p => p.id === pieceId);

    // 조각 선택/해제 토글
    const selectPiece = (piece) => {
      setSelectedPieces((prev) => {
        const isSelected = prev.some((p) => p.id.toString() === piece.id.toString());
        console.log(`🟢 ${piece._id} 선택되어 있음?:`, isSelected);

        if (isSelected) {
          return prev.filter((p) => p.id.toString() !== piece.id.toString());
        } else {
          if (prev.length >= 10) {
            alert("최대 10개까지 선택 가능합니다.");
            return prev;
          }
          const updated = [...prev, piece];
          console.log(`✅ 선택 추가됨: ${piece._id}`);
          console.log("✅ 선택 추가 후:", updated.map(p => p._id));
          return updated;
        }
      });
    };

    // 일기 작성 페이지로 이동
    const navigateToDiary = () => {
      if (selectedPieces.length === 0) {
        alert("최소 1개의 조각을 선택해주세요!");
        return;
      }


      if (isTimeCapsule && !openAt) {
        alert("오픈할 날짜를 선택해주세요!");
        return;
      }


      navigate('/makeDiary', { state: { selectedPieces, isTimeCapsule, openAt } });
    };
    
    // 날짜 필터링된 조각 리스트
    const filteredPieces = pieces.filter(piece => {
      if (!filterDate) return true; // 날짜 필터가 없으면 모든 조각 표시
      const pieceDate = new Date(piece.createdAt).toISOString().split("T")[0];
      return pieceDate === filterDate;
    });

    return (
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300 flex flex-col">
        {/* 애니메이션 스타일 적용 */}
        <style>{auroraStyle}</style>

        <Header />

        <main className="flex flex-col items-center mt-10 px-6 pt-24">
          <h1 className="text-3xl font-semibold mb-6 text-[#6B4F35]">조각 선택</h1>

          {/* 날짜 필터링 UI 추가 */}
          <div className="flex gap-4 justify-center items-center mb-6">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7430B7]"
            />
            <button
              onClick={() => setFilterDate('')}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              날짜 필터 초기화
            </button>
          </div>

          {/* 조각 리스트 */}
          <div className="w-full max-w-7xl p-6 rounded-lg h-[600px] overflow-y-auto">
            {filteredPieces.length === 0 ? (
              <p className="text-gray-600 text-center">해당 날짜에 생성된 조각이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-5 gap-6 justify-items-center">
                {filteredPieces.map((piece) => (
                  <div
                    key={piece.id}
                    onClick={() => selectPiece(piece)}
                    className={`cursor-pointer flex flex-col items-center w-56 h-80 justify-between p-3
                      ${isPieceSelected(piece.id) ? "border-4 border-[#D6B896]" : ""}`}
                    style={{
                      animation: "pulseGlow2 3s infinite",
                      background: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {/* 조각 타입 라벨 */}
                    <h3 className="font-semibold text-center text-base mb-2">{piece.type}</h3>

                    {/* 퍼즐 모양 마스크 적용 */}
                    <div className="puzzle-mask flex flex-col items-center justify-center w-[200px] h-[245px]">
                      {piece.type === "TEXT" && (
                        <p className="text-gray-600 text-base text-center overflow-hidden w-[220px] h-20 flex items-center justify-center line-clamp-3 bg-transparent">
                          {piece.text?.trim() ? piece.text : "내용 없음"}
                        </p>
                      )}
                      {piece.type === "IMAGE" && piece.mediaId && (
                        <img
                          src={piece.mediaId}
                          alt="조각 이미지"
                          className="w-[220px] h-[190px] object-contain bg-transparent"
                        />
                      )}
                      {piece.type === "VIDEO" && piece.mediaId && (
                        <video controls className="w-[220px] h-[220px] object-cover bg-transparent">
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

                    {/* 태그와 날짜 표시 */}
                    <div className="mt-auto w-full flex flex-col items-center gap-1">
                      {piece.tags && piece.tags.length > 0 && (
                        <p className="text-sm text-blue-500 text-center line-clamp-1 leading-none">
                          태그: {piece.tags.join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 text-center leading-none">
                        {new Date(piece.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 타임캡슐 날짜 선택 */}
          {isTimeCapsule && (
            <input
              type="datetime-local"
              value={openAt}
              onChange={(e) => setOpenAt(e.target.value)}
              className="mt-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          )}

          {/* 다음 버튼 */}
          <button
            onClick={navigateToDiary}
            className="mt-8 px-6 py-2 bg-[#D6B896] text-white rounded-lg shadow-md hover:bg-[#C6A87D]"
          >
            다음
          </button>
        </main>
      </div>
    );
  }

  export default PieceBox;
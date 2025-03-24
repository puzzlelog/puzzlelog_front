import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Header from "./Header";

function PieceBox() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pieces, setPieces] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [openDate, setOpenDate] = useState('');
  const [loading, setLoading] = useState(false);

  const isTimeCapsule = location.state?.isTimeCapsule || false;

  const userId = localStorage.getItem("userId"); // ✅ 로그인한 사용자 ID 가져오기

  // ✅ API 호출 함수 (조각 불러오기)
  const fetchPieces = async () => {
    try {
      const response = await axios.get("http://api.puzzlelog.me/pieces", {
        withCredentials: true
      });

      setPieces(Array.isArray(response.data.data) ? response.data.data : response.data.data.pieces || []);

    } catch (error) {
      console.error("조각 불러오기 실패:", error);
    }
  };


  // 페이지가 처음 열릴 때 API 자동 호출
  useEffect(() => {
    fetchPieces();
  }, [userId]);




  //조각이 선택되어 있는지 확인하는 함수
  const isPieceSelected = (pieceId) => {
    const selected = selectedPieces.some(p => p.id === pieceId);
    console.log(`🔍 ${pieceId} 선택 여부 확인 →`, selected);
    return selected;
  };




  // ✅ 조각 선택 기능 (중복 선택, 취소 가능하게)
  // const selectPiece = (piece) => {
  //   console.log("🟢 클릭된 piece:", piece)

  //   setSelectedPieces(prev => {
  //     console.log("🟢 기존 selectedPieces(prev):", prev);

  //     const isAlreadySelected = prev.some((p) => p && p._id && p._id.toString() === piece._id.toString());

  //     let updatedPieces;

  //     if (isAlreadySelected) {
  //       console.log("❌ 이미 선택됨 → 선택 해제");
  //       updatedPieces = prev.filter(p => p && p._id && p._id.toString() !== piece._id.toString());
  //     } else {
  //       if (prev.length < 10) {
  //         console.log("✅ 새로 선택 추가");
  //         updatedPieces = [...prev, piece];
  //       } else {
  //         alert("최대 10개까지 선택 가능합니다.");
  //         return prev;
  //       }
  //     }

  //     console.log("🟢 업데이트된 선택 목록:", updatedPieces);
  //     return updatedPieces;
  //   });
  // };


 
  
  // ✅ 조각 선택/해제 토글
  const selectPiece = (piece) => {
    console.log("🟢 클릭된 piece:", piece._id);
    console.log("현재 selectedPieces:", selectedPieces.map(p => p._id));
    
    setSelectedPieces((prev) => {
      const isSelected = prev.some((p) => p.id === piece.id.toString());
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
  
  



  const navigateToDiary = () => {
    if (selectedPieces.length === 0) {
      alert("최소 1개의 조각을 선택해주세요!");
      return;
    }
    navigate('/makeDiary', { state: { selectedPieces, isTimeCapsule, openDate } });
  };



  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col">
      <Header />


      <main className="flex flex-col items-center mt-10 px-6 pt-24">
        <h1 className="text-3xl font-semibold mb-6">조각 모음집</h1>


        {/* ✅ 조각 리스트 */}
        <div className="w-full max-w-4xl bg-[#FAF0E6] p-6 rounded-lg shadow-md h-[600px] overflow-y-auto">
          <div className="grid grid-cols-3 gap-6 justify-items-center">
            {pieces.length === 0 ? (
              <p className="text-gray-600 text-center">오늘 생성된 조각이 없습니다.</p>
            ) : (
              pieces.map((piece) => (
                <div
                  key={piece.id}
                  onClick={() => selectPiece(piece)}
                  className={`cursor-pointer w-[150px] h-[200px] p-4 mb-3 bg-white rounded-lg shadow-md flex items-center justify-center 
                    ${isPieceSelected(piece.id) ? "border-4 border-[#D6B896]" : ""}`}
                >
                  {piece.type === "IMAGE" && <img src={piece.mediaId} alt="이미지 조각" className="w-full rounded-md" />}
                  {piece.type === "AUDIO" && <audio controls src={piece.mediaId} className="w-full" />}
                  {piece.type === "VIDEO" && <video controls src={piece.mediaId} className="w-full rounded-md" />}
                  {piece.type === "TEXT" && (
                    <div className="text-gray-700 break-words whitespace-normal text-center max-h-[150px] overflow-y-auto">
                      {piece.content}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>


        {/* ✅ 타임캡슐 날짜 선택 */}
        {isTimeCapsule && (
          <input
            type="date"
            value={openDate}
            onChange={(e) => setOpenDate(e.target.value)}
            className="mt-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          />
        )}

        {/* ✅ 다음 버튼 */}
        <button
          onClick={navigateToDiary}
          className="mt-8 px-6 py-2 bg-[#D6B896] text-white rounded-lg shadow-md hover:bg-[#C6A87D]"
        >
          다음
        </button>
      </main>
    </div>
  );
};

export default PieceBox;

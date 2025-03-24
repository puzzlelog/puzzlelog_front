import React, { useEffect, useState } from "react";
import Header from "./Header";

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

const PieceBox = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filterType, setFilterType] = useState("ALL"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    setUserId(storedUserId);

    const fetchPieces = async () => {
      try {
        const response = await fetch(
          `http://api.puzzlelog.me/pieces?userId=${storedUserId}&isDeleted=false&page=0&size=100`
        ); 
        if (!response.ok) {
          throw new Error("서버 연결 실패");
        }
        const data = await response.json();

        if (data.success) {
          const filteredPieces = data.data.pieces.filter(piece => !piece.isDeleted);
          setPieces(filteredPieces);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPieces();
  }, []);

  const handleDelete = async (pieceId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`http://api.puzzlelog.me/pieces/${pieceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제 실패");
      }

      const data = await response.json();
      if (data.success) {
        setPieces(prevPieces => prevPieces.filter(piece => piece.id !== pieceId));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert(`삭제 실패: ${err.message}`);
    }
  };

  //  필터에 따라 조각 리스트 필터링
  const filteredPieces = filterType === "ALL" ? pieces : pieces.filter(piece => piece.type === filterType);

  //  페이지네이션 적용 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedPieces = filteredPieces.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPieces.length / itemsPerPage);

  if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
  if (error) return <p className="text-center text-red-500">오류 발생: {error}</p>;

  return (
    <>
    <style>{auroraStyle}</style>
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
        <Header />

        <main className="mt-44 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
        <div className="text-center">
        <h2 className="text-3xl font-semibold text-center text-[#6B4F35] mb-6">조각 모음집</h2>
        
          {/* 필터 버튼 */}
          <div className="sticky top-0 z-10 py-4 my-4">
            <div className="flex gap-4 justify-center">
              {["ALL", "TEXT", "IMAGE", "VIDEO", "AUDIO"].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type);
                    setCurrentPage(1); // 🔹 필터 버튼 누르면 첫페이지이동하는거
                  }}
                  className={`px-4 py-2 opacity-60 transition hover:border-transparent border hover:scale-105 rounded-md 
                    ${filterType === type ? "bg-[#7430B7] text-white" : "bg-gray-200"}`}
                >
                  {type === "ALL" ? "전체 보기" : type}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-lg w-full max-w-6xl">
            {paginatedPieces.length === 0 ? (
              <div className="grid grid-cols-4 gap-6">
                <p className="text-center text-gray-500">조각이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {paginatedPieces.map((piece) => (
                  <div 
                    key={piece.id} 
                    className="border p-4 rounded-lg shadow-sm flex flex-col items-center w-56 h-80 bg-gray-100 justify-between"
                    style={{
                      animation: "pulseGlow2 3s infinite",
                      background: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <h3 className="font-semibold text-center text-base">{piece.type}</h3>

                    <div className="flex flex-col items-center justify-center flex-grow w-full">
                      {piece.type === "TEXT" && (
                        <p className="text-gray-600 text-sm text-center overflow-hidden w-full h-20 flex items-center justify-center">
                          {piece.content}
                        </p>
                      )}

                      {piece.type === "IMAGE" && piece.mediaId && (
                        <img src={piece.mediaId} alt="조각 이미지" className="w-32 h-32 object-contain rounded bg-white" />
                      )}

                      {piece.type === "VIDEO" && piece.mediaId && (
                        <video controls className="w-32 h-32 object-cover rounded">
                          <source src={piece.mediaId} type="video/mp4" />
                          브라우저가 비디오 태그를 지원하지 않습니다.
                        </video>
                      )}

                      {piece.type === "AUDIO" && piece.mediaId && (
                        <div className="w-full flex justify-center">
                          <audio controls className="w-48">
                            <source src={piece.mediaId} type="audio/mpeg" />
                            브라우저가 오디오 태그를 지원하지 않습니다.
                          </audio>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto w-full flex flex-col items-center gap-1">
                      {piece.tags && piece.tags.length > 0 && (
                        <p className="text-sm text-blue-500 text-center">태그: {piece.tags.join(", ")}</p>
                      )}
                      <p className="text-xs text-gray-400 text-center">{new Date(piece.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="w-full flex justify-center mt-2">
                      <button
                        onClick={() => handleDelete(piece.id)}
                        className="px-3 py-1.5 bg-red-300 text-red-800 rounded hover:bg-red-400 w-10/12"
                      >
                        삭제
                      </button>
                    </div>
                  </div>       
                ))}
              </div>
            )}

            {/* 페이지네이션  */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 bg-[#EDE7DC] text-[#6B4F35] rounded-lg hover:bg-[#D6C8B8] disabled:bg-gray-300"
                >
                  이전
                </button>
                <span className="text-lg font-semibold text-[#6B4F35]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 bg-[#EDE7DC] text-[#6B4F35] rounded-lg hover:bg-[#D6C8B8] disabled:bg-gray-300"
                >
                  다음
                </button>
              </div>
            )}
          </div>


        </div>
        </main>
      </div>
    </>
  );
};

export default PieceBox;

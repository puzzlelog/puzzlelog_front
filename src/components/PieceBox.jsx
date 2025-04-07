import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";

<<<<<<< HEAD
=======

>>>>>>> b504c1f (subscription)
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
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const audioRefs = useRef({});

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
        const token = localStorage.getItem("accessToken");
  
        const response = await fetch(
<<<<<<< HEAD
           `https://api.puzzlelog.me/pieces?userId=${storedUserId}&deleted=false&page=0&size=100`,
          //`http://localhost:8080/pieces?userId=${storedUserId}&deleted=false&page=0&size=100`,
=======
          `https://api.puzzlelog.me/pieces?userId=${storedUserId}&deleted=false&page=0&size=100`,
>>>>>>> b504c1f (subscription)
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("서버 연결 실패");
        }
  
        const data = await response.json();
  
        if (data.success) {
          const filteredPieces = data.data.pieces.filter(piece => !piece.deleted);
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
<<<<<<< HEAD
=======
  
>>>>>>> b504c1f (subscription)

  const handleDelete = async (pieceId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `https://api.puzzlelog.me/pieces/${pieceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("삭제 실패");
      }

      const data = await response.json();
      if (data.success) {
        setPieces(prev => prev.filter(p => p.id !== pieceId));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert(`삭제 실패: ${err.message}`);
    }
  };

  const handleAudioPlay = (pieceId) => {
    Object.keys(audioRefs.current).forEach((id) => {
      if (id !== pieceId.toString()) {
        audioRefs.current[id].pause();
        audioRefs.current[id].currentTime = 0;
      }
    });

    const audio = audioRefs.current[pieceId];
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const filteredPieces = pieces
    .filter(piece => filterType === "ALL" || piece.type === filterType)
    .filter(piece => {
      if (!filterDate) return true;
      const pieceDate = new Date(piece.createdAt).toISOString().split("T")[0];
      return pieceDate === filterDate;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedPieces = filteredPieces.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPieces.length / itemsPerPage);

<<<<<<< HEAD
  if (loading) return <p className="text-center text-white">로딩 중...</p>;
=======
  if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
>>>>>>> b504c1f (subscription)
  if (error) return <p className="text-center text-red-500">오류 발생: {error}</p>;

  return (
    <>
      <style>{auroraStyle}</style>
<<<<<<< HEAD
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
        <Header />
        <main className="mt-28 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-center text-white">조각 모음집</h2>
=======
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">
        <Header />
        <main className="mt-28 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-center text-[#6B4F35]">조각 모음집</h2>
>>>>>>> b504c1f (subscription)

            <div className="sticky top-0 z-10 py-4">
              <div className="flex gap-4 justify-center items-center">
                {["ALL", "TEXT", "IMAGE", "VIDEO", "AUDIO"].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 opacity-60 transition hover:border-transparent border hover:scale-105 rounded-md 
<<<<<<< HEAD
                      ${filterType === type ? "bg-[#7430B7] text-white" : "bg-white/20 text-white hover:bg-white/30"}`}
=======
                      ${filterType === type ? "bg-[#7430B7] text-white" : "bg-gray-200"}`}
>>>>>>> b504c1f (subscription)
                  >
                    {type === "ALL" ? "전체 보기" : type}
                  </button>
                ))}
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1);
                  }}
<<<<<<< HEAD
                  className="px-4 py-2 rounded-md border border-white text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-[#7430B7]"
=======
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7430B7]"
>>>>>>> b504c1f (subscription)
                />
                <button
                  onClick={() => {
                    setFilterDate("");
                    setCurrentPage(1);
                  }}
<<<<<<< HEAD
                  className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30"
=======
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
>>>>>>> b504c1f (subscription)
                >
                  날짜 필터 초기화
                </button>
              </div>
            </div>

            <div className="rounded-lg w-full max-w-7xl">
              {paginatedPieces.length === 0 ? (
<<<<<<< HEAD
                <div className="text-center text-white">조각이 없습니다.</div>
=======
                <div className="text-center text-gray-500">조각이 없습니다.</div>
>>>>>>> b504c1f (subscription)
              ) : (
                <div className="grid grid-cols-5 gap-6">
                  {paginatedPieces.map(piece => (
                    <div
                      key={piece.id}
                      className="flex flex-col items-center w-56 h-80 justify-between p-3"
                      style={{
                        animation: "pulseGlow2 3s infinite",
                        background: "rgba(255, 255, 255, 0.3)",
                      }}
                    >
<<<<<<< HEAD
                      <h3 className="font-semibold text-center text-base text-white mb-2">{piece.type}</h3>

                      <div className="puzzle-mask flex items-center justify-center w-[200px] h-[200px] overflow-hidden">
  {piece.type === "TEXT" && (
    <p className="text-white text-base text-center overflow-hidden w-full h-full flex items-center justify-center line-clamp-3">
      {piece.text}
    </p>
  )}
  {piece.type === "IMAGE" && piece.mediaId && (
    <img
      src={piece.mediaId}
      alt="조각 이미지"
      className="w-full h-full object-cover rounded-md"
    />
  )}
  {piece.type === "VIDEO" && piece.mediaId && (
    <video controls className="w-full h-full object-cover rounded-md">
      <source src={piece.mediaId} type="video/mp4" />
      브라우저가 비디오 태그를 지원하지 않습니다.
    </video>
  )}
  {piece.type === "AUDIO" && piece.mediaId && (
    <>
      <audio
        ref={(el) => (audioRefs.current[piece.id] = el)}
        src={piece.mediaId}
        className="hidden"
      />
      <button
        onClick={() => handleAudioPlay(piece.id)}
        className="w-full h-full flex items-center justify-center bg-white/30 text-white rounded-full hover:bg-white/40 text-3xl"
      >
        🎵
      </button>
    </>
  )}
</div>

                      <div className="mt-auto w-full flex flex-col items-center gap-1">
                        {piece.tags && piece.tags.length > 0 && (
                          <p className="text-sm text-blue-300 text-center line-clamp-1 leading-none">
                            태그: {piece.tags.join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-white text-center leading-none">
=======
                      <h3 className="font-semibold text-center text-base mb-2">{piece.type}</h3>

                      <div className="puzzle-mask flex flex-col items-center justify-center w-[200px] h-[245px]">
                        {piece.type === "TEXT" && (
                          <p className="text-gray-600 text-base text-center overflow-hidden w-[220px] h-20 flex items-center justify-center line-clamp-3 bg-transparent">
                            {piece.text}
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
                          <>
                            <audio
                              ref={el => (audioRefs.current[piece.id] = el)}
                              src={piece.mediaId}
                              className="hidden"
                            />
                            <button
                              onClick={() => handleAudioPlay(piece.id)}
                              className="w-[220px] h-[190px] flex items-center justify-center bg-gray-200 rounded-full"
                            >
                              🎵
                            </button>
                          </>
                        )}
                      </div>

                      <div className="mt-auto w-full flex flex-col items-center gap-1">
                        {piece.tags && piece.tags.length > 0 && (
                          <p className="text-sm text-blue-500 text-center line-clamp-1 leading-none">
                            태그: {piece.tags.join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 text-center leading-none">
>>>>>>> b504c1f (subscription)
                          {new Date(piece.createdAt).toLocaleDateString()}
                        </p>
                        <div className="w-full flex justify-center mt-2">
                          <button
                            onClick={() => handleDelete(piece.id)}
<<<<<<< HEAD
                            className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 w-10/12"
=======
                            className="px-3 py-1.5 bg-red-300 text-red-800 rounded hover:bg-red-400 w-10/12"
>>>>>>> b504c1f (subscription)
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
<<<<<<< HEAD
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:bg-gray-500"
                  >
                    이전
                  </button>
                  <span className="text-lg font-semibold text-white">
=======
                    className="px-4 py-2 bg-[#EDE7DC] text-[#6B4F35] rounded-lg hover:bg-[#D6C8B8] disabled:bg-gray-300"
                  >
                    이전
                  </button>
                  <span className="text-lg font-semibold text-[#6B4F35]">
>>>>>>> b504c1f (subscription)
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
<<<<<<< HEAD
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:bg-gray-500"
=======
                    className="px-4 py-2 bg-[#EDE7DC] text-[#6B4F35] rounded-lg hover:bg-[#D6C8B8] disabled:bg-gray-300"
>>>>>>> b504c1f (subscription)
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

<<<<<<< HEAD
export default PieceBox;
=======
export default PieceBox;
>>>>>>> b504c1f (subscription)

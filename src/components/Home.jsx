import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
    opacity: 0.7;
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
    transform: scale(1);
    opacity: 0.7;
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

.puzzle-mask {
  background: rgba(255, 255, 255, 0.3);
  clip-path: polygon(
    0% 0%,
    85% 0%,
    100% 15%,
    100% 85%,
    85% 100%,
    15% 100%,
    0% 85%,
    0% 15%
  );
}
`;

const Home = () => {
  const navigate = useNavigate();
  const [showNicknamePopup, setShowNicknamePopup] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRefs = useRef({});

  useEffect(() => {
    const checkNickname = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`https://api.puzzlelog.me/users?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.success) {
          const userData = response.data?.data?.users?.[0] || {};
          if (!userData.nickname) {
            setShowNicknamePopup(true);
          }
        }
      } catch (error) {
        console.error("닉네임 확인 중 오류 발생:", error);
      }
    };

    const fetchPieces = async () => {
      const storedUserId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!storedUserId || !token) {
        console.log("🔍 userId 또는 token이 없음. 빈 조각으로 설정.");
        setPieces([]);
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 fetchPieces 시작");
        const response = await fetch(
          `https://api.puzzlelog.me/pieces?userId=${storedUserId}&deleted=false&page=0&size=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("서버 연결 실패");
        }
        const data = await response.json();
        console.log("🔍 fetchPieces 응답 (MongoDB 데이터):", data);

        if (data.success && data.data.pieces && Array.isArray(data.data.pieces)) {
          const filteredPieces = data.data.pieces.map((piece) => ({
            id: piece.id,
            type: piece.type,
            content: piece.content || "",
            mediaId: piece.mediaId || null,
            size: 224, // PieceBox와 동일한 크기 (w-56 = 224px)
            tags: piece.tags || [],
            createdAt: piece.createdAt || "",
          }));
          setPieces(filteredPieces);
          console.log("🔍 필터링된 조각:", filteredPieces);
        } else {
          console.log("🔍 조각 데이터가 없음. 빈 조각으로 설정.");
          setPieces([]);
        }
      } catch (err) {
        console.log("🔍 fetchPieces 에러 발생:", err.message);
        setError(err.message);
        setPieces([]);
      } finally {
        setLoading(false);
        console.log("🔍 fetchPieces 완료, pieces 상태:", pieces);
      }
    };

    checkNickname();
    fetchPieces();
  }, [navigate]);

  const checkNicknameAvailability = async () => {
    if (!nickname.trim()) {
      setNicknameMessage("닉네임을 입력해주세요.");
      setIsNicknameAvailable(false);
      setIsNicknameChecked(false);
      return;
    }

    setIsCheckingNickname(true);
    try {
      const response = await axios.get(`https://api.puzzlelog.me/users/check?type=nickname&value=${nickname}`);
      if (response.data.success) {
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setIsNicknameAvailable(true);
        setIsNicknameChecked(true);
      } else {
        setNicknameMessage(response.data.message || "닉네임 중복 확인 실패");
        setIsNicknameAvailable(false);
        setIsNicknameChecked(false);
      }
    } catch (error) {
      setNicknameMessage("이미 존재하는 닉네임입니다.");
      setIsNicknameAvailable(false);
      setIsNicknameChecked(false);
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleNicknameSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (!isNicknameChecked || !isNicknameAvailable) {
      alert("닉네임 중복 확인을 완료해주세요.");
      return;
    }

    const data = {
      userId: userId,
      email: `${userId}@example.com`,
      nickname: nickname,
      birthDate: "2000-01-01",
      gender: "MALE",
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

    if (profileImg) {
      formData.append("file", profileImg);
    }

    try {
      const response = await fetch(`https://api.puzzlelog.me/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("🔍 PATCH 응답:", result);

      if (result.success) {
        alert("닉네임 및 프로필 설정 완료!");
        setShowNicknamePopup(false);
        localStorage.setItem("nickname", nickname);
      } else {
        alert("설정 실패: " + (result.message || "알 수 없는 오류"));
      }
    } catch (error) {
      alert("서버 오류로 인해 설정할 수 없습니다.");
    }
  };

  const handleCircleClick = () => {
    setIsExpanded((prev) => !prev);
    console.log("🔍 isExpanded 상태:", !isExpanded);
  };

  const handleAudioPlay = (pieceId, mediaId) => {
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

  if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
  if (error) return <p className="text-center text-red-500">오류 발생: {error}</p>;

  return (
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
        {/* 헤더 추가 */}
        <Header />

        {/* 중앙 콘텐츠 */}
        {!showNicknamePopup && (
          <div className="relative z-10 flex items-center justify-center w-full h-full text-white">
            {/* 퍼지는 퍼즐 조각들 */}
            {Array.isArray(pieces) && pieces.length > 0 ? (
              pieces.map((piece) => (
                <div
                  key={piece.id}
                  className="absolute transition-all duration-700 z-20"
                  style={{
                    width: "224px", // PieceBox와 동일한 크기 (w-56 = 224px)
                    height: "320px", // PieceBox와 동일한 크기 (h-80 = 320px)
                    transform: isExpanded
                      ? `translate(${Math.random() * 800 - 400}px, ${Math.random() * 800 - 400}px)`
                      : `translate(0,0)`, // Increase the random range to 800px (adjust as needed)
                    opacity: isExpanded ? 1 : 0,
                    filter: "drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))",
                    zIndex: 20,
                  }}
                >
                  <div
                className="puzzle-mask flex flex-col items-center justify-between w-full h-full"
                style={{
                  animation: "pulseGlow2 3s infinite",
                  background: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <h3 className="font-semibold text-center text-base leading-none m-0 mb-2">{piece.type}</h3>

                <div className="flex items-center justify-center w-full h-full">
                  {piece.type === "TEXT" && (
                    <p className="text-gray-600 text-base text-center overflow-hidden w-full h-20 flex items-center justify-center line-clamp-3 bg-transparent">
                      {piece.content}
                    </p>
                  )}

                  {piece.type === "IMAGE" && piece.mediaId && (
                    <img
                      src={piece.mediaId}
                      alt="조각 이미지"
                      className="w-full h-full object-contain bg-transparent"
                    />
                  )}

                  {piece.type === "VIDEO" && piece.mediaId && (
                    <video controls className="w-full h-full object-cover bg-transparent">
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
                        onClick={() => handleAudioPlay(piece.id, piece.mediaId)}
                        className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full"
                      >
                        <svg className="w-12 h-12 text-gray-600" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                    {/* 태그와 생성 날짜 표시 */}
                    <div className="mt-auto w-full flex flex-col items-center gap-1">
                      {piece.tags && piece.tags.length > 0 && (
                        <p className="text-sm text-blue-500 text-center line-clamp-1 leading-none m-0">
                          태그: {piece.tags.join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 text-center leading-none m-0">
                        {new Date(piece.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-base">조각이 없습니다.</p>
            )}

            {/* 중앙 원 */}
            <div
              className="w-84 h-84 bg-gradient-to-r rounded-full shadow-2xl shadow-indigo-500/50 flex items-center justify-center text-xl font-semibold cursor-pointer z-10"
              style={{
                width: "22rem",
                height: "22rem",
                animation: "pulseGlow 3s infinite",
                zIndex: 50,
              }}
              onClick={handleCircleClick}
            >
              <span className="text-6xl font-bold animate-pulse mb-4">PuzzleLog</span>
            </div>
          </div>
        )}

{showNicknamePopup && (
          <div className="relative z-10 flex flex-row items-center justify-center w-full h-full text-black">
            <div
              className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center font-semibold"
              style={{
                width: "24rem",
                height: "24rem",
                animation: "pulseGlow2 3s infinite",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>닉네임 설정</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="닉네임 입력"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    style={{
                      padding: "5px",
                      fontSize: "18px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      flex: 1,
                    }}
                  />
                  <button
                    onClick={checkNicknameAvailability}
                    disabled={isCheckingNickname}
                    className="hover:bg-white text-base px-4 py-2 cusor-pointer mt-2 w-full text-black rounded-lg transition-all duration-300 border ease-in-out transform hover:bg-white-100 hover:scale-105"
                  >
                    중복 확인
                  </button>
                </div>
                {nicknameMessage && <p style={{ color: isNicknameAvailable ? "green" : "red" }}>{nicknameMessage}</p>}
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: "10px", cursor: "pointer", padding: "5px", fontSize: "16px", marginLeft: "30px" }} />
                <button
                  onClick={handleNicknameSubmit}
                  className="mt-12 px-6 py-2 border rounded-lg text-base text-white transition hover:border-transparent hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]" style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }}
                  disabled={!isNicknameChecked || !isNicknameAvailable}
                >
                  설정 완료
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
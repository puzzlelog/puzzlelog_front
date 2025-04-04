import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import FabricCanvasEditor from "../components/FabricCanvasEditor";
import "../styles/MakeDiary.css";

function CollaborativeDiaryCreate() {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedPieces = [], date, friendIds } = location.state || {}; // friendId -> friendIds로 변경

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [diaryTitle, setDiaryTitle] = useState("");
  const [error, setError] = useState("");
  const [allStickers, setAllStickers] = useState([]);
  const [emotionStickers, setEmotionStickers] = useState([]);
  const [showEmotionSelector, setShowEmotionSelector] = useState(false);
  const [videoControls, setVideoControls] = useState([]);
  const [audioControls, setAudioControls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragType, setDragType] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get("https://api.puzzlelog.me/assets", { withCredentials: true });
        if (response.data.success && Array.isArray(response.data.data)) {
          setAllStickers(response.data.data);
          const emotionOnly = response.data.data.filter(
            (item) =>
              item.type?.toLowerCase() === "emotion" ||
              item.tags?.some((tag) => tag.toLowerCase() === "emotion")
          );
          setEmotionStickers(emotionOnly);
        }
      } catch (error) {
        console.error("assets 불러오기 실패", error);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    const videoInit = selectedPieces
      .filter((p) => p.type === "VIDEO")
      .map((v, idx) => ({
        id: idx,
        top: 150 + idx * 50,
        left: 300 + idx * 50,
        rotate: 0,
        src: v.mediaId,
        pieceId: v.id,
      }));
    setVideoControls(videoInit);

    const audioInit = selectedPieces
      .filter((p) => p.type === "AUDIO")
      .map((a, idx) => ({
        id: idx,
        top: 400 + idx * 50,
        left: 300,
        rotate: 0,
        src: a.mediaId,
        pieceId: a.id,
      }));
    setAudioControls(audioInit);
  }, [selectedPieces]);

  const handleDragStart = (e, id, type) => {
    setIsDragging(true);
    setDraggedId(id);
    setDragType(type);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const offsetY = e.clientY - containerRect.top;

    if (dragType === "video") {
      setVideoControls((prev) =>
        prev.map((v) =>
          v.id === draggedId ? { ...v, top: offsetY - 100, left: offsetX - 150 } : v
        )
      );
    } else if (dragType === "audio") {
      setAudioControls((prev) =>
        prev.map((a) =>
          a.id === draggedId ? { ...a, top: offsetY - 50, left: offsetX - 75 } : a
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedId(null);
    setDragType(null);
  };

  const handleSendRequest = async (emotionStickerId = null) => {
    try {
      if (!canvasRef.current) {
        setError("캔버스가 초기화되지 않았습니다.");
        return;
      }
      if (!diaryTitle) {
        setError("제목을 입력해주세요.");
        return;
      }
      if (!friendIds || friendIds.length === 0) {
        setError("협업할 친구 정보가 없습니다.");
        return;
      }

      setError("");

      let elements = canvasRef.current.getCanvasElements();
      const backgroundId = canvasRef.current.getBackgroundImageId() || "default-background-id";

      // DATE 요소 처리
      elements = elements.map((el) => {
        if (el.elementType === "DATE") {
          const fallbackDate = date ? date.split("T")[0] : new Date().toISOString().slice(0, 10);
          const extractedDate = el.date || fallbackDate;
          console.log("📅 DATE 요소의 날짜 값:", extractedDate);
          return {
            ...el,
            date: extractedDate,
          };
        }
        return el;
      });

      // 비디오 요소 추가
      videoControls.forEach((video) => {
        elements.push({
          elementType: "VIDEO",
          contentId: video.pieceId,
          position: [video.left, video.top],
          scale: 1.0,
          rotation: video.rotate || 0,
        });
      });

      // 오디오 요소 추가
      audioControls.forEach((audio) => {
        elements.push({
          elementType: "AUDIO",
          contentId: audio.pieceId,
          position: [audio.left, audio.top],
          scale: 1.0,
          rotation: audio.rotate || 0,
        });
      });

      console.log("🟢 생성된 elements:", elements);

      const diaryData = {
        userId,
        title: diaryTitle || "협업 일기",
        backgroundContentId: backgroundId,
        themeColor: "#FFECCC",
        emotionContentId: emotionStickerId,
        isShared: false,
        openAt: date ? date.split("T")[0] : null,
        timeZone: "Asia/Seoul",
        elements,
      };

      console.log("🟢 일기 데이터:", diaryData);

      const diaryRes = await axios.post(
        "https://api.puzzlelog.me/diaries",
        diaryData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const newDiaryId = diaryRes.data.data.diaryId;

      console.log("🟢 초대 요청 본문:", {
        receiverIds: friendIds, // friendId -> friendIds로 변경
        diaryId: newDiaryId,
        diaryDate: date.split("T")[0],
      });

      await axios.post(
        "https://api.puzzlelog.me/invitations",
        {
          receiverIds: friendIds, // friendId -> friendIds로 변경
          diaryId: newDiaryId,
          diaryDate: date.split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      alert("협업 요청이 전송되었습니다.");
      navigate("/home");
    } catch (err) {
      console.error("협업 일기 생성/초대 실패:", err.response?.data || err.message);
      setError(
        "일기 생성 또는 초대 전송에 실패했습니다: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center">
        <div className="flex flex-row justify-end w-full pr-56 mt-32">
          <input
            type="text"
            placeholder="오늘의 제목을 입력하세요"
            value={diaryTitle}
            onChange={(e) => setDiaryTitle(e.target.value)}
            className="border rounded-lg px-4 py-2 text-lg w-[500px] bg-white text-black"
          />
        </div>

        <div className="w-full flex justify-end pr-16">
          <div
            ref={containerRef}
            className="relative w-[800px] h-[500px] mt-8 z-10 border rounded-lg shadow-lg"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <FabricCanvasEditor
              ref={canvasRef}
              selectedPieces={selectedPieces}
              allStickers={allStickers}
            />
            {videoControls.map((video, index) => (
              <div
                key={`video-${index}`}
                className="absolute z-30 media-wrapper"
                style={{
                  top: video.top,
                  left: video.left,
                  transform: `rotate(${video.rotate}deg)`,
                  transformOrigin: "center center",
                  cursor: isDragging && draggedId === video.id ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => handleDragStart(e, video.id, "video")}
                onDragStart={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
              >
                <video
                  src={video.src}
                  controls
                  className="w-[300px] h-[200px]"
                  style={{ pointerEvents: "auto" }}
                />
                <div className="flex justify-center space-x-2 mt-1 media-control-buttons">
                  <button
                    onClick={() =>
                      setVideoControls((prev) =>
                        prev.map((v) =>
                          v.id === video.id ? { ...v, rotate: v.rotate + 15 } : v
                        )
                      )
                    }
                    className="bg-[#D3D3D3] text-gray-800 text-sm px-2 rounded hover:bg-[#C0C0C0]"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() =>
                      setVideoControls((prev) => prev.filter((v) => v.id !== video.id))
                    }
                    className="bg-[#D6B896] text-white text-sm px-2 rounded hover:bg-[#C7A986]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {audioControls.map((audio, index) => (
              <div
                key={`audio-${index}`}
                className="absolute z-30 media-wrapper"
                style={{
                  top: audio.top,
                  left: audio.left,
                  transform: `rotate(${audio.rotate}deg)`,
                  transformOrigin: "center center",
                  cursor: isDragging && draggedId === audio.id ? "grabbing" : "grab",
                  zIndex: 50,
                }}
                onMouseDown={(e) => handleDragStart(e, audio.id, "audio")}
                onDragStart={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
              >
                <audio
                  src={audio.src}
                  controls
                  className="w-[200px]"
                  style={{
                    pointerEvents: isDragging && draggedId === audio.id ? "none" : "auto",
                  }}
                />
                <div className="flex justify-center space-x-2 mt-1 media-control-buttons">
                  <button
                    onClick={() =>
                      setAudioControls((prev) =>
                        prev.map((a) =>
                          a.id === audio.id ? { ...a, rotate: a.rotate + 15 } : a
                        )
                      )
                    }
                    className="bg-[#D3D3D3] text-gray-800 text-sm px-2 rounded hover:bg-[#C0C0C0]"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() =>
                      setAudioControls((prev) => prev.filter((a) => a.id !== audio.id))
                    }
                    className="bg-[#D6B896] text-white text-sm px-2 rounded hover:bg-[#C7A986]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-start space-x-4 mt-40 ml-24 p-8">
          <button
            onClick={() => setShowEmotionSelector(true)}
            className="px-6 py-2 bg-purple-400 text-white rounded-lg shadow-md hover:bg-purple-500"
          >
            요청하기
          </button>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-blue-200 text-blue-800 rounded-lg shadow-md hover:bg-blue-300"
          >
            취소하기
          </button>
        </div>

        {showEmotionSelector && (
          <div className="emotion-selector">
            <h2 className="emotion-title">오늘 당신의 기분은?</h2>
            <div className="stickers flex flex-wrap gap-4">
              {emotionStickers.map((sticker) => (
                <img
                  key={sticker.id}
                  src={sticker.mediaId}
                  alt={sticker.name}
                  className="w-16 h-16 cursor-pointer"
                  onClick={() => handleSendRequest(sticker.id)}
                />
              ))}
            </div>
            <button
              onClick={() => setShowEmotionSelector(false)}
              className="mt-4 px-4 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300"
            >
              닫기
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default CollaborativeDiaryCreate;
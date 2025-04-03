import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import FabricCanvasEditor from "../components/FabricCanvasEditor";
import Header from "./Header";
import "../styles/MakeDiary.css";

const MakeDiary = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const { selectedPieces = [], isTimeCapsule = false, openAt = null } = location.state || {};
  const navigate = useNavigate();
  console.log("MakeDiary로 넘어온 조각:", selectedPieces);
  console.log("타임캡슐 여부:", isTimeCapsule);
  console.log("열릴 날짜(openAt):", openAt);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [videoControls, setVideoControls] = useState([]);
  const [audioControls, setAudioControls] = useState([]);
  const [diaryTitle, setDiaryTitle] = useState("");
  const [emotionStickers, setEmotionStickers] = useState([]);
  const [showEmotionSelector, setShowEmotionSelector] = useState(false);
  const [allStickers, setAllStickers] = useState([]);
  const [videoElements, setVideoElements] = useState([]);
  const [audioElements, setAudioElements] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragType, setDragType] = useState(null);
  const [selectedEmotionSticker, setSelectedEmotionSticker] = useState(null);

  useEffect(() => {
    console.log("🎯 드래그 중 상태:", isDragging);
    console.log("🎯 현재 드래그 중인 ID:", draggedId);
    console.log("🎯 드래그 타입:", dragType);
  }, [isDragging, draggedId, dragType]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get("https://api.puzzlelog.me/assets", { withCredentials: true });
        // const response = await axios.get("http://localhost:8080/assets", { withCredentials: true });
        if (response.data.success && Array.isArray(response.data.data)) {
          setAllStickers(response.data.data);
          const emotionOnly = response.data.data.filter((item) => {
            const typeMatch = item.type?.toLowerCase() === "emotion";
            const tagMatch = item.tags?.some(
              (tag) => tag.toLowerCase() === "emotion"
            );
            return typeMatch || tagMatch;
          });
          setEmotionStickers(emotionOnly);
        }
      } catch (error) {
        console.error("assets 불러오기 실패", error);
      }
    };
    fetchAssets();
  }, []);

  const handleEmotionStickerSelected = async (emotionStickerId) => {
    setSelectedEmotionSticker(emotionStickerId);
    setShowEmotionSelector(false);

    if (canvasRef.current) {
      const backgroundId = canvasRef.current.getBackgroundImageId();
      const token = localStorage.getItem("token") || "guest";
      let elements = [];

      videoControls.forEach(video => {
        elements.push({
          elementType: "VIDEO",
          contentId: video.pieceId,
          position: [video.left, video.top],
          scale: video.scale || 1.0,
          rotation: video.rotate || 0,
        });
      });

      audioControls.forEach(audio => {
        elements.push({
          elementType: "AUDIO",
          contentId: audio.pieceId,
          position: [audio.left, audio.top],
          scale: 1.0,
          rotation: audio.rotate || 0,
        });
      });

      const stickers = canvasRef.current.getStickerData();
      stickers.forEach(sticker => {
        elements.push({
          elementType: "STICKER",
          contentId: sticker.id,
          position: [sticker.left, sticker.top],
          scale: sticker.scale || 1.0,
          rotation: sticker.rotation || 0,
        });
      });

      const canvasElements = canvasRef.current.getCanvasElements();
      canvasElements.forEach((el) => {
        if (el.elementType === "DATE") {
          elements = elements.filter(e => e.elementType !== "DATE");
          const fallbackDate = isTimeCapsule && openAt
            ? openAt.split("T")[0]
            : new Date().toISOString().slice(0, 10);
          const extractedDate = el.date || fallbackDate;
          console.log("📅 저장할 날짜 값:", extractedDate);
          elements.push({
            elementType: "DATE",
            position: el.position,
            scale: el.scale,
            rotation: el.rotation,
            date: extractedDate,
          });
          return;
        }

        let element = {
          elementType: el.elementType,
          position: el.position,
          scale: el.scale,
          rotation: el.rotation,
        };

        if (el.elementType === "DRAWING") {
          element.drawingData = el.drawingData;
        }

        if (el.elementType === "TEXT" && el.contentId && el.text) {
          element.contentId = el.contentId;
          element.text = el.text;
        }

        if (["STICKER", "IMAGE"].includes(el.elementType) && el.contentId) {
          element.contentId = el.contentId;
        }

        elements.push(element);
      });

      // openAt 시간 보정 (KST로)
      let correctedOpenAt = null;
      if (isTimeCapsule && openAt) {
        correctedOpenAt = openAt.split("T")[0];
      }

      const diaryData = {
        userId,
        title: diaryTitle || "제목 없음",
        backgroundContentId: backgroundId || "default-background-id",
        themeColor: "#FFECCC",
        emotionContentId: emotionStickerId,
        isShared: false,
        elements,
        openAt: correctedOpenAt,
        timeZone: "Asia/Seoul",
      };

      console.log("💾 저장 보낼 데이터:", diaryData);
      console.log("🕒 openAt 최종 값 확인:", openAt);
      console.log("📄 최종 저장 데이터:", diaryData);
      console.log("📦 JSON.stringify(diaryData):", JSON.stringify(diaryData, null, 2));

      try {
        await axios.post(`https://api.puzzlelog.me/diaries`, diaryData, {
          // await axios.post(`http://localhost:8080/diaries`, diaryData, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true,
        });
        alert("일기 저장 완료!");
      } catch (error) {
        console.error("❌ 일기 저장 실패:", error);
        if (error.response) {
          console.log("📡 서버 응답 상태코드:", error.response.status);
          console.log("📨 서버 응답 데이터:", error.response.data);
        } else if (error.request) {
          console.log("📭 요청은 갔지만 응답 없음:", error.request);
        } else {
          console.log("📛 에러 발생 원인:", error.message);
        }
        alert("일기 저장 실패");
      }
    }
  };

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

  useEffect(() => {
    if (canvasRef.current) {
      const videos = canvasRef.current.getVideoPieces();
      const audios = canvasRef.current.getAudioPieces();
      setVideoElements(videos);
      setAudioElements(audios);
    }
  }, [canvasRef.current]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col items-center">
        {/* 제목 입력 부분 */}
        <div className="flex flex-row justify-end w-full pr-56 mt-32">
          <input
            type="text"
            placeholder="오늘의 제목을 입력하세요"
            value={diaryTitle}
            onChange={(e) => setDiaryTitle(e.target.value)}
            className="border rounded-lg px-4 py-2 text-lg w-[500px]"
          />
        </div>

        {/* 캔버스와 비디오/오디오를 동일 부모 div 내 배치 */}
        <div className="w-full flex justify-end pr-16">
          <div
            ref={containerRef}
            className="relative w-[800px] h-[500px] mt-8 z-10"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <FabricCanvasEditor ref={canvasRef} selectedPieces={selectedPieces} allStickers={allStickers} />

            {/* 비디오 컨트롤러 */}
            {videoControls.map((video, index) => (
              <div
                key={`video-${index}`}
                className="absolute z-30 media-wrapper"
                style={{
                  top: video.top,
                  left: video.left,
                  transform: `rotate(${video.rotate}deg)`,
                  transformOrigin: 'center center',
                  cursor: isDragging && draggedId === video.id ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => {
                  console.log("비디오 드래그", e);
                  handleDragStart(e, video.id, "video");
                }}
                onDragStart={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
              >
                <video
                  src={video.src}
                  controls
                  className="w-[300px] h-[200px]"
                  style={{ pointerEvents: 'auto' }}
                />
                <div className="flex justify-center space-x-2 mt-1 media-control-buttons">
                  <button
                    onClick={() =>
                      setVideoControls((prev) =>
                        prev.map((v) =>
                          v.id === video.id
                            ? { ...v, rotate: v.rotate + 15 }
                            : v
                        )
                      )
                    }
                    className="bg-[#D3D3D3] text-gray-800 text-sm px-2 rounded hover:bg-[#C0C0C0]"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() =>
                      setVideoControls((prev) =>
                        prev.filter((v) => v.id !== video.id)
                      )
                    }
                    className="bg-[#D6B896] text-white text-sm px-2 rounded hover:bg-[#C7A986]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* 오디오 컨트롤러 */}
            {audioControls.map((audio, index) => (
              <div
                key={`audio-${index}`}
                className="absolute z-30 media-wrapper"
                style={{
                  top: audio.top,
                  left: audio.left,
                  transform: `rotate(${audio.rotate}deg)`,
                  transformOrigin: 'center center',
                  cursor: isDragging && draggedId === audio.id ? "grabbing" : "grab",
                  zIndex: 50,
                }}
                onMouseDown={(e) => {
                  console.log("오디오 드래그", e);
                  console.log("🎧 오디오 드래그 시작됨!", audio.id);
                  handleDragStart(e, audio.id, "audio");
                }}
                onDragStart={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
              >
                <audio
                  src={audio.src}
                  controls
                  className="w-[200px]"
                  style={{ pointerEvents: isDragging && draggedId === audio.id ? "none" : "auto" }}
                />
                <div className="flex justify-center space-x-2 mt-1 media-control-buttons">
                  <button
                    onClick={() =>
                      setAudioControls((prev) =>
                        prev.map((a) =>
                          a.id === audio.id
                            ? { ...a, rotate: a.rotate + 15 }
                            : a
                        )
                      )
                    }
                    className="bg-[#D3D3D3] text-gray-800 text-sm px-2 rounded hover:bg-[#C0C0C0]"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() =>
                      setAudioControls((prev) =>
                        prev.filter((a) => a.id !== audio.id)
                      )
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

        {/* 저장 및 취소 버튼 */}
        <div className="w-full flex justify-start space-x-4 mt-40 ml-24 p-8">
          <button
            onClick={() => setShowEmotionSelector(true)}
            className="px-6 py-2 bg-purple-400 text-white rounded-lg shadow-md hover:bg-purple-500"
          >
            저장하기
          </button>
          <button
            className="px-6 py-2 bg-blue-200 text-blue-800 rounded-lg shadow-md hover:bg-blue-300"
          >
            취소하기
          </button>
        </div>

        {/* 감정 스티커 선택기 */}
        {showEmotionSelector && (
          <div className="emotion-selector">
            <h2 className="emotion-title">오늘 당신의 기분은?</h2>
            <div className="stickers">
              {emotionStickers.map((sticker) => (
                <img
                  key={sticker.id}
                  src={sticker.mediaId}
                  alt={sticker.name}
                  className="w-16 h-16 cursor-pointer"
                  onClick={() => handleEmotionStickerSelected(sticker.id)}
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
      </div>
    </div>
  );
};

export default MakeDiary;

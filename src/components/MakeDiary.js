import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import FabricCanvasEditor from "../components/FabricCanvasEditor";
import Header from "./Header";
import "../styles/MakeDiary.css";

const MakeDiary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPieces = [] } = location.state || {};
  console.log("MakeDiary로 넘어온 조각:", selectedPieces);

  const canvasRef = useRef(null);
  const [videoElements, setVideoElements] = useState([]); // ✅ 비디오 요소 상태 추가
  const [audioElements, setAudioElements] = useState([]); // ✅ 오디오 요소 상태 추가

  const [videoControls, setVideoControls] = useState([]);
  const [audioControls, setAudioControls] = useState([]);

  const containerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragType, setDragType] = useState(null);

  const [diaryTitle, setDiaryTitle] = useState("");

  const [backgroundImageId, setBackgroundImageId] = useState(null);

  // const setBackground = (imageUrl, imageId) => {
  //   fabric.Image.fromURL(imageUrl, (img) => {
  //     img.set({
  //       selectable: false,
  //       evented: false,
  //     });
  //     canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  //     setBackgroundImageId(imageId); // id 저장
  //   });
  // };



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
    // 비디오 초기 컨트롤 상태
    const videoInit = selectedPieces
      .filter((p) => p.type === "VIDEO")
      .map((v, idx) => ({
        id: idx,
        top: 150 + idx * 50,
        left: 300 + idx * 50,
        rotate: 0,
        src: v.mediaId,
      }));
    setVideoControls(videoInit);

    // 오디오 초기 컨트롤 상태
    const audioInit = selectedPieces
      .filter((p) => p.type === "AUDIO")
      .map((a, idx) => ({
        id: idx,
        top: 400 + idx * 50,
        left: 300,
        rotate: 0,
        src: a.mediaId,
      }));
    setAudioControls(audioInit);
  }, [selectedPieces]);



  // ✅ 비디오/오디오 조각 초기화
  useEffect(() => {
    if (canvasRef.current) {
      const videos = canvasRef.current.getVideoPieces();
      const audios = canvasRef.current.getAudioPieces();
      setVideoElements(videos);
      setAudioElements(audios);
    }
  }, [canvasRef.current]);



  const handleSave = async () => {
    if (canvasRef.current) {
      
      const backgroundId = canvasRef.current.getBackgroundImageId();
      console.log("🚩 MakeDiary에서 받은 backgroundId:", backgroundId);
      const userId = localStorage.getItem("userId") || "guest";

      // 🎯 elements 배열 만들기
      let elements = [];

      // 비디오
      videoControls.forEach(video => {
        elements.push({
          elementType: "VIDEO",
          contentId: video.src, 
          position: [video.left, video.top],
          scale: 1.0,
          rotation: video.rotate || 0,
        });
      });

      // 오디오
      audioControls.forEach(audio => {
        elements.push({
          elementType: "AUDIO",
          contentId: audio.src,
          position: [audio.left, audio.top],
          scale: 1.0,
          rotation: audio.rotate || 0,
        });
      });

      // 스티커
      const stickers = canvasRef.current.getStickerData();
      console.log("🟢 스티커 데이터:", stickers);

      stickers.forEach(sticker => {
        elements.push({
          elementType: "STICKER",
          contentId: sticker.id,
          position: [sticker.left, sticker.top],
          scale: sticker.scale || 1.0,
          rotation: sticker.rotation || 0,
        });
      });


      // 🟢 날짜, 펜 포함 전체 canvas 요소 가져오기
      const canvasElements = canvasRef.current.getCanvasElements();
    console.log("🎨 FabricCanvas에서 받은 elements:", canvasElements);

    canvasElements.forEach((el) => {
      let element = {
        elementType: el.elementType,
        position: el.position,
        scale: el.scale,
        rotation: el.rotation,
      };

      if (el.elementType === "DATE") {
        element.date = el.date; // DATE에는 date 필드 필요
      }

      if (el.elementType === "DRAWING") {
        element.drawingData = el.drawingData; // DRAWING에는 drawingData 필요
      }

      if (["STICKER", "TEXT", "IMAGE"].includes(el.elementType) && el.contentId) {
        element.contentId = el.contentId; // contentId 필요한 타입만
      }

      elements.push(element);
    });


      // 텍스트, 이미지 조각 (selectedPieces 기반)
      selectedPieces.forEach(piece => {
        if (piece.type !== "background" && piece.type !== "VIDEO" && piece.type !== "AUDIO" && piece.type !== "STICKER") {
          elements.push({
            elementType: piece.type,
            contentId: piece.id,
            position: [100, 200],
            scale: 1.0,
            rotation: 0,
          });
        }
      });

      // ✅ elements & backgroundId 최종 확인
      console.log("🎯 최종 elements 배열:", elements);
      console.log("🚩 최종 backgroundContentId:", backgroundId);


      const diaryData = {
        userId,
        title: diaryTitle || "제목 없음",
        backgroundContentId: backgroundId || "default-background-id",
        themeColor: "#FFECCC",
        emotionContentId: "default-emotion-id",
        isShared: false,
        openAt: null,
        elements
      };


      console.log("📄 최종 저장 데이터:", diaryData);

      try {


        await axios.post("http://api.puzzlelog.me/diaries", diaryData, { 
          headers: { "Content-Type": "application/json" },
          withCredentials: true 
        });
        alert("일기 저장 완료!");
      } catch (error) {
        console.error("일기 저장 실패:", error);
        alert("일기 저장 실패");
      }
    } else {
      console.log("❌ canvasRef.current가 null입니다!");
    }


  };





  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col items-center">

        {/* 🔽 제목 입력 부분 추가 */}
        <div className="flex flex-row justify-end w-full pr-56 mt-16">
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
          <div ref={containerRef} className="relative w-[800px] h-[500px] mt-8 z-10"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <FabricCanvasEditor ref={canvasRef} selectedPieces={selectedPieces} />

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
                  cursor: "move",
                }}

                onMouseDown={(e) => handleDragStart(e, video.id, "video")}

                draggable
                onDragEnd={(e) => {

                  const containerRect = containerRef.current.getBoundingClientRect();
                  const offsetX = e.clientX - containerRect.left;
                  const offsetY = e.clientY - containerRect.top;

                  console.log("✅ 드래그 끝 위치:", offsetX, offsetY);

                  setVideoControls((prev) =>
                    prev.map((v) =>
                      v.id === video.id
                        ? { ...v, top: e.clientY - 100, left: e.clientX - 150 } // 위치 조정
                        : v
                    )
                  );
                }}
              >
                <video src={video.src} controls className="w-[300px] h-[200px]" />
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
                    className="bg-gray-300 text-sm px-2 rounded"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() =>
                      setVideoControls((prev) =>
                        prev.filter((v) => v.id !== video.id)
                      )
                    }
                    className="bg-red-400 text-white text-sm px-2 rounded"
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
                }}
                draggable
                onDragEnd={(e) => {
                  console.log("🎯 DragEnd 발생!");
                  console.log("clientX:", e.clientX, "clientY:", e.clientY);

                  setAudioControls((prev) =>
                    prev.map((a) =>
                      a.id === audio.id
                        ? { ...a, top: e.clientY - 50, left: e.clientX - 75 }
                        : a
                    )
                  );
                }}
              >
                <audio src={audio.src} controls className="w-[200px]" />
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
                    className="bg-gray-300 text-sm px-2 rounded"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() =>
                      setAudioControls((prev) =>
                        prev.filter((a) => a.id !== audio.id)
                      )
                    }
                    className="bg-red-400 text-white text-sm px-2 rounded"
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
            onClick={handleSave}

            className="px-6 py-2 bg-[#D6B896] text-white rounded-lg shadow-md">저장하기</button>
          <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md">취소하기</button>
        </div>
      </div>
    </div>
  );
};

export default MakeDiary;

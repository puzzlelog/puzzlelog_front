import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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

const API_BASE_URL = "https://api.puzzlelog.me/pieces";

const WriteVideoPiece = () => {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const navigate = useNavigate();

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      mediaRecorderRef.current.start();
    } catch {
      alert("카메라를 사용할 수 없습니다.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setPreview(url);
      setVideo(blob);
      recordedChunks.current = [];
    };
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handleSave = async () => {
    if (!video) {
      alert("비디오를 첨부해주세요.");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      const formData = new FormData();
      const pieceData = {
        userId: userId,
        type: "VIDEO",
        tags: ["동영상", "기록"],
        location: { type: "Point", coordinates: [127.0276, 37.4979] },
        isPrivate: false,
      };
      formData.append("data", new Blob([JSON.stringify(pieceData)], { type: "application/json" }));
      formData.append("file", video, "video.mp4");
      const response = await fetch(API_BASE_URL, { method: "POST", body: formData });
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        alert("비디오가 저장되었습니다.");
        setVideo(null);
        setPreview(null);
        navigate("/makePiece");
      } else {
        alert(result.message || "저장에 실패했습니다.");
      }
    } catch {
      alert("서버 오류로 인해 저장할 수 없습니다.");
    }
  };

  return (
    <>
      <style>{auroraStyle}</style>
<<<<<<< HEAD
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
=======
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">
>>>>>>> b504c1f (subscription)

        {/* 헤더 추가 */}
        <Header />

        <main className="mt-44 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
          <div className="text-center">

<<<<<<< HEAD
            <h2 className="text-4xl font-bold text-center text-white mb-6">Video Piece</h2>
=======
            <h2 className="text-4xl font-bold text-center text-[#6B4F35] mb-6">Video Piece</h2>
>>>>>>> b504c1f (subscription)

            <div className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl"
              style={{
                animation: "pulseGlow2 3s infinite",
                display: "flex",
                flexDirection: "column", // Flexbox의 방향을 column으로 변경
                justifyContent: "center", // 중앙 정렬
                alignItems: "center", // 중앙 정렬
                background: "rgba(255, 255, 255, 0.2)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                transition: "all 0.3s ease",
                width: '100%', 
                maxWidth: '900px', 
                height: 'auto', 
                padding: '40px', 
            }}>
              <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full p-2 rounded-md mb-4" />
<<<<<<< HEAD
              <button className="font-semobold text-lg px-4 py-2 hover:bg-white cusor-pointer mt-2 w-full text-white rounded-lg transition-all duration-300 border ease-in-out transform hover:bg-white-100 hover:scale-105" onClick={startCamera}>동영상 촬영</button>
=======
              <button className="font-semobold text-lg px-4 py-2 hover:bg-white cusor-pointer mt-2 w-full text-black rounded-lg transition-all duration-300 border ease-in-out transform hover:bg-white-100 hover:scale-105" onClick={startCamera}>동영상 촬영</button>
>>>>>>> b504c1f (subscription)
              {isCameraOpen && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <video ref={videoRef} autoPlay className="w-64 h-auto rounded-md shadow-md" />
                  <button className="font-semobold text-lg px-4 py-2 hover:bg-white cusor-pointer mt-2 text-black rounded-lg transition-all duration-300 border ease-in-out transform hover:bg-white-100 hover:scale-105" onClick={stopRecording}>촬영 종료</button>
                </div>
              )}
              {preview && <video src={preview} controls className="mt-4 w-64 h-auto rounded-md shadow-md border border-gray-300" />}
              <div className="w-full flex justify-between mt-6">
                <button className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition hover:border-transparent hover:scale-105" style={{ backgroundColor: "rgba(169, 169, 169, 0.6)" }} onClick={() => navigate("/makePiece")}>뒤로가기</button>
                <button className="px-6 py-2 rounded-lg text-white transition hover:border-transparent hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]" style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }} onClick={handleSave}>저장하기</button>
              </div>
            </div>

            </div>
        </main>

      </div>
    </>
  );
};

export default WriteVideoPiece;

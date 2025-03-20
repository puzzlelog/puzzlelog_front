import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API_BASE_URL = "http://api.puzzlelog.me/pieces";

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
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header />
      <main className="mt-20 w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-center text-[#6B4F35] mb-6">Video Piece</h2>
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-300 flex flex-col items-center">
          <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full p-2 border rounded-md mb-4" />
          <button className="w-full px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition" onClick={startCamera}>동영상 촬영</button>
          {isCameraOpen && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <video ref={videoRef} autoPlay className="w-64 h-auto rounded-md shadow-md" />
              <button className="px-6 py-2 bg-[#6B4F35] text-white rounded-md hover:bg-[#8C6A50] transition" onClick={stopRecording}>촬영 종료</button>
            </div>
          )}
          {preview && <video src={preview} controls className="mt-4 w-64 h-auto rounded-md shadow-md border border-gray-300" />}
          <div className="w-full flex justify-between mt-6">
            <button className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition" onClick={() => navigate("/makePiece")}>뒤로가기</button>
            <button className="px-6 py-2 bg-[#B99C75] text-white rounded-lg hover:bg-[#8C6A50] transition" onClick={handleSave}>저장하기</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteVideoPiece;

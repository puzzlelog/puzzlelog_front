import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 

const WriteVideoPiece = () => {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

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
    } catch (error) {
      console.error("카메라 접근 실패:", error);
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
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handleSave = () => {
    if (!video) {
      alert("비디오를 첨부해주세요.");
      return;
    }

    console.log("저장된 비디오:", video);
    alert("비디오가 저장되었습니다.");
    setVideo(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header handleLogout={handleLogout} />

      {/* 메인 영역 */}
      <main className="mt-20 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-center mb-6">
          동영상 조각 작성
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full p-2 border rounded-md"
          />

          <button
            className="mt-2 px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
            onClick={startCamera}
          >
            동영상 촬영
          </button>

          {isCameraOpen && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <video ref={videoRef} autoPlay className="w-64 h-auto rounded-md shadow-md" />
              <div className="flex gap-4 mt-2">
                <button
                  className="px-6 py-2 bg-[#6B4F35] text-white rounded-md hover:bg-[#8C6A50] transition"
                  onClick={stopRecording}
                >
                  촬영 종료
                </button>
                <button
                  className="px-6 py-2 bg-[#8C6A50] text-white rounded-md hover:bg-[#6B4F35] transition"
                  onClick={stopCamera}
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          {preview && (
            <div className="mt-4 flex justify-center">
              <video src={preview} controls className="mt-2 w-64 h-auto rounded-md shadow-md" />
            </div>
          )}

          <div className="w-full flex justify-end">
            <button
              className="mt-4 px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
              onClick={handleSave}
            >
              저장하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteVideoPiece;
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 

const WriteAudioPiece = () => {
  const [audio, setAudio] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudio(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("오디오 녹음 실패:", error);
      alert("오디오 녹음을 사용할 수 없습니다.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      setPreview(url);
      setAudio(blob);
      recordedChunks.current = [];
    };
    setIsRecording(false);
  };

  const handleSave = () => {
    if (!audio) {
      alert("오디오를 첨부해주세요.");
      return;
    }

    console.log("저장된 오디오:", audio);
    alert("오디오가 저장되었습니다.");
    setAudio(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">

      <Header handleLogout={handleLogout} />

      {/* 메인 영역 */}
      <main className="mt-20 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-center mb-6">
          오디오 조각 작성
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="w-full p-2 border rounded-md"
          />

          <button
            className="mt-2 px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "녹음 중지" : "오디오 녹음"}
          </button>

          {preview && (
            <div className="mt-4 flex justify-center">
              <p className="text-sm text-gray-500"></p>
              <audio src={preview} controls className="mt-2 w-64 rounded-md shadow-md" />
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

export default WriteAudioPiece;

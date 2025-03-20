import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API_BASE_URL = "http://api.puzzlelog.me/pieces";

const WriteAudioPiece = () => {
  const [audio, setAudio] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const navigate = useNavigate();

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
    } catch {
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

  const handleSave = async () => {
    if (!audio) {
      alert("오디오를 첨부해주세요.");
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
        type: "AUDIO",
        tags: ["음성", "녹음"],
        location: { type: "Point", coordinates: [127.0276, 37.4979] },
        isPrivate: false,
      };
      formData.append("data", new Blob([JSON.stringify(pieceData)], { type: "application/json" }));
      formData.append("file", audio, "audio.mp3");
      const response = await fetch(API_BASE_URL, { method: "POST", body: formData });
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        alert("오디오가 저장되었습니다.");
        setAudio(null);
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
        <h2 className="text-4xl font-bold text-center text-[#6B4F35] mb-6">Voice Piece</h2>
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-300 flex flex-col items-center">
          <input type="file" accept="audio/*" onChange={handleAudioChange} className="w-full p-2 border rounded-md mb-4" />
          <button className="w-full px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition" onClick={isRecording ? stopRecording : startRecording}>{isRecording ? "녹음 중지" : "오디오 녹음"}</button>
          {preview && <audio src={preview} controls className="mt-4 w-full rounded-md shadow-md border border-gray-300" />}
          <div className="w-full flex justify-between mt-6">
            <button className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition" onClick={() => navigate("/makePiece")}>뒤로가기</button>
            <button className="px-6 py-2 bg-[#B99C75] text-white rounded-lg hover:bg-[#8C6A50] transition" onClick={handleSave}>저장하기</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteAudioPiece;
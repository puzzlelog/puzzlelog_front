import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API_BASE_URL = "http://api.puzzlelog.me/pieces";

const WriteImagePiece = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("카메라를 사용할 수 없습니다.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], "captured_image.png", { type: "image/png" });
        setImage(file);
        setPreview(URL.createObjectURL(blob));
      }, "image/png");
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handleSave = async () => {
    if (!image) {
      alert("이미지를 첨부해주세요.");
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
        type: "IMAGE",
        tags: ["사진", "기록"],
        location: { type: "Point", coordinates: [127.0276, 37.4979] },
        isPrivate: false,
      };
      formData.append("data", new Blob([JSON.stringify(pieceData)], { type: "application/json" }));
      formData.append("file", image);
      const response = await fetch(API_BASE_URL, { method: "POST", body: formData });
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        alert("이미지가 저장되었습니다.");
        setImage(null);
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
        <h2 className="text-4xl font-bold text-center text-[#6B4F35] mb-6">Image Piece</h2>
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-300 flex flex-col items-center w-full">
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md mb-4" />
          <button className="w-full px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition" onClick={startCamera}>사진 촬영</button>
          {isCameraOpen && (
            <div className="mt-4 flex flex-col items-center gap-2 w-full">
              <video ref={videoRef} autoPlay className="w-64 h-48 rounded-md shadow-md" />
              <canvas ref={canvasRef} width={640} height={480} className="hidden" />
              <button className="px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition" onClick={capturePhoto}>촬영</button>
            </div>
          )}
          {preview && <img src={preview} alt="미리보기" className="mt-4 w-full h-auto rounded-md shadow-md border border-gray-300" />}
          <div className="w-full flex justify-between mt-6">
            <button className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition" onClick={() => navigate("/makePiece")}>뒤로가기</button>
            <button className="px-6 py-2 bg-[#B99C75] text-white rounded-lg hover:bg-[#8C6A50] transition" onClick={handleSave}>저장하기</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteImagePiece;
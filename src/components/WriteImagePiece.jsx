import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 

const WriteImagePiece = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("카메라 접근 실패:", error);
      alert("카메라를 사용할 수 없습니다.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageUrl = canvasRef.current.toDataURL("image/png");
      setPreview(imageUrl);
      setImage(imageUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handleSave = () => {
    if (!image) {
      alert("이미지를 첨부해주세요.");
      return;
    }

    console.log("저장된 이미지:", image);
    alert("이미지가 저장되었습니다.");
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">

      <Header handleLogout={handleLogout} />

      {/* 메인 영역 */}
      <main className="mt-20 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-center mb-6">
          사진 조각 작성
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md"
          />

          <button
            className="mt-2 px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
            onClick={startCamera}
          >
            사진 촬영
          </button>

          {isCameraOpen && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <video ref={videoRef} autoPlay className="w-64 h-auto rounded-md shadow-md" />
              <canvas ref={canvasRef} width={320} height={240} className="hidden" />
              <div className="flex gap-4 mt-2">
                <button
                  className="px-6 py-2 bg-[#6B4F35] text-white rounded-md hover:bg-[#8C6A50] transition"
                  onClick={capturePhoto}
                >
                  촬영
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
              <img
                src={preview}
                alt="미리보기"
                className="mt-2 w-64 h-auto rounded-md shadow-md"
              />
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

export default WriteImagePiece;
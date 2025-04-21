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
        userId,
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
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">
        <Header />
        <main className="mt-44 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-center text-[#6B4F35] mb-6">Image Piece</h2>

            <div
              className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl mb-12"
              style={{
                animation: "pulseGlow2 3s infinite",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.2)",
                transition: "all 0.3s ease",
                width: "100%",
                maxWidth: "900px",
                padding: "40px",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 rounded-md mb-4"
              />
              <button
                className="font-semobold hover:bg-white text-lg px-4 py-2 cusor-pointer mt-2 w-full text-black rounded-lg transition-all duration-300 border ease-in-out transform hover:bg-white-100 hover:scale-105"
                onClick={startCamera}
              >
                사진 촬영
              </button>
              {isCameraOpen && (
                <div className="mt-4 flex flex-col items-center gap-2 w-full">
                  <video ref={videoRef} autoPlay className="w-64 h-48 rounded-md shadow-md" />
                  <canvas ref={canvasRef} width={640} height={480} className="hidden" />
                  <button
                    className="font-semobold text-lg px-4 py-2 hover:bg-white cusor-pointer mt-2 text-black rounded-lg transition-all duration-300 border ease-in-out transform hover:bg-white-100 hover:scale-105"
                    onClick={capturePhoto}
                  >
                    촬영
                  </button>
                </div>
              )}
              {preview && (
                <img
                  src={preview}
                  alt="미리보기"
                  className="mt-4 w-full h-auto rounded-md shadow-md border border-gray-300"
                />
              )}
              <div className="w-full flex justify-between mt-6">
                <button
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition hover:border-transparent hover:scale-105"
                  style={{ backgroundColor: "rgba(169, 169, 169, 0.6)" }}
                  onClick={() => navigate("/makePiece")}
                >
                  뒤로가기
                </button>
                <button
                  className="px-6 py-2 rounded-lg text-white transition hover:border-transparent hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]"
                  style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }}
                  onClick={handleSave}
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WriteImagePiece;

import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

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
<<<<<<< HEAD
=======

>>>>>>> b504c1f (subscription)
`;

const MakePiece = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{auroraStyle}</style>
<<<<<<< HEAD
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
=======
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">

>>>>>>> b504c1f (subscription)
        {/* 헤더 추가 */}
        <Header />

        {/* 본문 영역 */}
        <main className="mt-60 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
          <div className="text-center">
<<<<<<< HEAD
            <h2 className="text-5xl text-left text-white">
=======
            <h2 className="text-5xl text-left text-[#6B4F35]">
>>>>>>> b504c1f (subscription)
              당신의 이야기를 한 조각씩 채워보세요.
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-16">
              {/* 1 */}
              <div
<<<<<<< HEAD
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold transition-transform duration-300 hover:scale-105"
                style={{
                  animation: "pulseGlow2 3s infinite",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.3)",
                  paddingBottom: "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  width: "110%",
                }}
                onClick={() => navigate("/writeTextPiece")}
              >
                <div className="w-72 h-72 flex items-center justify-center mb-8">
                  <img
                    src="/text_piece.png"
                    alt="글 조각"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white">나만의 글 조각 작성</h3>
                <br />
                <p className="text-xl text-white mt-2 leading-relaxed">
=======
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold  transition-transform duration-300 hover:scale-105"
                style={{
                    animation: "pulseGlow2 3s infinite",
                    display: "flex",
                    flexDirection: "column", // Flexbox의 방향을 column으로 변경
                    justifyContent: "center", // 중앙 정렬
                    alignItems: "center", // 중앙 정렬
                    background: "rgba(255, 255, 255, 0.3)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                    paddingBottom: "1rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "110%"
                }}
                onClick={() => navigate("/writeTextPiece")}
              >
                <img
                  src="/text_piece.png"
                  alt="글 조각"
                  className="w-full h-52 object-cover rounded-md mb-8"
                />
                <h3 className="text-2xl font-semibold">나만의 글 조각 작성</h3>
                <br />
                <p className="text-xl text-gray-700 mt-2 leading-relaxed">
>>>>>>> b504c1f (subscription)
                  당신의 생각과 감정을<br /> 표현할 수 있는 공간입니다.<br /> 글 조각을 통해 감정을 기록해 보세요.
                </p>
              </div>

              {/* 2 */}
              <div
<<<<<<< HEAD
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold transition-transform duration-300 hover:scale-105"
                style={{
                  animation: "pulseGlow2 3s infinite",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.3)",
                  paddingBottom: "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  width: "110%",
                }}
                onClick={() => navigate("/writeImagePiece")}
              >
                <div className="w-72 h-72 flex items-center justify-center mb-8">
                  <img
                    src="/image_piece.png"
                    alt="사진 조각"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white">순간의 사진 조각 작성</h3>
                <br />
                <p className="text-xl text-white mt-2 leading-relaxed">
=======
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold  transition-transform duration-300 hover:scale-105"
                style={{
                    animation: "pulseGlow2 3s infinite",
                    display: "flex",
                    flexDirection: "column", // Flexbox의 방향을 column으로 변경
                    justifyContent: "center", // 중앙 정렬
                    alignItems: "center", // 중앙 정렬
                    background: "rgba(255, 255, 255, 0.3)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                    paddingBottom: "1rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "110%"
                }}
                onClick={() => navigate("/writeImagePiece")}
              >
                <img
                  src="/image_piece.png"
                  alt="사진 조각"
                  className="w-full h-52 object-cover rounded-md mb-8"
                />
                <h3 className="text-2xl font-semibold">순간의 사진 조각 작성</h3>
                <br />
                <p className="text-xl text-gray-700 mt-2 leading-relaxed">
>>>>>>> b504c1f (subscription)
                  소중한 순간을 사진으로 남겨보세요.<br /> 당신만의 특별한 기억을<br /> 기록할 수 있습니다.
                </p>
              </div>

              {/* 3 */}
              <div
<<<<<<< HEAD
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold transition-transform duration-300 hover:scale-105"
                style={{
                  animation: "pulseGlow2 3s infinite",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.3)",
                  paddingBottom: "3rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  width: "110%",
                }}
                onClick={() => navigate("/writeVideoPiece")}
              >
                <div className="w-72 h-72 flex items-center justify-center mb-8">
                  <img
                    src="/video_piece.png"
                    alt="동영상 조각"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white">공유 동영상 조각 작성</h3>
                <br />
                <p className="text-xl text-white mt-2 leading-relaxed">
=======
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold  transition-transform duration-300 hover:scale-105"
                style={{
                    animation: "pulseGlow2 3s infinite",
                    display: "flex",
                    flexDirection: "column", // Flexbox의 방향을 column으로 변경
                    justifyContent: "center", // 중앙 정렬
                    alignItems: "center", // 중앙 정렬
                    background: "rgba(255, 255, 255, 0.3)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                    paddingBottom: "3rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "110%"
                }}
                onClick={() => navigate("/writeVideoPiece")}
              >
                <img
                  src="/video_piece.png"
                  alt="동영상 조각"
                  className="w-full h-52 object-cover rounded-md mb-8"
                />
                <h3 className="text-2xl font-semibold">공유 동영상 조각 작성</h3>
                <br />
                <p className="text-xl text-gray-700 mt-2 leading-relaxed">
>>>>>>> b504c1f (subscription)
                  순간을 동영상으로 담아보세요.<br /> 추억을 생생하게 기록할 수 있습니다.
                </p>
              </div>

              {/* 4 */}
              <div
<<<<<<< HEAD
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold transition-transform duration-300 hover:scale-105"
                style={{
                  animation: "pulseGlow2 3s infinite",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.3)",
                  paddingBottom: "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  width: "110%",
                }}
                onClick={() => navigate("/writeAudioPiece")}
              >
                <div className="w-72 h-72 flex items-center justify-center mb-8">
                  <img
                    src="/audio_piece.png"
                    alt="음성 조각"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white">기억할 음성 조각 작성</h3>
                <br />
                <p className="text-xl text-white mt-2 leading-relaxed">
=======
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold  transition-transform duration-300 hover:scale-105"
                style={{
                    animation: "pulseGlow2 3s infinite",
                    display: "flex",
                    flexDirection: "column", // Flexbox의 방향을 column으로 변경
                    justifyContent: "center", // 중앙 정렬
                    alignItems: "center", // 중앙 정렬
                    background: "rgba(255, 255, 255, 0.3)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                    paddingBottom: "1rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "110%"
                }}
                onClick={() => navigate("/writeAudioPiece")}
              >
                <img
                  src="/audio_piece.png"
                  alt="음성 조각"
                  className="w-full h-52 object-cover rounded-md mb-8"
                />
                <h3 className="text-2xl font-semibold">기억할 음성 조각 작성</h3>
                <br />
                <p className="text-xl text-gray-700 mt-2 leading-relaxed">
>>>>>>> b504c1f (subscription)
                  소중한 목소리를 남겨보세요.<br /> 오디오를 통해 추억을<br /> 더욱 특별하게 보관할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

<<<<<<< HEAD
export default MakePiece;
=======
export default MakePiece;
>>>>>>> b504c1f (subscription)

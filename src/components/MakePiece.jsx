import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // ✅ handleLogout 삭제된 Header만 가져옴

const MakePiece = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header />

      {/* 본문 영역 */}
      <main className="mt-20 w-full max-w-6xl font-cafe24">
        <h2 className="text-5xl text-left text-[#6B4F35]">
          당신의 이야기를 한 조각씩 채워보세요.
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 1 */}
          <div 
            className="p-6 bg-[#EADDC5] rounded-lg cursor-pointer transition hover:bg-[#B99C75] text-center"
            onClick={() => navigate("/writeTextPiece")}
          >
            <img src="/text_piece.png" alt="글 조각" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-2xl font-semibold">나만의 글 조각 작성</h3>
            <br/>
            <p className="text-xl text-gray-700 mt-2 leading-relaxed">
              당신의 생각과 감정을 표현할 수 있는 공간입니다. 글 조각을 통해 감정을 기록해 보세요.
            </p>
          </div>

          {/* 2 */}
          <div 
            className="p-6 bg-[#EADDC5] rounded-lg cursor-pointer transition hover:bg-[#B99C75] text-center"
            onClick={() => navigate("/writeImagePiece")}
          >
            <img src="/image_piece.png" alt="사진 조각" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-2xl font-semibold">순간의 사진 조각 작성</h3>
            <br/>
            <p className="text-xl text-gray-700 mt-2 leading-relaxed">
              소중한 순간을 사진으로 남겨보세요. 당신만의 특별한 기억을 기록할 수 있습니다.
            </p>
          </div>

          {/* 3 */}
          <div 
            className="p-6 bg-[#EADDC5] rounded-lg cursor-pointer transition hover:bg-[#B99C75] text-center"
            onClick={() => navigate("/writeVideoPiece")}
          >
            <img src="/video_piece.png" alt="동영상 조각" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-2xl font-semibold">공유 동영상 조각 작성</h3>
            <br/>
            <p className="text-xl text-gray-700 mt-2 leading-relaxed">
              순간을 동영상으로 담아보세요. 추억을 생생하게 기록할 수 있습니다.
            </p>
          </div>

          {/* 4 */}
          <div 
            className="p-6 bg-[#EADDC5] rounded-lg cursor-pointer transition hover:bg-[#B99C75] text-center"
            onClick={() => navigate("/writeAudioPiece")}
          >
            <img src="/audio_piece.png" alt="음성 조각" className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-2xl font-semibold">기억할 음성 조각 작성</h3>
            <br/>
            <p className="text-xl text-gray-700 mt-2 leading-relaxed">
              소중한 목소리를 남겨보세요. 오디오를 통해 추억을 더욱 특별하게 보관할 수 있습니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MakePiece;

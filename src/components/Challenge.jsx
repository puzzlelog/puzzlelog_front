import React from "react";
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

const Challenge = () => {
  return (
    <>
    <style>{auroraStyle}</style>

    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
      {/* 헤더 */}
      <Header />

      <main className="mt-28 w-full max-w-7xl font-cafe24 mx-auto justify-center items-center">
        {/* 제목 및 설명 */}
        <section className="text-left mb-10">
          <h1 className="text-4xl font-bold text-[#6B4F35]">도전! 챌린지</h1>
          <p className="text-lg text-gray-700 mt-2">
            챌린지를 성공하여 얻은 보상으로 puzzelog의 잠겨진 기능들을 열어보세요
          </p>
        </section>

        {/* 미션 카드 리스트 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col space-y-4"
              style={{
                animation: "pulseGlow2 3s infinite",
                background: "rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* 이미지 (Placeholder) */}
              <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">이미지</span>
              </div>

              {/* 미션 설명 */}
              <h3 className="text-2xl font-semibold text-gray-900">진행 중인 미션 리스트</h3>
              <p className="text-gray-600">각 미션의 진행 상황을 퍼센트로 보여줍니다.</p>

              {/* 작성자 및 정보 */}
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <span>🔵 김철수</span>
                <span>• 11 Jan 2022</span>
                <span>• 5분 소요</span>
              </div>
            </div>
          ))}
        </section>

        {/* 진행률 섹션 */}
        <section className="mt-14">
          <h2 className="text-3xl font-bold text-[#6B4F35] mb-4">
            현재 진행 중인 미션과 달성 현황을 확인하세요!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            각 미션의 진행 상황을 쉽게 확인할 수 있습니다. 목표 달성을 위한 여정을 함께하세요.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 진행 퍼센트 */}
            <div className="space-y-6">
              {/* 퍼센트 75% */}
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  75% <span className="text-gray-600 text-base">미션을 완료하고 보상을 받으세요!</span>
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div className="bg-[#7430b7] h-4 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>

              {/* 퍼센트 30% */}
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  30% <span className="text-gray-600 text-base">지금 바로 도전해 보세요!</span>
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div className="bg-[#7430b7] h-4 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>
            </div>

            {/* 오른쪽 이미지 박스 */}
            <div className="w-full h-56 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">이미지</span>
            </div>
          </div>
        </section>
      </main>
    </div>

    </>
  );
};

export default Challenge;

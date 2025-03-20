import React from "react";
import Header from "../components/Header";

const Challenge = () => {
  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      {/* 헤더 */}
      <Header />

      <main className="w-full max-w-6xl mt-10 px-6">
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
                  <div className="bg-[#6B4F35] h-4 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>

              {/* 퍼센트 30% */}
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  30% <span className="text-gray-600 text-base">지금 바로 도전해 보세요!</span>
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div className="bg-[#6B4F35] h-4 rounded-full" style={{ width: "30%" }}></div>
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
  );
};

export default Challenge;

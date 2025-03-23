import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const AdminChallenge = () => {
  const navigate = useNavigate();
  
  // 임시 챌린지 리스트
  const [challenges, setChallenges] = useState([
    { id: 1, name: "달리기 챌린지", active: true },
    { id: 2, name: "독서 챌린지", active: false },
    { id: 3, name: "명상 챌린지", active: true },
  ]);

  // 챌린지 추가 팝업 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newChallengeName, setNewChallengeName] = useState("");
  const [newChallengeDescription, setNewChallengeDescription] = useState("");

  // 챌린지 활성화/비활성화 토글
  const toggleChallenge = (id) => {
    setChallenges(
      challenges.map((challenge) =>
        challenge.id === id ? { ...challenge, active: !challenge.active } : challenge
      )
    );
  };

  // 챌린지 삭제
  const deleteChallenge = (id) => {
    setChallenges(challenges.filter((challenge) => challenge.id !== id));
  };

  // 챌린지 추가
  const handleAddChallenge = () => {
    if (newChallengeName.trim() === "") return;
    const newChallenge = {
      id: Date.now(),
      name: newChallengeName,
      description: newChallengeDescription,
      active: false,
    };
    setChallenges([...challenges, newChallenge]);
    setIsPopupOpen(false);
    setNewChallengeName("");
    setNewChallengeDescription("");
  };

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header />
      <main className="mt-10 w-full max-w-5xl">
        <h2 className="text-4xl font-semibold text-left text-[#6B4F35] mb-6">
          챌린지 관리
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          챌린지를 추가하고 삭제하며 활성화 또는 비활성화할 수 있습니다.
        </p>
        
        <button
          onClick={() => setIsPopupOpen(true)}
          className="mb-6 px-4 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
        >
          챌린지 추가
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-3">{challenge.name}</h3>
              <p className="text-gray-600">{challenge.description}</p>
              <p className={`text-lg font-medium ${challenge.active ? "text-green-600" : "text-red-600"}`}>
                {challenge.active ? "활성화됨" : "비활성화됨"}
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => toggleChallenge(challenge.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {challenge.active ? "비활성화" : "활성화"}
                </button>
                <button
                  onClick={() => deleteChallenge(challenge.id)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => navigate("/adminPage")}
          className="mt-10 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-800 transition"
        >
          뒤로 가기
        </button>
      </main>

      {/* 챌린지 추가 팝업 */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">새로운 챌린지 추가</h3>
            <input
              type="text"
              placeholder="챌린지 제목"
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              value={newChallengeName}
              onChange={(e) => setNewChallengeName(e.target.value)}
            />
            <textarea
              placeholder="챌린지 내용"
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              value={newChallengeDescription}
              onChange={(e) => setNewChallengeDescription(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                취소
              </button>
              <button
                onClick={handleAddChallenge}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChallenge;
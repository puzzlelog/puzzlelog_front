import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from "./Header";

const auroraStyle = `
@keyframes pulseGlow2 {
  0% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8); }
  100% { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
`;

function CollaborativeDiarySetup() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [date, setDate] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(
          `https://api.puzzlelog.me/friends/${userId}/friends?type=friends&size=20`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        setFriends(res.data.data.friends || []);
      } catch (err) {
        setError("친구 목록을 불러오지 못했습니다.");
      }
    };
    if (userId && accessToken) {
      fetchFriends();
    }
  }, [userId, accessToken]);

  const handleFriendToggle = (friend) => {
    if (selectedFriends.some(f => f.friendId === friend.friendId)) {
      setSelectedFriends(selectedFriends.filter(f => f.friendId !== friend.friendId));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleNext = () => {
    if (!date) {
      setError("날짜를 선택하세요.");
      return;
    }
    if (selectedFriends.length === 0) {
      setError("최소 한 명 이상의 친구를 선택하세요.");
      return;
    }
    navigate('/collaborative-select-pieces', {
      state: {
        date,
        friendIds: selectedFriends.map(friend => friend.friendId),
      },
    });
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] font-cafe24">
      <style>{auroraStyle}</style>
      <Header />
      <main className="mt-40 w-full max-w-2xl mx-auto flex flex-col items-center px-6">
  <div
    className="rounded-xl shadow-2xl shadow-indigo-500/50 p-10 w-full text-white"
    style={{
      animation: 'pulseGlow2 3s infinite',
      background: 'rgba(255, 255, 255, 0.1)',
    }}
  >
    <h2 className="text-4xl font-bold mb-8 text-center">
      협업 일기 생성 및 초대
    </h2>

    {error && (
      <p className="text-red-400 text-center mb-6 text-lg font-semibold">
        {error}
      </p>
    )}

    <div className="mb-6">
      <label className="block mb-3 text-white text-lg">날짜 선택</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-6 py-3 rounded-md text-black text-lg"
      />
    </div>

    <div className="mb-8">
      <label className="block mb-3 text-white text-lg">
        친구 선택 (복수 선택 가능)
      </label>
      <div className="max-h-48 overflow-y-auto pr-2">
        {friends.map((friend) => {
          const isSelected = selectedFriends.some(
            (f) => f.friendId === friend.friendId
          );

          return (
            <div key={friend.friendId} className="flex items-center mb-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFriendToggle(friend)}
                  className="hidden"
                />
                <span
                  className={`w-8 h-8 mr-3 flex items-center justify-center rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-pink-400 text-white animate-heartBeat'
                      : 'bg-white bg-opacity-30 text-transparent'
                  }`}
                  style={{
                    animation: isSelected ? 'heartBeat 1s infinite' : 'none',
                  }}
                >
                  {isSelected && '♥'}
                </span>
                <span className="text-white text-lg">{friend.nickname}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>

    <button
      onClick={handleNext}
      className="w-full py-3 text-lg border border-white text-white rounded-md hover:bg-white hover:text-black transition-all duration-300"
    >
      협업 요청 보내기
    </button>
  </div>
</main>

    </div>
  );
}

export default CollaborativeDiarySetup;
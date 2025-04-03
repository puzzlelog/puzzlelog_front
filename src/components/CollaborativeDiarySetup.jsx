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
`;

function CollaborativeDiarySetup() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [date, setDate] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
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

  const handleNext = () => {
    if (!date) {
      setError("날짜를 선택하세요.");
      return;
    }
    if (!selectedFriend) {
      setError("협업할 친구를 선택하세요.");
      return;
    }
    navigate('/collaborative-select-pieces', {
      state: {
        date,
        friendId: selectedFriend.friendId,
      },
    });
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] font-cafe24">
      <style>{auroraStyle}</style>
      <Header />
      <main className="mt-40 w-full max-w-xl mx-auto flex flex-col items-center px-4">
        <div
          className="rounded-lg shadow-2xl shadow-indigo-500/50 p-8 w-full text-white"
          style={{ animation: "pulseGlow2 3s infinite", background: "rgba(255, 255, 255, 0.1)" }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            협업 일기 생성 및 초대
          </h2>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block mb-2 text-white">날짜 선택</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-black"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-white">친구 선택</label>
            <select
              value={selectedFriend?.friendId || ""}
              onChange={(e) => {
                const friend = friends.find(f => f.friendId === e.target.value);
                setSelectedFriend(friend);
              }}
              className="w-full px-4 py-2 rounded-md text-black"
            >
              <option value="">-- 친구 선택 --</option>
              {friends.map(friend => (
                <option key={friend.friendId} value={friend.friendId}>
                  {friend.nickname}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-all duration-300"
          >
            협업 요청 보내기
          </button>
        </div>
      </main>
    </div>
  );
}

export default CollaborativeDiarySetup;

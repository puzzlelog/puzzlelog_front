import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

// CommunityPage와 동일한 애니메이션 스타일
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

const CollaborativeDiaryInvite = () => {
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const [date, setDate] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 친구 목록 조회
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        console.log("현재 로그인 userId:", userId);

        const res = await axios.get(
          `https://api.puzzlelog.me/friends/${userId}/friends?type=friends&size=20`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );

        const fetchedFriends = res.data.data.friends || [];
        fetchedFriends.forEach((friend) => {
          console.log("친구 friendId:", friend.friendId, "/ 닉네임:", friend.nickname);
        });

        setFriends(fetchedFriends);
      } catch (err) {
        console.error("친구 목록 불러오기 실패:", err);
        setError(
          "친구 목록을 불러오지 못했습니다: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    if (userId && accessToken) {
      fetchFriends();
    } else {
      setError("로그인이 필요합니다.");
    }
  }, [userId, accessToken]);

  // 친구 선택 토글
  const handleToggleFriend = (friend) => {
    setSelectedFriends((prev) => {
      const exists = prev.find((f) => f.friendId === friend.friendId);
      if (exists) {
        return prev.filter((f) => f.friendId !== friend.friendId);
      }
      return [...prev, friend];
    });
  };

  // 협업 일기 생성 + 초대 전송
  const handleCreateDiaryAndInvite = async () => {
    setError("");

    if (!date) {
      setError("날짜를 선택해주세요.");
      return;
    }
    if (selectedFriends.length === 0) {
      setError("협업할 친구를 선택해주세요.");
      return;
    }
    if (!accessToken) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      // 1) 협업일기 생성
      const diaryRes = await axios.post(
        "https://api.puzzlelog.me/diaries",
        {
          userId,
          title: "협업 일기",
          backgroundContentId: "default-background-id",
          themeColor: "#FFECCC",
          isShared: true,
          openAt: date,
          participants: [userId],
          elements: [
            {
              elementType: "TEXT",
              contentId: "temp-content-id",
              position: [100, 100],
              scale: 1.0,
              rotation: 0,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      const newDiaryId = diaryRes.data.data.diaryId;

      // 2) 초대 전송
      const receiverIds = selectedFriends.map((friend) => friend.friendId);
      console.log("초대 전송 body:", {
        diaryId: newDiaryId,
        diaryDate: date,
        receiverIds,
      });

      await axios.post(
        "https://api.puzzlelog.me/invitations",
        {
          diaryId: newDiaryId,
          diaryDate: date,
          receiverIds,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      alert("협업 요청이 성공적으로 전송되었습니다.");
      navigate("/home");
    } catch (err) {
      console.error("협업일기 생성 또는 초대 전송 실패:", err);
      setError(
        "일기 생성 또는 초대 전송에 실패했습니다: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <>
      {/* 오로라 애니메이션 스타일 */}
      <style>{auroraStyle}</style>

      {/* 배경: CommunityPage와 동일한 그라디언트 */}
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] font-cafe24">
        <Header />

        {/* 메인 컨테이너 */}
        <main className="mt-40 w-full max-w-4xl mx-auto flex justify-center items-center px-4">
          {/* 카드 영역 */}
          <div
            className="rounded-lg shadow-2xl shadow-indigo-500/50 text-xl transition-transform duration-300 p-8 w-full"
            style={{
              animation: "pulseGlow2 3s infinite",
              background: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2 className="text-3xl font-bold text-[#5A3E2B] mb-6 text-center text-white">
               협업 일기 생성 및 초대
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flex flex-col space-y-4">
              {/* 날짜 선택 */}
              <label className="text-lg font-medium text-gray-700">날짜 선택</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded px-4 py-2 w-full"
              />

              {/* 친구 선택 */}
              <label className="text-lg font-medium text-gray-700 mt-4">친구 선택</label>
              <div className="flex flex-wrap gap-3">
  {friends.length === 0 ? (
    <p className="text-gray-500">친구 목록을 불러오는 중...</p>
  ) : (
    friends.map((friend) => {
      const isSelected = selectedFriends.some((f) => f.friendId === friend.friendId);

      return (
        <button
          key={friend.friendId}
          onClick={() => handleToggleFriend(friend)}
          className={`
            px-6 py-2 rounded-full text-lg transition-all duration-300 
            ${isSelected 
              ? "bg-[#CBB9A0] text-white border border-[#CBB9A0]"  // 선택된 상태 스타일
              : "bg-white text-black border border-gray-400 hover:bg-gray-100" // 미선택 상태 스타일
            }
          `}
        >
          {/* 닉네임 + 선택 시 체크 표시 */}
          {friend.nickname}
          {isSelected && <span className="ml-2">✓</span>}
        </button>
      );
    })
  )}
</div>


              {/* 협업 요청 버튼 */}
              <button
  onClick={handleCreateDiaryAndInvite}
  className="
    px-6 py-2 mt-6 
    bg-white/20 text-white  /* 텍스트를 흰색으로 */
    border border-white 
    rounded-md text-lg 
    hover:bg-white hover:text-gray-900 /* hover 시 배경은 흰색, 텍스트는 진한 회색 */
    transition-all duration-300 
    hover:border-transparent 
    hover:scale-105
  "
>
  협업 요청 보내기
</button>

            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CollaborativeDiaryInvite;

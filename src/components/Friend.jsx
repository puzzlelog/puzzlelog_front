import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
`;

const Friend = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
<<<<<<< HEAD
      console.warn("로그인 정보 없음. 로그인 페이지로 이동합니다.");
=======
      console.warn("🚨 로그인 정보 없음. 로그인 페이지로 이동합니다.");
>>>>>>> b504c1f (subscription)
      navigate("/login");
    }
  }, [userId, navigate]);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [searchNickname, setSearchNickname] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [activeTab, setActiveTab] = useState("friends");

  const fetchFriends = async (type) => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `https://api.puzzlelog.me/friends/${userId}/friends?type=${type}&size=20`
      );
      if (response.data.success) {
        switch (type) {
          case "friends":
            setFriends(response.data.data.friends);
            break;
          case "your_request":
            setRequests(response.data.data.friends);
            break;
          case "blocked":
            setBlocked(response.data.data.friends);
            break;
<<<<<<< HEAD
          default:
            break;
=======
>>>>>>> b504c1f (subscription)
        }
      }
    } catch (error) {
      console.error(`${type} 목록 로드 실패:`, error);
    }
  };

  useEffect(() => {
    fetchFriends("friends");
  }, [userId]);

  const handleSearchNickname = async () => {
    if (!searchNickname) return alert("닉네임을 입력하세요!");
    try {
      const response = await axios.get(
        `https://api.puzzlelog.me/users?nickname=${searchNickname}`
      );
      if (response.data.success && response.data.data.users.length > 0) {
        const userData = response.data.data.users[0];
<<<<<<< HEAD
        setSearchResult({
          exists: true,
          id: userData.userId,
          nickname: searchNickname,
        });
=======
        setSearchResult({ exists: true, id: userData.userId, nickname: searchNickname });
>>>>>>> b504c1f (subscription)
      } else {
        setSearchResult({ exists: false });
      }
    } catch (error) {
      console.error("닉네임 검색 실패:", error);
      setSearchResult({ exists: false });
    }
  };

  const handleFriendAction = async (action, friendId) => {
    if (!friendId) return alert("친구 ID가 필요합니다.");
<<<<<<< HEAD

=======
  
>>>>>>> b504c1f (subscription)
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      userId,
    };
<<<<<<< HEAD

    try {
      let url = "",
        method = "";

=======
  
    try {
      let url = "", method = "";
  
>>>>>>> b504c1f (subscription)
      switch (action) {
        case "request":
          url = `https://api.puzzlelog.me/friends/${userId}/friends/${friendId}`;
          method = "POST";
          break;
        case "accept":
          url = `https://api.puzzlelog.me/friends/${userId}/requests/${friendId}/accept`;
          method = "PATCH";
          break;
        case "delete":
          url = `https://api.puzzlelog.me/friends/${userId}/friends/${friendId}`;
          method = "DELETE";
          break;
        case "block":
          url = `https://api.puzzlelog.me/friends/${userId}/friends/${friendId}/block`;
          method = "PATCH";
          break;
        case "unblock":
          url = `https://api.puzzlelog.me/friends/${userId}/friends/${friendId}/unblock`;
          method = "PATCH";
          break;
        default:
          return;
      }
<<<<<<< HEAD

=======
  
>>>>>>> b504c1f (subscription)
      let response;
      if (method === "DELETE") {
        response = await axios.delete(url, { headers });
      } else {
        response = await axios({ method, url, headers });
      }
<<<<<<< HEAD

=======
  
>>>>>>> b504c1f (subscription)
      if (response.data.success) {
        alert(response.data.message);
        fetchFriends(activeTab);
      } else {
        alert(response.data.message || "요청 실패");
      }
    } catch (error) {
      console.error(`${action} 요청 오류:`, error);
    }
  };
<<<<<<< HEAD
=======
  
>>>>>>> b504c1f (subscription)

  return (
    <>
      <style>{auroraStyle}</style>
<<<<<<< HEAD
      <div className="relative min-h-screen bg-gradient-to-br from-[#1e1b4b] to-[#3b0764] font-cafe24 overflow-auto">
        <Header />

        <main className="flex flex-col items-center justify-start mt-32 w-full">
          <h2 className="text-3xl text-white font-semibold mb-8 animate-pulse">
=======
      <div className="relative min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 font-cafe24 overflow-auto">
        <Header />

        <main className="flex flex-col items-center justify-start mt-32 w-full">
          <h2 className="text-3xl text-[#6B4F35] font-semibold mb-8 animate-pulse">
>>>>>>> b504c1f (subscription)
            친구 관리
          </h2>

          <div className="flex w-full max-w-5xl gap-6 px-4">
            {/* 친구 목록 */}
            <div className="w-1/3 bg-white rounded-2xl p-4 shadow-2xl animate-[pulseGlow_3s_ease-in-out_infinite]">
              <h3 className="text-xl font-bold mb-3 text-gray-800">내 친구</h3>
              <ul className="space-y-2">
                {friends.map((friend, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-white rounded-lg p-2 shadow hover:bg-gray-100 transition"
                  >
<<<<<<< HEAD
                    <span className="text-gray-800">{friend.nickname}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleFriendAction("delete", friend.friendId)
                        }
=======
                    <span>{friend.nickname}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFriendAction("delete", friend.friendId)}
>>>>>>> b504c1f (subscription)
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        삭제
                      </button>
                      <button
<<<<<<< HEAD
                        onClick={() =>
                          handleFriendAction("block", friend.friendId)
                        }
=======
                        onClick={() => handleFriendAction("block", friend.friendId)}
>>>>>>> b504c1f (subscription)
                        className="text-sm text-gray-500 hover:text-gray-600"
                      >
                        차단
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 오른쪽 컨트롤 */}
            <div className="flex flex-col w-2/3 items-center gap-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchNickname}
                  onChange={(e) => setSearchNickname(e.target.value)}
                  placeholder="닉네임 검색"
                  className="p-2 rounded-lg w-72 bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#5A3E2B]"
                />
                <button
                  onClick={handleSearchNickname}
                  className="px-4 py-2 bg-[#5A3E2B] text-white rounded-lg hover:bg-[#6B4F35] hover:scale-105 transition"
                >
                  검색
                </button>
                {searchResult?.exists && (
                  <button
                    onClick={() => handleFriendAction("request", searchResult.id)}
<<<<<<< HEAD
                    className={`px-4 py-2 rounded-lg text-sm text-white ${
                      searchResult.id === userId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 hover:scale-105 transition"
=======
                    className={`px-4 py-2 rounded-lg text-sm ${
                      searchResult.id === userId
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#ACD8AA] hover:bg-[#9CCB9A] hover:scale-105 transition"
>>>>>>> b504c1f (subscription)
                    }`}
                    disabled={searchResult.id === userId}
                  >
                    {searchResult.id === userId ? "자기 자신" : "친구 요청"}
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {["your_request", "blocked"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      fetchFriends(tab);
                    }}
<<<<<<< HEAD
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 ${
                      activeTab === tab
                        ? "bg-[#5A3E2B] text-white border-[#5A3E2B]"
                        : "bg-white text-[#5A3E2B] border-[#5A3E2B] hover:bg-[#5A3E2B] hover:text-white"
                    } transition`}
=======
                    className={`px-4 py-2 rounded-lg text-sm font-medium border border-[#5A3E2B] ${
                      activeTab === tab
                        ? "bg-[#5A3E2B] text-white"
                        : "bg-transparent text-[#5A3E2B] hover:bg-gray-100"
                    }`}
>>>>>>> b504c1f (subscription)
                  >
                    {tab === "your_request" ? "받은 요청" : "차단된 친구"}
                  </button>
                ))}
              </div>

              <div className="w-full h-[300px] overflow-y-auto bg-white rounded-xl p-4 shadow-md">
                <ul>
                  {activeTab === "your_request" &&
                    requests.map((request, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 rounded hover:bg-gray-100 transition"
                      >
<<<<<<< HEAD
                        <span className="text-gray-800">{request.nickname}</span>
                        <button
                          onClick={() =>
                            handleFriendAction("accept", request.friendId)
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
=======
                        <span>{request.nickname}</span>
                        <button
                          onClick={() => handleFriendAction("accept", request.friendId)}
                          className="px-3 py-1 bg-[#ACD8AA] text-white rounded hover:bg-[#9CCB9A]"
>>>>>>> b504c1f (subscription)
                        >
                          수락
                        </button>
                      </li>
                    ))}
<<<<<<< HEAD

=======
>>>>>>> b504c1f (subscription)
                  {activeTab === "blocked" &&
                    blocked.map((friend, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 rounded hover:bg-gray-100 transition"
                      >
<<<<<<< HEAD
                        <span className="text-gray-800">{friend.nickname}</span>
                        <button
                          onClick={() =>
                            handleFriendAction("unblock", friend.friendId)
                          }
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
=======
                        <span>{friend.nickname}</span>
                        <button
                          onClick={() => handleFriendAction("unblock", friend.friendId)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
>>>>>>> b504c1f (subscription)
                        >
                          차단 해제
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Friend;

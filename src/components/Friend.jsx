import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header"; // ✅ 헤더 추가


const Friend = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // ✅ 로그인된 userId 가져오기

  useEffect(() => {
    if (!userId) {
      console.warn("🚨 로그인 정보 없음. 로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  }, [userId, navigate]);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [searchNickname, setSearchNickname] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [activeTab, setActiveTab] = useState("friends");

  // ✅ 친구 목록 가져오기 (친구, 받은 요청, 차단된 친구)
  const fetchFriends = async (type) => {
    if (!userId) return;
  
    try {
      const response = await axios.get(
        `http://api.puzzlelog.me/friends/${userId}/friends?type=${type}&size=20`
      );
  
      console.log(`📌 ${type} 응답:`, response.data); // ✅ 응답 확인 로그 추가
  
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
          default:
            break;
        }
      }
    } catch (error) {
      console.error(`❌ ${type} 목록 로드 실패:`, error);
    }
  };
  useEffect(() => {
    console.log("📌 받은 요청 목록:", requests); // ✅ 받은 요청이 제대로 저장되는지 확인
  }, [requests]);
  
  useEffect(() => {
    fetchFriends("friends");
  }, [userId]);

  // ✅ 닉네임 검색 기능
  const handleSearchNickname = async () => {
    if (!searchNickname) return alert("닉네임을 입력하세요!");

    try {
      const response = await axios.get(
        `http://api.puzzlelog.me/users?nickname=${searchNickname}`
      );

      if (response.data.success && response.data.data.users.length > 0) {
        const userData = response.data.data.users[0];
        setSearchResult({ exists: true, id: userData.userId, nickname: searchNickname });
      } else {
        setSearchResult({ exists: false });
      }
    } catch (error) {
      console.error("❌ 닉네임 검색 실패:", error);
      setSearchResult({ exists: false });
    }
  };

  // ✅ 친구 관련 액션 함수 (친구 요청, 수락, 삭제, 차단, 차단 해제)
  const handleFriendAction = async (action, friendId) => {
    if (!friendId) return alert("친구 ID가 필요합니다.");

    try {
      let url = "";
      let method = "";

      switch (action) {
        case "request": // 친구 요청 보내기
          url = `http://api.puzzlelog.me/friends/${userId}/friends/${friendId}`;
          method = "POST";
          break;
        case "accept": // 친구 요청 수락
          url = `http://api.puzzlelog.me/friends/${userId}/requests/${friendId}/accept`;
          method = "PATCH";
          break;
        case "delete": // 친구 삭제
          url = `http://api.puzzlelog.me/friends/${userId}/deactivate/${friendId}`;
          method = "DELETE";
          break;
        case "block": // 친구 차단
          url = `http://api.puzzlelog.me/friends/${userId}/friends/${friendId}/block`;
          method = "PATCH";
          break;
        case "unblock": // 친구 차단 해제
          url = `http://api.puzzlelog.me/friends/${userId}/friends/${friendId}/unblock`;
          method = "PATCH";
          break;
        default:
          return;
      }

      const response = await axios({ method, url });

      if (response.data.success) {
        alert(response.data.message);
        fetchFriends(activeTab);
      } else {
        alert(response.data.message || "❌ 요청을 처리하는 데 실패했습니다.");
      }
    } catch (error) {
      console.error(`❌ ${action} 요청 오류:`, error);
    }
  };

  return (
    <>
      <Header /> {/* ✅ 헤더 유지 */}
      <div className="min-h-screen bg-[#FAF3E0] flex flex-col items-center justify-start mt-12">

        <br/>
        <br/>
        <br/>
        
        {/* 컨테이너: 왼쪽 친구 목록, 오른쪽 컨트롤 */}
        <div className="flex w-full max-w-4xl gap-6 px-4">
          
          {/* 🔥 왼쪽 친구 목록 (스크롤 가능) */}
          <div className="w-1/3 bg-white rounded-lg shadow-lg p-4 h-[400px] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">친구 목록</h2>
            <ul>
              {friends.map((friend, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 px-3 border-b border-gray-200 rounded-lg bg-white shadow-md hover:bg-gray-50 transition"
                >
                  <span className="text-gray-700">{friend.nickname}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFriendAction("delete", friend.friendId)}
                      className="text-sm text-red-500 hover:text-red-600 hover:scale-105 active:scale-95 transition-transform"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => handleFriendAction("block", friend.friendId)}
                      className="text-sm text-gray-500 hover:text-gray-600 hover:scale-105 active:scale-95 transition-transform"
                    >
                      차단
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
  
          {/* 🔥 오른쪽 컨트롤 영역 */}
          <div className="flex flex-col items-center w-2/3">
            
            {/* 닉네임 검색 및 친구 요청 버튼 */}
            <div className="flex items-center gap-3 mb-6">
              <input
                type="text"
                placeholder="닉네임 입력"
                value={searchNickname}
                onChange={(e) => setSearchNickname(e.target.value)}
                className="text-base p-2 w-72 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B] transition-all"
              />
              <button
                onClick={handleSearchNickname}
                className="px-4 py-2 bg-[#5A3E2B] text-white rounded-lg hover:bg-[#6B4A35] hover:scale-105 active:scale-95 transition-transform"
              >
                검색
              </button>
  
              {/* 친구 요청 버튼을 오른쪽에 배치 */}
              {searchResult?.exists && (
                <button
                  onClick={() => handleFriendAction("request", searchResult.id)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    searchResult.id === userId
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#ACD8AA] hover:bg-[#9CCB9A] hover:scale-105 active:scale-95 transition-transform"
                  }`}
                  disabled={searchResult.id === userId}
                >
                  {searchResult.id === userId ? "자기 자신에게 요청 불가" : "친구 요청 보내기"}
                </button>
              )}
            </div>
  
            {/* 탭 버튼 */}
            <div className="flex gap-3 mt-6">
              {["your_request", "blocked"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    fetchFriends(tab);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border border-[#5A3E2B] ${
                    activeTab === tab
                      ? "bg-[#5A3E2B] text-white border-transparent"
                      : "bg-transparent text-[#5A3E2B] hover:bg-gray-100 transition-colors"
                  }`}
                >
                  {tab === "your_request" ? "받은 요청" : "차단된 친구"}
                </button>
              ))}
            </div>
  
            {/* 🔥 받은 요청 및 차단된 친구 목록 (스크롤 가능) */}
            <div className="w-full h-[400px] overflow-y-auto mt-6">
              <ul>
                {activeTab === "your_request" &&
                  requests.map((request, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md my-2 hover:bg-gray-50 transition"
                    >
                      <span className="text-gray-700">{request.nickname}</span>
                      <button
                        onClick={() => handleFriendAction("accept", request.friendId)}
                        className="px-3 py-1 bg-[#ACD8AA] text-sm text-white rounded-lg hover:bg-[#9CCB9A] hover:scale-105 active:scale-95 transition-transform"
                      >
                        수락
                      </button>
                    </li>
                  ))}
                
                {activeTab === "blocked" &&
                  blocked.map((friend, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md my-2 hover:bg-gray-50 transition"
                    >
                      <span className="text-gray-700">{friend.nickname}</span>
                      <button
                        onClick={() => handleFriendAction("unblock", friend.friendId)}
                        className="px-3 py-1 bg-gray-500 text-sm text-white rounded-lg hover:bg-gray-600 hover:scale-105 active:scale-95 transition-transform"
                      >
                        차단 해제
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default Friend;
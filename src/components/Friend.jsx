import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Friend = () => {
    const [friends, setFriends] = useState([]);
    const [searchNickname, setSearchNickname] = useState("");
    const userId = localStorage.getItem("userId"); // ✅ 로그인한 사용자 ID 가져오기
    const navigate = useNavigate();

    // 친구 목록 불러오기
    useEffect(() => {
        if (!userId) return;
        
        fetch(`http://localhost:8080/api/friendlist/list?userId=${userId}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => setFriends(data))
            .catch(error => console.error("Error fetching friends:", error));
    }, [userId]);

    // 친구 요청 보내기
    const sendFriendRequest = () => {
        if (!searchNickname) return alert("친구 닉네임을 입력하세요!");

        fetch(`http://localhost:8080/api/friendlist/request?userId=${userId}&friendId=${searchNickname}`, {
            method: "POST",
        })
        .then(response => response.text())
        .then(message => alert(message))
        .catch(error => console.error("Error sending friend request:", error));
    };

    // 친구 요청 수락
    const acceptFriendRequest = () => {
        if (!searchNickname) return alert("친구 닉네임을 입력하세요!");

        fetch(`http://localhost:8080/api/friendlist/accept?userId=${userId}&friendId=${searchNickname}`, {
            method: "POST",
        })
        .then(response => response.text())
        .then(message => alert(message))
        .catch(error => console.error("Error accepting friend request:", error));
    };

    // 친구 삭제
    const deleteFriend = () => {
        if (!searchNickname) return alert("친구 닉네임을 입력하세요!");

        fetch(`http://localhost:8080/api/friendlist/deactivate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, friendId: searchNickname }),
        })
        .then(response => response.text())
        .then(message => alert(message))
        .catch(error => console.error("Error deleting friend:", error));
    };

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#FAF3E0] flex flex-col items-center">
            {/* ✅ 공통 헤더 ✅ */}
            <header className="w-full flex justify-between items-center px-10 py-4">
        {/* ✅ 로고 이미지 (홈으로 이동) ✅ */}
        <img
          src="/logo.png"
          alt="PuzzleLog Logo"
          className="w-36 cursor-pointer"
          onClick={() => navigate("/home")}
        />

        <nav className="flex gap-6 text-sm">
          <a href="/makePiece" className="hover:underline">조각 쓰기</a>
          <a href="#" className="hover:underline">일기장 쓰기</a>
          <a href="#" className="hover:underline">감정 캘린더</a>
          <a href="#" className="hover:underline">커뮤니티</a>
          <a href="#" className="hover:underline">모음집</a>
          <a href="/myPage" className="hover:underline">마이페이지</a>
        </nav>

        <button
          onClick={handleLogout}
          className="px-6 py-2 border border-[#6B4F35] text-[#6B4F35] rounded-md"
        >
          로그아웃
        </button>
      </header>
        
            {/* ✅ 본문 ✅ */}
            <main className="flex flex-col items-center justify-center w-full max-w-3xl p-6">
                <h1 className="text-3xl font-bold mb-6">친구 관리</h1>

                {/* 닉네임 검색 */}
                <input
                    type="text"
                    placeholder="친구 닉네임 입력"
                    value={searchNickname}
                    onChange={(e) => setSearchNickname(e.target.value)}
                    className="text-lg p-2 w-64 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                />

                {/* 친구 요청 / 수락 / 삭제 버튼 */}
                <div className="flex gap-4 mb-5">
                    <button 
                        onClick={sendFriendRequest} 
                        className="px-4 py-2 border border-[#4CAF50] text-[#4CAF50] rounded-md hover:bg-[#4CAF50] hover:text-white transition"
                    >
                        친구 요청
                    </button>
                    <button 
                        onClick={acceptFriendRequest} 
                        className="px-4 py-2 border border-[#2196F3] text-[#2196F3] rounded-md hover:bg-[#2196F3] hover:text-white transition"
                    >
                        요청 수락
                    </button>
                    <button 
                        onClick={deleteFriend} 
                        className="px-4 py-2 border border-[#f44336] text-[#f44336] rounded-md hover:bg-[#f44336] hover:text-white transition"
                    >
                        친구 삭제
                    </button>
                </div>

                {/* 친구 목록 */}
                <h2 className="text-xl font-semibold">내 친구 목록</h2>
                <ul className="list-none p-0 mt-3 text-lg">
                    {friends.length > 0 ? (
                        friends.map((friend) => (
                            <li key={friend.id} className="text-gray-700 my-2">
                                {friend.nickname} 
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">친구가 없습니다.</p>
                    )}
                </ul>

                {/* 홈으로 이동 버튼 */}
                <button 
                    onClick={() => navigate("/home")} 
                    className="mt-6 px-6 py-2 bg-[#5A3E2B] text-white rounded-md hover:bg-[#3A251B] transition"
                >
                    홈으로 가기
                </button>
            </main>
        </div>
    );
};

export default Friend;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

// CommunityPage에서 사용한 오로라 애니메이션 및 글로우 스타일
const auroraStyle = `
@keyframes aurora {
  0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
  50% { transform: translateX(100%) rotate(10deg); opacity: 0.5; }
  100% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
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

const InvitationList = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState("");

  // 받은 초대 목록 조회
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const res = await axios.get(
          "https://api.puzzlelog.me/invitations?type=my_request",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        const allInvitations = res.data.data || [];

        // 'REJECTED' 상태인 초대는 제외
        const filtered = allInvitations.filter(
          (inv) => inv.status !== "REJECTED" && inv.status !== "ACCEPTED"
        );
        setInvitations(filtered);
      } catch (err) {
        console.error("초대 목록 불러오기 실패:", err);
        setError(
          "초대 목록을 불러오는 데 실패했습니다: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    if (accessToken) fetchInvitations();
    else setError("로그인이 필요합니다.");
  }, [accessToken]);

  // 초대 수락 처리
  const handleAccept = async (invitationId, diaryId) => {
    try {
      await axios.patch(
        `https://api.puzzlelog.me/invitations/${invitationId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      alert("초대를 수락했습니다.");
      setInvitations((prev) =>
        prev.filter((inv) => inv.invitationId !== invitationId)
      );
      navigate(`/collaborative-diary/${diaryId}`); // 수락 후 일기 페이지로 이동
    } catch (err) {
      console.error("초대 수락 실패:", err);
      alert(
        "초대 수락에 실패했습니다: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // 초대 거절 처리
  const handleReject = async (invitationId) => {
    try {
      await axios.patch(
        `https://api.puzzlelog.me/invitations/${invitationId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      alert("초대를 거절했습니다.");
      setInvitations((prev) =>
        prev.filter((inv) => inv.invitationId !== invitationId)
      );
    } catch (err) {
      console.error("초대 거절 실패:", err);
      alert(
        "초대 거절에 실패했습니다: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <>
      {/* 오로라 애니메이션 스타일 주입 */}
      <style>{auroraStyle}</style>

      {/* 배경: CommunityPage와 동일한 그라디언트 */}
      <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300 font-cafe24">
        <Header />

        {/* 메인 컨테이너 */}
        <main className="mt-40 w-full max-w-3xl mx-auto flex flex-col items-center px-4">
          <div
            className="rounded-lg shadow-2xl shadow-indigo-500/50 p-8 w-full"
            style={{ animation: "pulseGlow2 3s infinite", background: "rgba(255, 255, 255, 0.1)" }}
          >
            <h2 className="text-3xl font-bold text-[#5A3E2B] mb-6 text-center">
              받은 초대 목록
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {invitations.length === 0 ? (
              <p className="text-center text-gray-500">받은 초대가 없습니다.</p>
            ) : (
              <ul className="space-y-4">
                {invitations.map((invitation) => (
                  <li
                  key={invitation.invitationId}
                  className="p-4 rounded-lg shadow flex justify-between items-center"
                  style={{ background: "rgba(255, 255, 255, 0.1)" }}
                >
                  <div>
                    <p className="font-medium">
                      날짜:{" "}
                      {new Date(invitation.diaryDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      보낸 사람: {invitation.senderId}
                    </p>
                    <p className="text-sm text-gray-500">
                      상태: {invitation.status}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(invitation.invitationId, invitation.diaryId)}
                      className="px-6 py-2 hover:bg-white border border-white bg-white/20 text-gray rounded-md text-lg hover:text-gray transition-all duration-300 hover:border-transparent hover:scale-105"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => handleReject(invitation.invitationId)}
                      className="px-6 py-2 hover:bg-white border border-white bg-white/20 text-gray rounded-md text-lg hover:text-gray transition-all duration-300 hover:border-transparent hover:scale-105"
                    >
                      거절
                    </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default InvitationList;

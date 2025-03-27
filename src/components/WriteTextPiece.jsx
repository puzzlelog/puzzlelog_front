import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const API_BASE_URL = "https://api.puzzlelog.me/pieces";

const WriteTextPiece = () => {
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!text.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const tagArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      const pieceData = {
        userId: userId,
        type: "TEXT",
        text: text,
        tags: tagArray,
        location: { type: "Point", coordinates: [127.0276, 37.4979] },
        isPrivate: false,
      };
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(pieceData)], { type: "application/json" }));
      const response = await fetch(API_BASE_URL, { method: "POST", body: formData });
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        alert("조각이 저장되었습니다.");
        setText("");
        setTags("");
        navigate("/makePiece");
      } else {
        alert(result.message || "저장에 실패했습니다.");
      }
    } catch {
      alert("서버 오류로 인해 저장할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">

        {/* 헤더 추가 */}
        <Header />

        <main className="mt-44 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
          <div className="text-center">

            <h2 className="text-4xl font-bold text-center text-[#6B4F35] mb-6">Text Piece</h2>

            <div 
              className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl"
              style={{
                animation: "pulseGlow2 3s infinite",
                display: "flex",
                flexDirection: "column", // Flexbox의 방향을 column으로 변경
                justifyContent: "center", // 중앙 정렬
                alignItems: "center", // 중앙 정렬
                background: "rgba(255, 255, 255, 0.2)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                transition: "all 0.3s ease",
                width: '100%', 
                maxWidth: '900px', 
                height: 'auto', 
                padding: '40px', 
            }}>
              <p className="text-lg text-gray-700 mb-4 text-center">당신의 감정과 생각을 자유롭게 남겨보세요. 이곳은 당신만의 공간입니다.</p>
              <textarea className="w-full p-4 border rounded-lg h-32 text-lg focus:outline-none focus:ring-2 focus:ring-white" placeholder="당신의 조각을 남겨보세요..." value={text} onChange={(e) => setText(e.target.value)} />
              <input className="w-full p-4 border rounded-lg text-lg mt-4 focus:outline-none focus:ring-2 focus:ring-white" placeholder="태그 입력 (쉼표로 구분)" value={tags} onChange={(e) => setTags(e.target.value)} />
              <div className="w-full flex justify-between mt-6">
                <button className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition hover:border-transparent hover:scale-105" style={{ backgroundColor: "rgba(169, 169, 169, 0.6)" }} onClick={() => navigate("/makePiece")}>뒤로가기</button>
                <button className={`px-6 py-2 rounded-lg text-white transition hover:border-transparent hover:scale-105 ${loading ? "bg-gray-400" : "bg-[#6A0DAD] hover:bg-[#7A3C98]"}`} 
                  style={{ backgroundColor: loading ? "rgba(169, 169, 169, 0.6)" : "rgba(116, 48, 183, 0.6)" }} onClick={handleSave} disabled={loading}>{loading ? "저장 중..." : "저장하기"}</button>
              </div>
            </div>

          </div>
        </main>

      </div>
    </>
  );
};

export default WriteTextPiece;

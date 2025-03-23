import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API_BASE_URL = "http://api.puzzlelog.me/pieces";

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
        content: text,
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
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      <Header />
      <main className="mt-20 w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-center text-[#6B4F35] mb-6">Text Piece</h2>
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-300">
          <p className="text-lg text-gray-700 mb-4 text-center">당신의 감정과 생각을 자유롭게 남겨보세요. 이곳은 당신만의 공간입니다.</p>
          <textarea className="w-full p-4 border rounded-lg h-32 text-lg focus:outline-none focus:ring-2 focus:ring-[#B99C75]" placeholder="당신의 조각을 남겨보세요..." value={text} onChange={(e) => setText(e.target.value)} />
          <input className="w-full p-4 border rounded-lg text-lg mt-4 focus:outline-none focus:ring-2 focus:ring-[#B99C75]" placeholder="태그 입력 (쉼표로 구분)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <div className="w-full flex justify-between mt-6">
            <button className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition" onClick={() => navigate("/makePiece")}>뒤로가기</button>
            <button className={`px-6 py-2 rounded-lg text-white transition ${loading ? "bg-gray-400" : "bg-[#B99C75] hover:bg-[#8C6A50]"}`} onClick={handleSave} disabled={loading}>{loading ? "저장 중..." : "저장하기"}</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteTextPiece;

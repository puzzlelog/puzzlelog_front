import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 

const WriteTextPiece = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleSave = () => {
    if (!text.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    console.log("저장된 데이터:", { text });

    alert("저장되었습니다.");
    setText("");
  };

  return (
    <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
      {/* Header 컴포넌트 추가 */}
      <Header handleLogout={handleLogout} />

      {/* 메인 영역 */}
      <main className="mt-20 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-center mb-6">
          텍스트 조각 작성
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <textarea
            className="w-full p-2 border rounded-md h-40"
            placeholder="당신의 조각을 남겨보세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="w-full flex justify-end">
            <button
              className="mt-4 px-6 py-2 bg-[#B99C75] text-white rounded-md hover:bg-[#8C6A50] transition"
              onClick={handleSave}
            >
              저장하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteTextPiece;

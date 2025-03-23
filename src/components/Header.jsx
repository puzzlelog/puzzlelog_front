import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("정말 로그아웃 하시겠습니까?");
    if (confirmLogout) {
      localStorage.removeItem("userId");
      navigate("/login");
    }
  };

  return (
    <header className="w-full flex justify-between items-center px-10 py-4 font-cafe bg-white bg-opacity-10 absolute top-0 left-0 z-50 shadow-md backdrop-blur-md">
      <img
        src="/logo.png"
        alt="PuzzleLog Logo"
        className="w-36 cursor-pointer"
        onClick={() => navigate("/home")}
      />

      <nav className="flex gap-14 text-lg tracking-wide relative">
        <a href="/makePiece" className="hover:underline text-white">조각 쓰기</a>

        {/* 일기 */}
        <div className="relative group">
          <button className="hover:underline text-white focus:outline-none">일기 쓰기</button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white bg-opacity-80 border border-gray-300 rounded-md shadow-md opacity-0 scale-y-0 origin-top group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-500 ease-in-out">
            <button 
              onClick={() => navigate("/pieceBoxMakeDiary", { state: { isTimeCapsule: false } })}
              className="block w-full text-center px-4 py-3 text-black hover:bg-gray-200 transition-all duration-500 ease-in-out"
            >
              나의 일기
            </button>
            <a href="/makeTogether" className="block px-4 py-3 text-center text-black hover:bg-gray-200 transition-all duration-500 ease-in-out">
              협업 일기
            </a>
          </div>
        </div>

        <a href="/calendar" className="hover:underline text-white">감정 캘린더</a>
        <a href="#" className="hover:underline text-white">커뮤니티</a>

        {/* 모음집 */}
        <div className="relative group">
          <button className="hover:underline text-white focus:outline-none">모음집</button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white bg-opacity-80 border border-gray-300 rounded-md shadow-md opacity-0 scale-y-0 origin-top group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-500 ease-in-out">
            <a href="/pieceBox" className="block px-4 py-3 text-center text-black hover:bg-gray-200 transition-all duration-500 ease-in-out">조각 모음집</a>
            <a href="/diaryBox" className="block px-4 py-3 text-center text-black hover:bg-gray-200 transition-all duration-500 ease-in-out">일기 모음집</a>
            <a href="/timeCapsuleBox" className="block px-4 py-3 text-center text-black hover:bg-gray-200 transition-all duration-500 ease-in-out">타임캡슐 모음집</a>
          </div>
        </div>

        {/* 마이페이지 */}
        <div className="relative group">
          <button className="hover:underline text-white focus:outline-none">마이페이지</button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white bg-opacity-80 border border-gray-300 rounded-md shadow-md opacity-0 scale-y-0 origin-top group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-500 ease-in-out">
            <a href="/myPage" className="block px-4 py-3 text-center text-black hover:bg-gray-200 transition-all duration-500 ease-in-out">내 정보</a>
            <a href="/digitalAlbum" className="block px-4 py-3 text-center text-black hover:bg-gray-200 transition-all duration-500 ease-in-out">디지털 앨범</a>
            <a href="/challenge" className="block px-4 py-3 text-center text-black hover:bg-gray-200 transition-all duration-500 ease-in-out">미션 챌린지</a>
            <a href="/subscribe" className="block px-4 py-3 text-center text-black hover:bg-gray-200 transition-all duration-500 ease-in-out">구독 정보</a>
          </div>
        </div>
      </nav>

      <button
        onClick={handleLogout}
        className="px-6 py-2 border border-white text-white rounded-md font-cafe24pretty text-lg hover:bg-gray-200 hover:text-black transition-all duration-300"
      >
        로그아웃
      </button>
    </header>
  );
};

export default Header;

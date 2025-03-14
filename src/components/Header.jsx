import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ handleLogout }) => {
    const navigate = useNavigate();

    return (
        <header className="w-full flex justify-between items-center px-10 py-4">
            <img
                src="/logo.png"
                alt="PuzzleLog Logo"
                className="w-36 cursor-pointer"
                onClick={() => navigate("/home")}
            />

            <nav className="flex gap-14 text-sm relative">
                <a href="/makePiece" className="hover:underline">조각 쓰기</a>

                {/* 일기 */}
                <div className="relative group">
                    <button className="hover:underline focus:outline-none">일기 쓰기</button>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-[#EADDC5] border border-gray-300 rounded-md shadow-md opacity-0 scale-y-0 origin-top group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-500 ease-in-out">
                        <a href="/makeDiary" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-50">나의 일기</a>
                        <a href="/makeTogether" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-[50ms]">협업 일기</a>
                    </div>
                </div>

                <a href="#" className="hover:underline">감정 캘린더</a>
                <a href="#" className="hover:underline">커뮤니티</a>

                {/* 모음집 */}
                <div className="relative group">
                    <button className="hover:underline focus:outline-none">모음집</button>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-[#EADDC5] border border-gray-300 rounded-md shadow-md opacity-0 scale-y-0 origin-top group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-500 ease-in-out">
                        <a href="/pieceBox" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-50">조각 모음집</a>
                        <a href="/diaryBox" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-[50ms]">일기 모음집</a>
                        <a href="/timeCapsuleBox" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-[50ms]">타임캡슐 모음집</a>
                    </div>
                </div>

                {/* 마이페이지 */}
                <div className="relative group">
                    <button className="hover:underline focus:outline-none">마이페이지</button>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-[#EADDC5] border border-gray-300 rounded-md shadow-md opacity-0 scale-y-0 origin-top group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-500 ease-in-out">
                        <a href="/myPage" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-50">내 정보</a>
                        <a href="/digitalAlbum" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-[50ms]">디지털 앨범</a>
                        <a href="/challenge" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-[50ms]">미션 챌린지</a>
                        <a href="/subscribe" className="block px-4 py-3 text-center text-black hover:bg-[#B99C75] transition-all duration-500 ease-in-out delay-[50ms]">구독 정보</a>
                    </div>
                </div>
            </nav>

            <button
                onClick={handleLogout}
                className="px-6 py-2 border border-[#6B4F35] text-[#6B4F35] rounded-md"
            >
                로그아웃
            </button>
        </header>
    );
};

export default Header;

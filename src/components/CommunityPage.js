import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CommunityPage = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/login");
    };

    const handleUploadClick = () => {
        navigate("/uploadPost");
    };

    const handleCommunityClick = () => {
        navigate("/postList");
    };

    return (
        <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
            {/* 헤더 영역  */}
            <header className="w-full flex justify-between items-center px-10 py-4">
                {/* 로고 이미지 */}
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

            <main className="mt-20 w-full max-w-[1550px]">

                {/* 두 div를 옆으로 배치, 가운데 정렬 */}
                <div className="flex gap-10 w-full justify-center items-center">
                    {/* 첫 번째 div */}
                    <div className="bg-[#FBF6F0] rounded-lg px-16 py-28 flex flex-col gap-20 items-start justify-center max-w-[2080px] w-[2080px] h-[630px]">
                        <div className="flex flex-col gap-12 items-start justify-start w-full">
                            <div className="text-[#0B0805] text-left text-4xl font-['Rowdies-Regular'] font-bold leading-[120%] tracking-[-0.01em] w-full">
                                함께 나누는 소중한 이야기
                            </div>
                            <div className="text-[#0B0805] text-left text-lg font-['Asap-Regular'] font-normal leading-[150%] w-full">
                                다른 사용자와 일기를 공유하고 소통하는 공간입니다. 함께 감정을 나누세요!
                            </div>
                            <div className="flex gap-4 items-start justify-start mt-20">
                                <button
                                    onClick={handleCommunityClick}
                                    className="text-white text-left font-medium text-base leading-[150%] relative px-6 py-2 bg-[#DEB784] rounded-md hover:bg-[#C89A60]">
                                        커뮤니티로 이동
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 두 번째 div */}
                    <div className="bg-[#DEB784] rounded-lg px-16 py-28 flex flex-col gap-20 items-start justify-center max-w-[2080px] w-[2080px] h-[630px]">
                        <div className="flex flex-col gap-12 items-start justify-start w-full">
                            <div className="text-white text-left text-4xl font-['Rowdies-Regular'] font-bold leading-[120%] tracking-[-0.01em] w-full">
                                당신의 이야기를 공유하세요
                            </div>
                            <div className="text-white text-left text-lg font-['Asap-Regular'] font-normal leading-[150%] w-full">
                                다른 사용자들과 함께 일기를 작성하고 소통하며 특별한 순간을 공유하세요.
                            </div>
                            <div className="flex gap-4 items-start justify-start mt-20">
                                <button
                                    onClick={handleUploadClick}
                                    className="text-white text-left font-medium text-base leading-[150%] relative px-6 py-2 bg-[#6B4F35] rounded-md hover:bg-[#8F6B47]">
                                        공유하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

        </div>
    );
};

export default CommunityPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

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
        <>
            <style>{auroraStyle}</style>
<<<<<<< HEAD
            <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
                <Header />

                <main className="mt-60 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">
                    {/* 두 div를 옆으로 배치, 가운데 정렬 */}
                    <div className="flex gap-12 w-full justify-center items-center">
                        {/* 첫 번째 div */}
                        <div
                            className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl transition-transform duration-300"
                            style={{
                                animation: "pulseGlow2 3s infinite",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "rgba(255, 255, 255, 0.1)",
                                width: "110%",
                                padding: "45px",
                            }}
                        >
                            <div className="flex flex-col gap-12 items-start justify-start w-full">
                                <div className="text-4xl font-bold text-white mb-6 text-center">
                                    함께 나누는 소중한 이야기
                                </div>
                                <div className="text-white text-left text-xl font-normal leading-[150%] w-full">
=======
            <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
                <Header />

                <main className="mt-60 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">

                    {/* 두 div를 옆으로 배치, 가운데 정렬 */}
                    <div className="flex gap-12 w-full justify-center items-center">
                        {/* 첫 번째 div */}
                        <div className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl transition-transform duration-300"
                            style={{
                                animation: "pulseGlow2 3s infinite",
                                display: "flex",
                                flexDirection: "column", // Flexbox의 방향을 column으로 변경
                                justifyContent: "center", // 중앙 정렬
                                alignItems: "center", // 중앙 정렬
                                background: "rgba(255, 255, 255, 0.1)", 
                                width: "110%",
                                padding: "45px"
                            }}>
                            <div className="flex flex-col gap-12 items-start justify-start w-full">
                                <div className="text-4xl font-bold text-[#5A3E2B] mb-6 text-center">
                                    함께 나누는 소중한 이야기
                                </div>
                                <div className="text-black text-left text-xl font-normal leading-[150%] w-full">
>>>>>>> b504c1f (subscription)
                                    다른 사용자와 일기를 공유하고 소통하는 공간입니다.<br /> 함께 감정을 나누세요!
                                </div>
                                <div className="flex gap-4 items-start justify-start mt-20">
                                    <button
                                        onClick={handleCommunityClick}
<<<<<<< HEAD
                                        className="px-6 py-2 border border-white bg-white/20 text-white rounded-md text-lg hover:bg-white hover:text-black transition-all duration-300 hover:border-transparent hover:scale-105"
                                    >
                                        커뮤니티로 이동
=======
                                        className="px-6 py-2 hover:bg-white border border-white bg-white/20 text-gray rounded-md text-lg hover:text-gray transition-all duration-300 transition hover:border-transparent hover:scale-105"
                                    >
                                            커뮤니티로 이동
>>>>>>> b504c1f (subscription)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 두 번째 div */}
<<<<<<< HEAD
                        <div
                            className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl transition-transform duration-300"
                            style={{
                                animation: "pulseGlow2 3s infinite",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "rgba(255, 255, 255, 0.1)",
                                width: "110%",
                                padding: "45px",
                            }}
                        >
                            <div className="flex flex-col gap-12 items-start justify-start w-full">
                                <div className="text-4xl font-bold text-white mb-6 text-center">
                                    당신의 이야기를 공유하세요
                                </div>
                                <div className="text-white text-left text-xl font-normal leading-[150%] w-full">
=======
                        <div className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl transition-transform duration-300"
                            style={{
                                animation: "pulseGlow2 3s infinite",
                                display: "flex",
                                flexDirection: "column", // Flexbox의 방향을 column으로 변경
                                justifyContent: "center", // 중앙 정렬
                                alignItems: "center", // 중앙 정렬
                                background: "rgba(255, 255, 255, 0.1)", 
                                width: "110%",
                                padding: "45px"
                            }}>
                            <div className="flex flex-col gap-12 items-start justify-start w-full">
                                <div className="text-4xl font-bold text-[#5A3E2B] mb-6 text-center">
                                    당신의 이야기를 공유하세요
                                </div>
                                <div className="text-black text-left text-xl font-normal leading-[150%] w-full">
>>>>>>> b504c1f (subscription)
                                    다른 사용자들과 함께 일기를 작성하고 소통하며<br /> 특별한 순간을 공유하세요.
                                </div>
                                <div className="flex gap-4 items-start justify-start mt-20">
                                    <button
                                        onClick={handleUploadClick}
<<<<<<< HEAD
                                        className="px-6 py-2 border border-white bg-white/20 text-white rounded-md text-lg hover:bg-white hover:text-black transition-all duration-300 hover:border-transparent hover:scale-105"
                                    >
                                        공유하기
=======
                                        className="px-6 py-2 hover:bg-white border border-white bg-white/20 text-gray rounded-md text-lg hover:text-gray transition-all duration-300 transition hover:border-transparent hover:scale-105"
                                    >
                                            공유하기
>>>>>>> b504c1f (subscription)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD
                </main>
=======

                </main>

>>>>>>> b504c1f (subscription)
            </div>
        </>
    );
};

<<<<<<< HEAD
export default CommunityPage;
=======
export default CommunityPage;
>>>>>>> b504c1f (subscription)

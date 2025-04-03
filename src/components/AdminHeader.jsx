import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
    const navigate = useNavigate();

    // 로그아웃 함수
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
                onClick={() => navigate("/adminPage")}
            />

            {/* 로그아웃 버튼 */}
            <button
                onClick={handleLogout}
                className="px-6 py-2 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105"
            >
                로그아웃
            </button>
        </header>
    );
};

export default AdminHeader;

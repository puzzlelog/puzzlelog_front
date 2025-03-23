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
        <header className="w-full bg-[#5A3E2B] flex justify-between items-center px-10 py-4 font-cafe shadow-md">
            <img
                src="/logo.png"
                alt="PuzzleLog Logo"
                className="w-36 cursor-pointer"
                onClick={() => navigate("/adminPage")}
            />

            {/* 로그아웃 버튼 */}
            <button
                onClick={handleLogout}
                className="px-6 py-2 border border-[#FAF3E0] text-[#FAF3E0] rounded-md font-cafe24pretty text-lg hover:bg-[#EADDC5] hover:text-[#5A3E2B] transition"
            >
                로그아웃
            </button>
        </header>
    );
};

export default AdminHeader;

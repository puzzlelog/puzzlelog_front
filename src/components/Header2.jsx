import React from "react";
import { useNavigate } from "react-router-dom";

const Header2 = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-between items-center px-10 py-4 font-cafe bg-white bg-opacity-10 absolute top-0 left-0 z-50 shadow-md backdrop-blur-md">
      <img
        src="/logo.png"
        alt="PuzzleLog Logo"
        className="w-36 cursor-pointer"
        onClick={() => navigate("/home")}
      />
        <div className="flex gap-4">
            
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105"
      >
        로그인
      </button>
      <button onClick={() => navigate("/signup")} className="px-6 py-2 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105">
            회원가입
          </button>

          </div>
    </header>
  );
};

export default Header2;

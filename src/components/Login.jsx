import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    userId: "",
    userPwd: "", 
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://api.puzzlelog.me/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });

        const result = await response.json();

        if (response.ok && result.success) {
            setMessage("로그인 성공!");


            localStorage.setItem("token", result.data.token);
            localStorage.setItem("userId", result.data.userId);

            let userRole = result.data.role;
            if (!userRole) {
                userRole = formData.userId.toLowerCase() === "admin" ? "ADMIN" : "USER";
            }
            localStorage.setItem("role", userRole);

            if (userRole === "ADMIN") {
                navigate("/adminPage");
            } else {
                navigate("/home");
            }
        } else {
            setMessage(result.message || "로그인 실패: 잘못된 로그인 정보입니다.");
        }
    } catch (error) {
        setMessage("로그인 실패: 서버 오류");
    }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF3E0]">
      <header className="w-full flex justify-between items-center p-6 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <h1 className="text-xl font-bold text-[#5A3E2B] cursor-pointer" onClick={() => navigate("/")}>
          조각 모음집
        </h1>
        <div>
          <button onClick={() => navigate("/login")} className="px-4 py-2 border border-[#5A3E2B] text-[#5A3E2B] rounded-md hover:bg-[#5A3E2B] hover:text-white transition">
            로그인
          </button>
          <button onClick={() => navigate("/signup")} className="ml-3 px-4 py-2 bg-[#C69C6D] text-white rounded-md hover:bg-[#A87952] transition">
            회원가입
          </button>
        </div>
      </header>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-10">
        <h2 className="text-2xl font-bold text-[#5A3E2B] mb-6 text-center">로그인</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5A3E2B]">아이디</label>
            <input
              type="text"
              name="userId"
              placeholder="아이디 입력"
              value={formData.userId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C69C6D]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A3E2B]">비밀번호</label>
            <input
              type="password"
              name="userPwd" 
              placeholder="비밀번호 입력"
              value={formData.userPwd}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C69C6D]"
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#C69C6D] text-white py-3 rounded-md hover:bg-[#A87952] transition">
            로그인
          </button>
        </form>

        {message && <p className="mt-4 text-center text-[#5A3E2B] font-medium">{message}</p>}
      </div>

      <footer className="mt-10 p-6 text-center text-[#5A3E2B]">
        © 2025 조각 모음집. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
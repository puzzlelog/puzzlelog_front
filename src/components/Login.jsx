import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header2 from "./Header2";

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
    setMessage("");

    try {
      const response = await axios.post(
        "http://api.puzzlelog.me/users/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 백엔드에서 쿠키를 설정하는 경우 필요
        }
      );

      if (response.data.success) {
        setMessage("로그인 성공!");

        // 토큰과 사용자 정보를 localStorage에 저장 (키 이름 통일)
        localStorage.setItem("accessToken", response.data.data.token);
        localStorage.setItem("userId", response.data.data.userId);

        let userRole = response.data.data.role;
        if (!userRole) {
          userRole = formData.userId.toLowerCase() === "admin" ? "ADMIN" : "USER";
        }
        localStorage.setItem("role", userRole);

        // 역할에 따라 리다이렉트
        if (userRole === "ADMIN") {
          navigate("/adminPage");
        } else {
          navigate("/home");
        }
      } else {
        setMessage(response.data.message || "로그인 실패: 잘못된 로그인 정보입니다.");
      }
    } catch (error) {
      setMessage(
        "로그인 실패: " + (error.response?.data?.message || "서버 오류가 발생했습니다.")
      );
    }
  };

  return (
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
        <Header2 />

        <div className="w-full h-screen flex justify-center items-center">
          <div
            className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-col items-center justify-center text-xl w-full max-w-md p-10"
            style={{
              animation: "pulseGlow2 3s infinite",
              background: "rgba(255, 255, 255, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            <h2 className="text-4xl font-bold text-[#5A3E2B] mb-6 text-center">PuzzleLog</h2>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label className="block text-sm font-medium text-black">아이디</label>
                <input
                  type="text"
                  name="userId"
                  placeholder="아이디 입력"
                  value={formData.userId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">비밀번호</label>
                <input
                  type="password"
                  name="userPwd"
                  placeholder="비밀번호 입력"
                  value={formData.userPwd}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 hover:bg-white border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:text-black transition-all w-full duration-300 transition hover:border-transparent hover:scale-105"
              >
                로그인
              </button>
            </form>

            {message && (
              <p
                className={`mt-4 text-center font-medium ${
                  message.includes("성공") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
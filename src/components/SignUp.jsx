import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
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

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    userPwd: "",
    email: "",
    birthDate: "",
    gender: "MALE",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.userPwd || !formData.email) {
      setMessage("아이디, 비밀번호, 이메일은 필수 입력값입니다.");
      return;
    }

    try {
      // FormData 객체 생성
      const formDataToSend = new FormData();
      formDataToSend.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));

      const response = await fetch("http://api.puzzlelog.me/users", {
        method: "POST",
        body: formDataToSend,  // multipart/form-data 요청
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message || "회원가입 실패");
      } else {
        setMessage("회원가입 성공!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setMessage("회원가입 실패: 서버 오류");
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

            <h2 className="text-3xl font-bold text-[#5A3E2B] mb-6 text-center">회원가입</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="userId" placeholder="아이디" value={formData.userId} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white" />
              <input type="password" name="userPwd" placeholder="비밀번호" value={formData.userPwd} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white" />
              <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white" />
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white" />
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white">
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
              <button type="submit" className="px-6 py-2 hover:bg-white border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:text-black transition-all w-full duration-300 transition hover:border-transparent hover:scale-105">회원가입</button>
            </form>
            {message && <p className="mt-4 text-center text-[#5A3E2B] font-medium">{message}</p>}
        
          </div>
        </div>

      </div>
    </>
  );
};

export default SignUp;

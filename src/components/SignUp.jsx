import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF3E0]">
      <header className="w-full flex justify-between items-center p-6 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <h1 className="text-xl font-bold text-[#5A3E2B] cursor-pointer" onClick={() => navigate("/")}>조각 모음집</h1>
      </header>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-20">
        <h2 className="text-2xl font-bold text-[#5A3E2B] mb-6 text-center">회원가입</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="userId" placeholder="아이디" value={formData.userId} onChange={handleChange} required className="w-full p-3 border rounded-md" />
          <input type="password" name="userPwd" placeholder="비밀번호" value={formData.userPwd} onChange={handleChange} required className="w-full p-3 border rounded-md" />
          <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full p-3 border rounded-md" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-md">
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>
          <button type="submit" className="w-full bg-[#C69C6D] text-white py-3 rounded-md hover:bg-[#A87952]">회원가입</button>
        </form>
        {message && <p className="mt-4 text-center text-[#5A3E2B] font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default SignUp;

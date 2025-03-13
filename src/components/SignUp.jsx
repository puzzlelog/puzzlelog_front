import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 Hook 추가

const SignUp = () => {
  const navigate = useNavigate(); // 네비게이션 함수 사용

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    email: "",
    nickname: "",
    birthDate: "",
    gender: "MALE",
    profileImg: "",
  });
  

  const [previewImg, setPreviewImg] = useState(null);
  const [message, setMessage] = useState(""); // 회원가입 결과 메시지

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
        setFormData({ ...formData, profileImg: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("회원가입 요청 데이터:", formData);
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });    

      const result = await response.text();
      console.log("서버 응답:", result);

      if (response.status === 400) {
        setMessage(result);
      } else if (response.ok) {
        setMessage("회원가입 성공!");
        setTimeout(() => {
          navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
        }, 1500);
      } else {
        setMessage("회원가입 실패: 서버 오류");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      setMessage("회원가입 실패: 서버 오류");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF3E0]">
      {/* 상단 네비게이션 */}
      <header className="w-full flex justify-between items-center p-6 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <h1 className="text-xl font-bold text-[#5A3E2B] cursor-pointer" onClick={() => navigate("/")}>
          조각 모음집
        </h1>
        <div>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-[#5A3E2B] text-[#5A3E2B] rounded-md hover:bg-[#5A3E2B] hover:text-white transition"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="ml-3 px-4 py-2 bg-[#C69C6D] text-white rounded-md hover:bg-[#A87952] transition"
          >
            회원가입
          </button>
        </div>
      </header>

      {/* 회원가입 카드 */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-20">
        <h2 className="text-2xl font-bold text-[#5A3E2B] mb-6 text-center">회원가입</h2>

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
              name="password"
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C69C6D]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A3E2B]">이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일 입력"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C69C6D]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A3E2B]">닉네임</label>
            <input
              type="text"
              name="nickname"
              placeholder="닉네임 입력"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C69C6D]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A3E2B]">생년월일</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C69C6D]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A3E2B]">성별</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C69C6D]"
            >
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A3E2B]">프로필 사진</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-3 border border-gray-300 rounded-md" />
            {previewImg && <img src={previewImg} alt="프로필 미리보기" className="mt-2 w-24 h-24 rounded-full mx-auto" />}
          </div>

          <button type="submit" className="w-full bg-[#C69C6D] text-white py-3 rounded-md hover:bg-[#A87952] transition">
            회원가입
          </button>
        </form>

        {message && <p className="mt-4 text-center text-[#5A3E2B] font-medium">{message}</p>}
      </div>

      {/* 하단 Footer */}
      <footer className="mt-10 p-6 text-center text-[#5A3E2B]">© 2025 조각 모음집. All rights reserved.</footer>
    </div>
  );
};

export default SignUp;

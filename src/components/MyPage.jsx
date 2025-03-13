import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    nickname: "",
    email: "",
    birthDate: "",
    gender: "",
    profileImg: "",
  });

  const [errors, setErrors] = useState({ nickname: "", email: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/getMyInfo?userId=${userId}`);
        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch {
          throw new Error("서버에서 올바른 JSON 응답을 받지 못했습니다.");
        }

        if (response.ok) {
          setUser(result);
          setUpdatedUser({
            nickname: result.nickname,
            email: result.email,
            birthDate: result.birthDate || "",
            gender: result.gender || "",
            profileImg: result.profileImg || "",
          });
        } else {
          alert(result.message || "사용자 정보를 불러오지 못했습니다.");
          navigate("/login");
        }
      } catch (error) {
        console.error("API 요청 오류:", error);
        alert("서버 오류 발생");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // 🔹 닉네임, 이메일 입력 시 중복 확인
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });

    try {
      if (name === "nickname") {
        const res = await fetch(`http://localhost:8080/api/checkByNickname?nickname=${value}`);
        const text = await res.text();
        setErrors((prev) => ({ ...prev, nickname: res.ok ? "" : text }));
      }

      if (name === "email") {
        const res = await fetch(`http://localhost:8080/api/checkByEmail?email=${value}`);
        const text = await res.text();
        setErrors((prev) => ({ ...prev, email: res.ok ? "" : text }));
      }
    } catch (error) {
      console.error(`${name === "nickname" ? "닉네임" : "이메일"} 중복 검사 오류:`, error);
    }
  };

  // 🔹 프로필 업데이트 API 호출
  const handleUpdate = async () => {
    if (!user || !user.num) return;

    // 중복 오류가 있을 경우 수정 불가
    if (errors.nickname || errors.email) {
      alert("⚠️ 중복된 닉네임 또는 이메일이 있습니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/updateMyInfo?num=${user.num}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const text = await response.text();
      if (response.ok) {
        alert("✅ 내 정보가 성공적으로 수정되었습니다.");
        setUser({ ...user, ...updatedUser });
        setEditMode(false);
      } else {
        alert(text || "⚠️ 수정 실패");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      alert("⚠️ 서버 오류 발생");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">불러오는 중...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF3E0]">
      <h1 className="text-2xl font-bold text-[#5A3E2B] mb-6">마이페이지</h1>

      {user ? (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          {/* 🔹 프로필 사진 */}
          {user.profileImg ? (
            <img 
              src={user.profileImg} 
              alt="프로필 사진" 
              className="w-24 h-24 rounded-full mx-auto border-4 border-[#C69C6D]" 
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
              기본이미지
            </div>
          )}

          {editMode ? (
            <>
              <input type="text" name="nickname" value={updatedUser.nickname} onChange={handleChange} className="w-full p-2 border rounded-md my-2" placeholder="닉네임 수정" />
              {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname}</p>}

              <input type="email" name="email" value={updatedUser.email} onChange={handleChange} className="w-full p-2 border rounded-md my-2" placeholder="이메일 수정" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input type="date" name="birthDate" value={updatedUser.birthDate} onChange={handleChange} className="w-full p-2 border rounded-md my-2" placeholder="생년월일 수정" />

              <select name="gender" value={updatedUser.gender} onChange={handleChange} className="w-full p-2 border rounded-md my-2">
                <option value="">성별 선택</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>

              <button onClick={handleUpdate} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition">수정 완료</button>
              <button onClick={() => setEditMode(false)} className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition">취소</button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#5A3E2B] mt-4">{user.nickname} 님</h2>
              <br/>
              <p className="text-gray-700 mb-2">아이디: {user.userId}</p>
              <p className="text-gray-700 mb-2">이메일: {user.email}</p>
              <p className="text-gray-700 mb-2">생년월일: {user.birthDate || "정보 없음"}</p>
              <p className="text-gray-700 mb-2">성별: {user.gender === "MALE" ? "남성" : "여성"}</p>
              <p className="text-gray-700 mb-2">계정 상태: {user.status === "ACTIVE" ? "✅ 활성" : "⚠️ 비활성"}</p>
              <button onClick={() => setEditMode(true)} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition">정보 수정</button>
            </>
          )}

          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition">로그아웃</button>
        </div>
      ) : (
        <p className="text-lg text-[#5A3E2B]">사용자 정보를 불러오지 못했습니다.</p>
      )}
    </div>
  );
};

export default MyPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

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

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    nickname: "",
    birthDate: "",
    gender: "",
    isAlarm: false,
  });
  const [profileImg, setProfileImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({ nickname: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    console.log("🔐 JWT 토큰:", token);
    console.log("🧪 Authorization 헤더:", `Bearer ${token}`);

    if (!userId || !token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          alert("로그인 정보가 부족합니다.");
          return;
        }

        const response = await axios.get(
          `https://api.puzzlelog.me/users?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("서버 응답:", response.data);

        if (response.data.success) {
          const userData = response.data.data.users[0];
          setUser(userData);
          setUpdatedUser({
            nickname: userData.nickname || "",
            birthDate: userData.birthDate || "",
            gender: userData.gender || "",
            isAlarm: userData.isAlarm || false,
          });

          setProfileImg(userData.profileImg);
          setPreviewImg(
            userData.profileImg || "https://via.placeholder.com/150?text=👤"
          );
        } else {
          alert(response.data.message || "사용자 정보를 불러오지 못했습니다.");
          navigate("/login");
        }
      } catch (error) {
        console.error("사용자 정보 불러오기 오류:", error);
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
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });

    if (name === "nickname") {
      try {
        const response = await axios.get(
          `https://api.puzzlelog.me/users/check?type=nickname&value=${value}`
        );

        if (response.data.success) {
          setErrors({ ...errors, nickname: "" });
        }
      } catch (error) {
        setErrors({ ...errors, nickname: "이미 존재하는 닉네임입니다." });
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreviewImg(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleUpdate = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    console.log("🔐 JWT 토큰:", token);

    if (!userId) {
      alert("사용자 ID가 없습니다. 로그인이 필요합니다.");
      return;
    }

    if (!token) {
      alert("JWT 토큰이 없습니다. 로그인이 필요합니다.");
      return;
    }

    if (errors.nickname) {
      alert("중복된 닉네임이 있습니다.");
      return;
    }

    try {
      const formData = new FormData();

      const data = {};

      if (updatedUser.nickname) {
        if (typeof updatedUser.nickname !== "string" || updatedUser.nickname.trim() === "") {
          alert("닉네임은 비어 있을 수 없습니다.");
          return;
        }
        data.nickname = updatedUser.nickname.trim();
      }

      if (updatedUser.birthDate) {
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!birthDateRegex.test(updatedUser.birthDate)) {
          alert("생년월일은 'YYYY-MM-DD' 형식이어야 합니다. (예: 2000-01-01)");
          return;
        }
        const date = new Date(updatedUser.birthDate);
        if (isNaN(date.getTime()) || date.getFullYear() < 1900 || date.getFullYear() > new Date().getFullYear()) {
          alert("유효하지 않은 생년월일입니다.");
          return;
        }
        data.birthDate = updatedUser.birthDate;
      }

      if (updatedUser.gender) {
        const validGenders = ["MALE", "FEMALE"];
        if (!validGenders.includes(updatedUser.gender)) {
          alert("성별은 'MALE' 또는 'FEMALE'이어야 합니다.");
          return;
        }
        data.gender = updatedUser.gender;
      }

      if (updatedUser.isAlarm !== undefined) {
        if (typeof updatedUser.isAlarm !== "boolean") {
          alert("알람 설정은 true 또는 false이어야 합니다.");
          return;
        }
        data.isAlarm = updatedUser.isAlarm;
      }

      if (Object.keys(data).length > 0) {
        const jsonString = JSON.stringify(data);
        console.log("JSON String to be sent:", jsonString);
        formData.append(
          "data",
          new Blob([jsonString], { type: "application/json; charset=UTF-8" }),
          "data.json"
        );
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
        if (value instanceof Blob) {
          const text = await value.text();
          console.log(`${key} (Blob content): ${text}`);
        }
      }

      const response = await axios.patch(
        `https://api.puzzlelog.me/users/me`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("내 정보가 성공적으로 수정되었습니다.");
        const newProfileImg =
          response.data.data.updatedFields?.profileImg?.after || profileImg;
        setUser({
          ...user,
          ...updatedUser,
          profileImg: newProfileImg,
        });
        setPreviewImg(newProfileImg);
        setEditMode(false);
      } else {
        alert(response.data.message || "수정 실패");
      }
    } catch (error) {
      console.error("정보 수정 오류:", error);
      if (error.response) {
        console.error("❗️서버 응답 내용:", error.response.data);
        alert(`수정 실패: ${error.response.data.message || "서버 오류 발생"}`);
      } else {
        alert("서버 오류 발생");
      }
    }
  };

  if (loading) return <p className="text-center mt-10 text-white">불러오는 중...</p>;

  return (
    <>
      <style>{auroraStyle}</style>

      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
        <Header />

        <main className="mt-44 w-full max-w-full font-cafe24 mx-auto flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-6">
              마이페이지
            </h1>

            {user ? (
              <div
                className="text-center bg-white p-6 rounded-lg shadow-lg w-full"
                style={{
                  animation: "pulseGlow2 3s infinite",
                  background: "rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s ease",
                  padding: "40px",
                  transformOrigin: "center",
                  width: "350px",
                }}
              >
                <img
                  src={previewImg}
                  alt="프로필"
                  className="w-32 h-32 rounded-full mx-auto mb-4 border"
                />

                {editMode ? (
                  <>
                    <div className="flex flex-col gap-4 mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded-md text-white bg-transparent"
                      />
                      <button
                        onClick={() => {
                          setProfileImg(null);
                          setPreviewImg(
                            "https://via.placeholder.com/150?text=👤"
                          );
                          setSelectedFile(null);
                        }}
                        className="px-6 py-2 border border-white bg-white/20 text-white rounded-md font-cafe24pretty hover:bg-white hover:text-black transition-all duration-300 hover:border-transparent hover:scale-105"
                      >
                        기본 이미지 사용
                      </button>
                    </div>

                    <input
                      type="text"
                      name="nickname"
                      value={updatedUser.nickname}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg text-lg text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-white placeholder-white"
                      placeholder="닉네임 수정"
                    />
                    {errors.nickname && (
                      <p className="text-red-500 text-sm">{errors.nickname}</p>
                    )}

                    <input
                      type="date"
                      name="birthDate"
                      value={updatedUser.birthDate}
                      onChange={handleChange}
                      className="w-full p-2 my-2 border rounded-lg text-lg text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-white"
                    />
                    <select
                      name="gender"
                      value={updatedUser.gender}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg text-lg text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      <option value="" className="text-black">성별 선택</option>
                      <option value="MALE" className="text-black">남성</option>
                      <option value="FEMALE" className="text-black">여성</option>
                    </select>
                    <label className="flex items-center gap-2 my-2 text-white">
                      <input
                        type="checkbox"
                        name="isAlarm"
                        checked={updatedUser.isAlarm}
                        onChange={(e) =>
                          setUpdatedUser({
                            ...updatedUser,
                            isAlarm: e.target.checked,
                          })
                        }
                      />
                      알람 설정
                    </label>

                    <button
                      onClick={handleUpdate}
                      className="px-6 py-2 rounded-lg text-white transition hover:border-transparent hover:scale-105 bg-[#6A0DAD] border hover:bg-[#7A3C98]"
                      style={{ backgroundColor: "rgba(116, 48, 183, 0.4)" }}
                    >
                      수정 완료
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mt-2 mb-4">
                      {user.nickname} 님
                    </h2>
                    <p className="text-white">아이디: {user.userId}</p>
                    <p className="text-white">이메일: {user.email}</p>
                    <p className="text-white">
                      생년월일: {user.birthDate || "정보 없음"}
                    </p>
                    <p className="text-white">
                      성별:{" "}
                      {user.gender === "MALE"
                        ? "남성"
                        : user.gender === "FEMALE"
                        ? "여성"
                        : "정보 없음"}
                    </p>
                    <p className="text-white">
                      알람 설정: {user.isAlarm ? "ON" : "OFF"}
                    </p>

                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-4 px-6 py-2 border border-white bg-white/20 text-white rounded-md font-cafe24pretty hover:bg-white hover:text-black transition-all duration-300 hover:border-transparent hover:scale-105"
                    >
                      정보 수정
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="text-lg text-white">
                사용자 정보를 불러오지 못했습니다.
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default MyPage;  
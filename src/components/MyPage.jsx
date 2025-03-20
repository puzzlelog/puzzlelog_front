import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [selectedFile, setSelectedFile] = useState(null); // 파일 선택 상태
  const [errors, setErrors] = useState({ nickname: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://api.puzzlelog.me/users?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const userData = response.data.data.users[0];
          setUser(userData);
          setUpdatedUser({
            nickname: userData.nickname || "",
            birthDate: userData.birthDate || "",
            gender: userData.gender || "",
            isAlarm: userData.isAlarm || false,
          });

          // 기존 프로필 이미지 유지
          setProfileImg(userData.profileImg);
          setPreviewImg(userData.profileImg || "https://via.placeholder.com/150?text=👤");
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
          `http://api.puzzlelog.me/users/check?type=nickname&value=${value}`
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
      setPreviewImg(URL.createObjectURL(file)); // 미리보기 업데이트
      setSelectedFile(file); // 선택된 파일 상태 업데이트
    }
  };

  const handleUpdate = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) return;

    if (errors.nickname) {
      alert("중복된 닉네임이 있습니다.");
      return;
    }

    try {
      const formData = new FormData();
      const data = JSON.stringify({
        nickname: updatedUser.nickname,
        birthDate: updatedUser.birthDate,
        gender: updatedUser.gender,
        isAlarm: updatedUser.isAlarm,
      });

      formData.append("data", new Blob([data], { type: "application/json" }));

      // 파일이 선택되었을 때만 새 파일을 추가, 그렇지 않으면 기존 이미지 유지
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else if (profileImg && profileImg !== "https://via.placeholder.com/150?text=👤") {
        // 기존 이미지를 유지하도록 서버에 전달 (서버가 이를 처리하도록 설계 필요)
        formData.append("keepProfileImg", "true"); // 서버에 유지 플래그 전달
      } else {
        // 기본 이미지로 설정하려는 경우
        formData.append("file", ""); // 서버가 기본 이미지로 처리하도록 명시
      }

      console.log("🔍 보낼 데이터:", formData);

      const response = await axios.patch(
        `http://api.puzzlelog.me/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("내 정보가 성공적으로 수정되었습니다.");

        // 서버에서 반환된 프로필 이미지가 있으면 업데이트, 없으면 기존 이미지 유지
        const newProfileImg = response.data.data.updatedFields?.profileImg?.after || profileImg;
        setUser({
          ...user,
          ...updatedUser,
          profileImg: newProfileImg,
        });

        // 미리보기 이미지도 유지
        setPreviewImg(newProfileImg);

        setEditMode(false);
      } else {
        alert(response.data.message || "수정 실패");
      }
    } catch (error) {
      console.error("정보 수정 오류:", error);
      alert("서버 오류 발생");
    }
  };

  if (loading) return <p className="text-center mt-10">불러오는 중...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF3E0]">
      <h1 className="text-2xl font-bold text-[#5A3E2B] mb-6">마이페이지</h1>

      {user ? (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          {/* 프로필 이미지 */}
          <img
            src={previewImg}
            alt="프로필"
            className="w-32 h-32 rounded-full mx-auto mb-4 border"
          />

          {editMode ? (
            <>
              {/* 파일 선택 및 기본 이미지 유지 버튼 */}
              <div className="flex flex-col gap-4 mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  onClick={() => {
                    setProfileImg(null);
                    setPreviewImg("https://via.placeholder.com/150?text=👤");
                    setSelectedFile(null); // 기본 이미지로 설정
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  기본 이미지 사용
                </button>
              </div>

              <input
                type="text"
                name="nickname"
                value={updatedUser.nickname}
                onChange={handleChange}
                className="w-full p-2 border rounded-md my-2"
                placeholder="닉네임 수정"
              />
              {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname}</p>}

              <input
                type="date"
                name="birthDate"
                value={updatedUser.birthDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md my-2"
              />
              <select
                name="gender"
                value={updatedUser.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded-md my-2"
              >
                <option value="">성별 선택</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
              <label className="flex items-center gap-2 my-2">
                <input
                  type="checkbox"
                  name="isAlarm"
                  checked={updatedUser.isAlarm}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, isAlarm: e.target.checked })
                  }
                />
                알람 설정
              </label>

              <button
                onClick={handleUpdate}
                className="mt-4 px-6 py-2 bg-[#E3C7A1] text-[#5A3E2B] rounded-md transition hover:bg-[#C4A383]"
              >
                수정 완료
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#5A3E2B] mt-2">{user.nickname} 님</h2>
              <p className="text-gray-700">아이디: {user.userId}</p>
              <p className="text-gray-700">이메일: {user.email}</p>
              <p className="text-gray-700">생년월일: {user.birthDate || "정보 없음"}</p>
              <p className="text-gray-700">
                성별: {user.gender === "MALE" ? "남성" : user.gender === "FEMALE" ? "여성" : "정보 없음"}
              </p>
              <p className="text-gray-700">알람 설정: {user.isAlarm ? "ON" : "OFF"}</p>

              <button
                onClick={() => setEditMode(true)}
                className="mt-4 px-6 py-2 border border-[#6B4F35] text-[#6B4F35] rounded-md hover:bg-[#6B4F35] hover:text-white transition"
              >
                정보 수정
              </button>
            </>
          )}
        </div>
      ) : (
        <p className="text-lg text-[#5A3E2B]">사용자 정보를 불러오지 못했습니다.</p>
      )}
    </div>
  );
};

export default MyPage;
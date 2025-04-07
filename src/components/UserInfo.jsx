import React, { useEffect, useState } from "react";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const userId = localStorage.getItem("userId"); // 로그인한 사용자 ID 가져오기

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch(`https://localhost:8080/api/getMyInfo?num=${userId}`);
=======
        const response = await fetch(`https://api.puzzlelog.me/api/getMyInfo?num=${userId}`);
>>>>>>> b504c1f (subscription)
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">내 정보</h2>
      {userInfo ? (
        <div>
          <p>이름: {userInfo.nickname}</p>
          <p>이메일: {userInfo.email}</p>
        </div>
      ) : (
        <p>정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default UserInfo;

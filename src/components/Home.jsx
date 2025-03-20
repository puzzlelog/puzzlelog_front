import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const natureStyle = `  
@keyframes waveBg {
  0% { background-position: 0% 50%; }
  33% { background-position: 25% 55%; }
  66% { background-position: 75% 45%; }
  100% { background-position: 0% 50%; }
}

@keyframes shimmerWave {
  0% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(1); }
}

@keyframes moveClouds {
  0% {
    transform: translateX(-150%); /* 화면 왼쪽 바깥 */
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(calc(100vw + 200px)); /* 화면 오른쪽 끝 넘어가기 */
    opacity: 0.2; /* 흐릿하게 보이도록 설정 */
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes softShake {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

body {
  background: linear-gradient(to bottom,rgb(197, 228, 233), rgb(135, 220, 215));
  background-size: 200% 200%;
  animation: waveBg 8s infinite alternate ease-in-out;
  overflow: hidden;
}

.shimmer-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  animation: shimmerWave 6s infinite alternate ease-in-out;
}

.container {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 1.5s ease-out;
  z-index: 2;
}

button:hover {
  animation: softShake 0.3s ease-in-out;
}

.cloud {
  position: absolute;
  width: 200px;
  height: 100px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 100px;
  box-shadow: 10px 10px 30px rgba(255, 255, 255, 0.8);
  animation: moveClouds 50s linear infinite; /* 지속시간을 50초로 변경 */
}
`;

const Home = () => {
    const [clouds, setClouds] = useState([]);
      
      // 구름 랜덤 생성 함수
      const generateClouds = () => {
        const numberOfClouds = 5; // 구름 개수 설정
        const newClouds = [];
        
        for (let i = 0; i < numberOfClouds; i++) {
          const topPosition = `${Math.random() * 100}%`; // 화면 상단에서 랜덤 위치
          const leftPosition = `${Math.random() * -300}px`; // 화면 왼쪽 밖에서 랜덤 시작
          const animationDuration = `${Math.random() * 30 + 30}s`; // 30~60초 랜덤 애니메이션 지속시간
          const cloudWidth = `${Math.random() * 200 + 150}px`; // 150~350px 사이 랜덤 크기
          const cloudOpacity = Math.random() * 0.3 + 0.4; // 0.4~0.7 사이 랜덤 불투명도
    
          newClouds.push({
            topPosition,
            leftPosition,
            animationDuration,
            cloudWidth,
            cloudOpacity
          });
        }
    
        setClouds(newClouds);
      };
    const navigate = useNavigate();
    const [showNicknamePopup, setShowNicknamePopup] = useState(false);
    const [nickname, setNickname] = useState("");
    const [profileImg, setProfileImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);
    const [nicknameMessage, setNicknameMessage] = useState("");
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    useEffect(() => {
        generateClouds();
        const checkNickname = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
    
            if (!userId || !token) {
                navigate("/login");
                return;
            }
    
            try {
                const response = await axios.get(`http://api.puzzlelog.me/users?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (response.data?.success) {
                    const userData = response.data?.data?.users?.[0] || {};
                    if (!userData.nickname) {
                        setShowNicknamePopup(true);
                    }
                }
            } catch (error) {
                console.error("닉네임 확인 중 오류 발생:", error);
            }
        };
    
        checkNickname();
    }, [navigate]);

    
    const checkNicknameAvailability = async () => {
        if (!nickname.trim()) {
            setNicknameMessage("닉네임을 입력해주세요.");
            setIsNicknameAvailable(false);
            setIsNicknameChecked(false);
            return;
        }

        setIsCheckingNickname(true);
        try {
            const response = await axios.get(`http://api.puzzlelog.me/users/check?type=nickname&value=${nickname}`);
            if (response.data.success) {
                setNicknameMessage("사용 가능한 닉네임입니다.");
                setIsNicknameAvailable(true);
                setIsNicknameChecked(true);
            } else {
                setNicknameMessage(response.data.message || "닉네임 중복 확인 실패");
                setIsNicknameAvailable(false);
                setIsNicknameChecked(false);
            }
        } catch (error) {
            setNicknameMessage("이미 존재하는 닉네임입니다.");
            setIsNicknameAvailable(false);
            setIsNicknameChecked(false);
        } finally {
            setIsCheckingNickname(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImg(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleNicknameSubmit = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
    
        if (!nickname.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }
    
        if (!isNicknameChecked || !isNicknameAvailable) {
            alert("닉네임 중복 확인을 완료해주세요.");
            return;
        }
    
        const data = {
            userId: userId,
            email: `${userId}@example.com`, 
            nickname: nickname,
            birthDate: "2000-01-01",
            gender: "MALE",
        };
    
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
    
        if (profileImg) {
            formData.append("file", profileImg);
        }
    
        try {
            const response = await fetch(`http://api.puzzlelog.me/users/${userId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
    
            const result = await response.json();
            console.log("🔍 PATCH 응답:", result);
    
            if (result.success) {
                alert("닉네임 및 프로필 설정 완료!");
                setShowNicknamePopup(false);
                localStorage.setItem("nickname", nickname);
            } else {
                alert("설정 실패: " + (result.message || "알 수 없는 오류"));
            }
        } catch (error) {
            alert("서버 오류로 인해 설정할 수 없습니다.");
        }
    };
    
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
         {/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}> */}
            <style>{natureStyle}</style>
            <style>
                {`
                .override-header * {
                    color: black !important;
                }
                `}
            </style>

            {/* 배경 효과 */}
            <div className="shimmer-layer"></div>

            {/* 구름 애니메이션 - 동적으로 구름 생성 */}
            {clouds.map((cloud, index) => (
                <div
                key={index}
                className="cloud"
                style={{
                    top: cloud.topPosition,
                    left: cloud.leftPosition,
                    animationDuration: cloud.animationDuration,
                    width: cloud.cloudWidth,
                    opacity: cloud.cloudOpacity,
                }}
                ></div>
            ))}

            <div className="override-header">
                <Header />
            </div>

            <div className="container max-w-md text-center">
                <h1 className="text-3xl font-bold text-green-800 animate-fadeInUp">🌱 PuzzleLog</h1>
                <p className="text-gray-700 mt-4">소중한 순간을 자연스럽게 기록하세요</p>
                <button className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
                시작하기
                </button>
            </div>

            {showNicknamePopup && (
                <div style={{
                    position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    backgroundColor: "white", padding: "20px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    borderRadius: "10px", textAlign: "center"
                }}>
                    <h2>닉네임 설정</h2>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="닉네임 입력"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            style={{ padding: "5px", fontSize: "18px" }}
                        />
                        <button onClick={checkNicknameAvailability} disabled={isCheckingNickname} style={{ fontSize: "16px", padding: "5px 10px", cursor: "pointer" }}>
                            중복 확인
                        </button>
                    </div>
                    {nicknameMessage && <p style={{ color: isNicknameAvailable ? "green" : "red" }}>{nicknameMessage}</p>}
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: "10px", padding: "5px", fontSize: "16px" }} />
                    <br />
                    <button
                        onClick={handleNicknameSubmit}
                        style={{ fontSize: "18px", padding: "8px 16px", cursor: "pointer", marginTop: "10px" }}
                        disabled={!isNicknameChecked || !isNicknameAvailable}
                    >
                        설정 완료
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
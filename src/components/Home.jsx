import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

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

const Home = () => {

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
        <>
            <style>{auroraStyle}</style>

            <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">

                {/* 헤더 추가 */}
                <Header />

                {/* 중앙 콘텐츠 */}
                {!showNicknamePopup && (
                    <div className="relative z-10 flex items-center justify-center w-full h-full text-white">
                        <div
                            className="w-84 h-84 bg-gradient-to-r rounded-full shadow-2xl shadow-indigo-500/50 flex items-center justify-center text-xl font-semibold"
                            style={{
                                width: "22rem",
                                height: "22rem",
                                animation: "pulseGlow 3s infinite"
                            }}
                        >
                            <span className="text-6xl font-bold animate-pulse mb-4">PuzzleLog</span>
                        </div>
                    </div>
                )}

                {showNicknamePopup && (
                    <div className="relative z-10 flex flex-row items-center justify-center w-full h-full text-black">
                        <div
                            className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl font-semibold"
                            style={{
                                width: "24rem",
                                height: "24rem",
                                animation: "pulseGlow2 3s infinite",
                                display: "flex",
                                flexDirection: "column", // Flexbox의 방향을 column으로 변경
                                justifyContent: "center", // 중앙 정렬
                                alignItems: "center", // 중앙 정렬
                                background: "rgba(255, 255, 255, 0.3)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                <h2 style={{ marginBottom: "20px" }}>닉네임 설정</h2>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <input
                                        type="text"
                                        placeholder="닉네임 입력"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        style={{
                                            padding: "5px",
                                            fontSize: "18px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            flex: 1,
                                        }}
                                    />
                                    <button
                                        onClick={checkNicknameAvailability}
                                        disabled={isCheckingNickname}
                                        style={{
                                            fontSize: "16px",
                                            padding: "5px 10px",
                                            cursor: "pointer",
                                            border: "1px solid white",
                                            backgroundColor: "transparent",
                                            color: "black",
                                            borderRadius: "4px",
                                            transition: "all 0.3s ease",
                                        }}
                                        className="hover:bg-blue-500 hover:text-white hover:border-transparent hover:scale-105"
                                    >
                                        중복 확인
                                    </button>
                                </div>
                                {nicknameMessage && <p style={{ color: isNicknameAvailable ? "green" : "red" }}>{nicknameMessage}</p>}
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: "10px", cursor: "pointer", padding: "5px", fontSize: "16px", marginLeft: "30px" }} />
                                <button
                                    onClick={handleNicknameSubmit}
                                    className="font-semobold text-lg px-4 py-2 cusor-pointer mt-8 text-black rounded-lg transition-all duration-300 ease-in-out transform hover:bg-white-100 hover:scale-105"
                                    disabled={!isNicknameChecked || !isNicknameAvailable}
                                >
                                    설정 완료
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default Home;
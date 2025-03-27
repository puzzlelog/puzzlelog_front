import React, { useState, useEffect } from "react";
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

const UploadPost = () => {
    const navigate = useNavigate();

    const [diaries, setDiaries] = useState([]);
    const [selectedDiary, setSelectedDiary] = useState(null);

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const userId = localStorage.getItem("userId"); // userId 가져오기

                if (!userId) {
                    console.error("로그인이 필요합니다.");
                    return;
                }
        
                const response = await axios.get('https://api.puzzlelog.me/diaries', { 
                    params: { userId }  // userId를 쿼리 파라미터로 전달
                });

                // 응답 데이터에서 diaries 배열만 추출
                if (response.data.data && Array.isArray(response.data.data.diaries)) {
                    setDiaries(response.data.data.diaries);
                } else {
                    setDiaries([]); // 기본값 설정
                }

            } catch (error) {
                console.error("일기 불러오기 실패 : ", error);
            }
        };

        fetchDiaries();
    }, []);

    const handleDiarySelection = (diary) => {
        setSelectedDiary(diary);
    }

    const handleUpload = async () => {
        if (!selectedDiary) {
            alert("일기를 선택해주세요.");
            return;
        }
    
        try {
            const userId = localStorage.getItem("userId");
            const content = selectedDiary.content;  // 일기의 내용을 가져오기
            const title = selectedDiary.title;
    
            // 서버에 업로드할 데이터 준비
            const response = await axios.post(
                'https://api.puzzlelog.me/api/posts',
                {
                    userId: userId, // userId 전달
                    content: content, // 일기 내용 전달
                    title: title
                },
                {
                    headers: {
                        'Content-Type': 'application/json',  // 요청 헤더에 Content-Type 추가
                    },
                }
            );
    
            // 성공적인 업로드 후, 메시지와 함께 커뮤니티 페이지로 이동
            alert("게시글이 성공적으로 업로드되었습니다.");
            navigate("/postList");
        } catch (error) {
            console.error("게시글 업로드 실패 : ", error.response?.data || error.message);
            alert("게시글 업로드에 실패했습니다.");
        }
    };
    
    
    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <>
            <style>{auroraStyle}</style>
            <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
                <Header />

                <main className="mt-60 w-full max-w-7xl font-cafe24 mx-auto flex justify-center items-center">

                    <div className="text-center flex flex-col items-center">
                        <div className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl"
                            style={{
                                animation: "pulseGlow2 3s infinite",
                                display: "flex",
                                flexDirection: "column", // Flexbox의 방향을 column으로 변경
                                justifyContent: "center", // 중앙 정렬
                                alignItems: "center", // 중앙 정렬
                                background: "rgba(255, 255, 255, 0.2)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                                transition: "all 0.3s ease",
                                width: '100%', 
                                maxWidth: '900px', 
                                height: 'auto', 
                                padding: '40px' }}
                        >
                            <h3 className="text-2lg font-semibold mb-5">모든 일기 목록</h3>
                            {diaries.length === 0 ? (
                                <p className="text-lg text-gray-700 mb-4 text-center">작성된 일기가 없습니다.</p>
                            ) : (
                                <div className="space-y-4">
                                    {diaries.map((diary) => (
                                        <div key={diary.id} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={diary.id}
                                                name="diary"
                                                value={diary.id}
                                                onChange={() => handleDiarySelection(diary)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={diary.id} className="cursor-pointer">
                                                {diary.title}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="w-full flex justify-between mt-4 gap-16">

                                <button
                                    className="px-4 py-2 bg-gray-400 text-white text-base rounded-lg hover:bg-gray-500 border transition hover:border-transparent hover:scale-105"
                                    style={{
                                        backgroundColor: "rgba(169, 169, 169, 0.6)",
                                    }}
                                    onClick={() => navigate(-1)}
                                >
                                    뒤로가기
                                </button>

                                <button
                                    onClick={handleUpload}
                                    className="px-4 py-2 rounded-lg text-white transition text-base hover:border-transparent hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98] border"
                                    style={{
                                        backgroundColor: "rgba(116, 48, 183, 0.6)",
                                    }}
                                >
                                    업로드
                                </button>
                            </div>
                        </div>

                    </div>

                </main>

            </div>
        </>
    );
};

export default UploadPost;

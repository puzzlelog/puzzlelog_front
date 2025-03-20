import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadPost = () => {
    const navigate = useNavigate();

    const [diaries, setDiaries] = useState([]);
    const [selectedDiary, setSelectedDiary] = useState(null);

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                // const userId = localStorage.getItem("userId"); // userId 가져오기
                const userId = 1;

                if (!userId) {
                    console.error("로그인이 필요합니다.");
                    return;
                }
        
                const response = await axios.get('http://localhost:8080/api/getDiary', { 
                    params: { userId }  // userId를 쿼리 파라미터로 전달
                });
                setDiaries(response.data);
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
            const userId = 1;  // 실제 userId는 로그인 상태에서 가져와야 함
            const content = selectedDiary.content;  // 일기의 내용을 가져오기
            const title = selectedDiary.title;
    
            // 서버에 업로드할 데이터 준비
            const response = await axios.post(
                'http://localhost:8080/api/posts',
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
        <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
            {/* 헤더 영역  */}
            <header className="w-full flex justify-between items-center px-10 py-4">
                {/* 로고 이미지 */}
                <img
                    src="/logo.png"
                    alt="PuzzleLog Logo"
                    className="w-36 cursor-pointer"
                    onClick={() => navigate("/home")}
                />

                <nav className="flex gap-6 text-sm">
                    <a href="/makePiece" className="hover:underline">조각 쓰기</a>
                    <a href="#" className="hover:underline">일기장 쓰기</a>
                    <a href="#" className="hover:underline">감정 캘린더</a>
                    <a href="#" className="hover:underline">커뮤니티</a>
                    <a href="#" className="hover:underline">모음집</a>
                    <a href="/myPage" className="hover:underline">마이페이지</a>
                </nav>

                <button
                    onClick={handleLogout}
                    className="px-6 py-2 border border-[#6B4F35] text-[#6B4F35] rounded-md"
                    >
                    로그아웃
                </button>
            </header>

            <main className="mt-20 w-full max-w-[1500px]">

                <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-5">모든 일기 목록</h3>
                        {diaries.length === 0 ? (
                            <p>작성된 일기가 없습니다.</p>
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
                    </div>

                    <button
                        onClick={handleUpload}
                        className="w-full px-6 py-2 bg-[#DEB784] text-white rounded-md hover:bg-[#C89A60]"
                    >
                        게시글 업로드
                    </button>
                </div>

                <button
                    className="mt-6 px-4 py-2 bg-gray-400 text-white rounded-md"
                    onClick={() => navigate(-1)}
                >
                    뒤로 가기
                </button>

            </main>

        </div>
    );
};

export default UploadPost;

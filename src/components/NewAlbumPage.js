import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const NewAlbumPage = () => {
    const navigate = useNavigate();
    const userId = "1"; // 실제 로그인 유저 ID로 변경 필요
    const [diaries, setDiaries] = useState([]);
    const [selectedDiaries, setSeletedDiaries] = useState([]);
    const [title, setTitle] = useState("");

    // 모든 일기 불러오기
    useEffect(() => {
        fetch("https://api.puzzlelog.me/api/getDiary")
            .then((res) => res.json())
            .then((data) => setDiaries(data.data.diaries))
            .catch((err) => console.error("Error fetching diaries : ", err));
    }, []);

    // 체크박스 선택 핸들러
    const handleCheckboxChange = (diaryId) => {
        setSeletedDiaries((prevSelected) =>
            prevSelected.includes(diaryId)
                ? prevSelected.filter((id) => id !== diaryId)
                : [...prevSelected, diaryId]
        );
    };

    // 앨범 생성 요청
    const handleCreateAlbum = async () => {
        if (!title.trim()) {
            alert("앨범 제목을 입력하세요.");
            return;
        }
        if (selectedDiaries.length === 0) {
            alert("적어도 하나의 일기를 선택해야 합니다.");
            return;
        }

        const newAlbum = {
            userId: userId,
            title,
            diaryId: selectedDiaries,
            purchased: false
        };

        try {
            const response = await fetch("https://api.puzzlelog.me/api/albums", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAlbum),
            });

            if (!response.ok) {
                throw new Error("앨범 저장 실패");
            }

            alert("앨범이 성공적으로 생성되었습니다.");
            navigate("/digitalAlbum"); // 앨범 목록 페이지로 이동
        } catch (error) {
            console.error("Error creating album : ", error);
            alert("앨범 생성 중 오류가 발생했습니다.");
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

            <main className="mt-52 flex w-full max-w-7xl font-cafe24 mx-auto justify-center items-center">
            <div className="text-center">


                <h2 className="text-4xl font-bold text-center text-[#6B4F35] mb-6">새 디지털 앨범 만들기</h2>

                <div 
                className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl"
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
                    padding: '40px', 
                }}>

                    <label className="text-lg font-semibold mb-4">
                        앨범 제목 :
                        <input
                            type="text"
                            value={title}
                            placeholder="제목 입력"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-5">앨범에 추가할 일기 선택</h3>
                        {diaries.map((diary) => (
                        <div key={diary.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedDiaries.includes(diary.id)}
                                    onChange={() => handleCheckboxChange(diary.id)}
                                />
                                {diary.title}
                            </label>
                        </div>
                    ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            className="px-6 py-2 bg-gray-400 text-white font-medium text-base border rounded-lg hover:bg-gray-500 transition hover:border-transparent hover:scale-105" style={{ backgroundColor: "rgba(169, 169, 169, 0.6)" }}
                            onClick={() => navigate("/digitalAlbum")}>취소</button>
                        <button
                            className="px-6 py-2 rounded-lg text-white font-medium text-base border transition hover:border-transparent hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]" style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }}
                            onClick={handleCreateAlbum}>앨범만들기</button>
                    </div>



                </div>


            </div> 
            </main>
            
        </div>

    </>
    );
};

export default NewAlbumPage;
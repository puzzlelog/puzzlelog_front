import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NewAlbumPage = () => {
    const navigate = useNavigate();
    const userId = "1"; // 실제 로그인 유저 ID로 변경 필요
    const [diaries, setDiaries] = useState([]);
    const [selectedDiaries, setSeletedDiaries] = useState([]);
    const [title, setTitle] = useState("");

    // 모든 일기 불러오기
    useEffect(() => {
        fetch("http://localhost:8080/api/getDiary")
            .then((res) => res.json())
            .then((data) => setDiaries(data))
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
            const response = await fetch("http://localhost:8080/api/albums", {
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
        <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
            {/* 헤더 영역 */}
            <header className="w-full flex justify-between items-center px-10 py-4">
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

                <div className="flex flex-col gap-6 items-center justify-start w-full">
                    <div className="text-center text-[#0b0805] font-['Rowdies-Regular'] text-4xl font-normal leading-[120%] tracking-tight">새 디지털 앨범 만들기</div>
                </div>

                <label className="text-lg font-semibold mb-5">
                    앨범 제목 :
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label><br /><br />

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
                
            </main>

            <div className="flex gap-4 mb-6">
                <button
                    className="text-white font-medium text-base leading-[150%] px-6 py-2 bg-gray-400 rounded-md"
                    onClick={() => navigate("/digitalAlbum")}>취소</button>
                <button
                    className="text-white font-medium text-base leading-[150%] px-6 py-2 bg-[#DEB784] rounded-md hover:bg-[#C89A60]"
                    onClick={handleCreateAlbum}>앨범 만들기</button>

            </div>
            
            



            
        </div>
    );
};

export default NewAlbumPage;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import FabricCanvasViewer from "./FabricCanvasViewer";

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
  const [diaries, setDiaries] = useState([]);
  const [selectedDiaries, setSelectedDiaries] = useState([]);
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const userId = localStorage.getItem("userId");

  const itemsPerPage = 4; // 한 페이지당 4개 일기

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        if (!userId) {
          console.error("로그인이 필요합니다.");
          return;
        }
  
        const response = await axios.get(`https://api.puzzlelog.me/diaries`, {
          params: { userId, includeElements: true }
        });
  
        console.log("일기 데이터:", response.data);
  
        if (response.data.data && Array.isArray(response.data.data.diaries)) {
          const diariesData = response.data.data.diaries || [];
          // 공개되지 않은 일기 필터링 (openAt이 null 또는 빈 값)
          const filteredDiaries = diariesData.filter((d) => !d.openAt || d.openAt === "");
          // elements 필드 보강: 없으면 빈 배열 할당
          const diariesWithElements = filteredDiaries.map((d) => ({
            ...d,
            elements: d.elements || [],
            background: d.background || { mediaId: '' },
          }));
          setDiaries(diariesWithElements);
        } else {
          setDiaries([]);
        }
  
      } catch (error) {
        console.error("일기 불러오기 실패: ", error);
      }
    };
  
    fetchDiaries();
  }, [userId]);
  
  // 체크박스 선택 핸들러 (최대 5개 제한)
  const handleCheckboxChange = (diaryId) => {
    setSelectedDiaries((prevSelected) => {
      if (prevSelected.includes(diaryId)) {
        return prevSelected.filter((id) => id !== diaryId);
      } else if (prevSelected.length >= 5) {
        alert("최대 5개의 일기만 선택할 수 있습니다.");
        return prevSelected;
      } else {
        return [...prevSelected, diaryId];
      }
    });
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
      const response = await fetch("https://api.puzzlelog.me/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlbum),
      });
  
      if (!response.ok) {
        throw new Error("앨범 저장 실패");
      }
  
      alert("앨범이 성공적으로 생성되었습니다.");
      navigate("/digitalAlbum");
    } catch (error) {
      console.error("앨범 생성 중 오류: ", error);
      alert("앨범 생성 중 오류가 발생했습니다.");
    }
  };
  
  // 페이지 변경 핸들러
  const changePage = (offset) => {
    setCurrentPage((prevPage) => prevPage + offset);
  };
  
  // 현재 페이지에 해당하는 일기 목록
  const paginatedDiaries = diaries.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
  return (
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
        <Header />
        <main className="mt-32 flex w-full max-w-8xl font-cafe24 mx-auto justify-center items-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-center text-white mb-6">나만의 디지털앨범</h2>
            <div 
              className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-col items-center justify-center text-xl mb-4 px-8 py-10"
              style={{
                animation: "pulseGlow2 3s infinite",
                background: "rgba(0, 0, 0, 0.3)"
              }}
            >
              <label className="text-lg font-semibold mb-4 text-white">
                앨범 제목 :
                <input
                  type="text"
                  value={title}
                  placeholder="제목 입력"
                  onChange={(e) => setTitle(e.target.value)}
                  className="ml-2 p-1 border border-white bg-transparent text-white rounded"
                />
              </label>
  
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">앨범에 추가할 일기 선택 (최대 5개)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {paginatedDiaries.map((diary) => (
                    <div key={diary.diaryId} className="p-2">
                      <label className="flex items-center space-x-2 text-white">
                        <input
                          type="checkbox"
                          checked={selectedDiaries.includes(diary.diaryId)}
                          onChange={() => handleCheckboxChange(diary.diaryId)}
                        />
                        <span>{diary.title}</span>
                      </label>
                      <FabricCanvasViewer diary={diary} />
                    </div>
                  ))}
                </div>
  
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => changePage(-1)}
                    className="px-3 py-1 border border-white bg-transparent text-white rounded hover:bg-white hover:text-[#1e1b4b] transition-all duration-300 disabled:opacity-50"
                  >
                    이전
                  </button>
                  <button
                    disabled={(currentPage + 1) * itemsPerPage >= diaries.length}
                    onClick={() => changePage(1)}
                    className="px-3 py-1 border border-white bg-transparent text-white rounded hover:bg-white hover:text-[#1e1b4b] transition-all duration-300 disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              </div>
  
              <div className="flex gap-4">
                <button
                  className="px-6 py-2 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-[#1e1b4b] transition-all duration-300"
                  onClick={() => navigate("/digitalAlbum")}
                >
                  취소
                </button>
                <button
                  className="px-6 py-2 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-[#1e1b4b] transition-all duration-300"
                  onClick={handleCreateAlbum}
                >
                  앨범 만들기
                </button>
              </div>
            </div>
          </div>  
        </main>
      </div>
    </>
  );
};

export default NewAlbumPage;

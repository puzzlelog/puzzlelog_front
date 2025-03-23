import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

// 애니메이션 및 배경 효과 스타일 추가
const auroraStyle = `
@keyframes aurora {
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
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
`;

const DigitalAlbumList = () => {
  const navigate = useNavigate();
  const userId = "1"; // 실제 로그인 유저 ID로 변경 필요
  const [albums, setAlbums] = useState([]);

  // 앨범 목록 가져오기
  useEffect(() => {
    fetch(`http://localhost:8080/api/albums?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched albums:', data);
        setAlbums(Array.isArray(data.data) ? data.data : []);
      })
      .catch((error) => console.error('Error fetching albums:', error));
  }, []);

  // 앨범 삭제
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/albums/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("삭제 실패");
        return;
      }

      setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== id));
    } catch (error) {
      console.error("Error deleting album : ", error);
      alert("삭제 처리 실패");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full h-screen overflow-hidden">
        {/* 헤더 영역 */}
        <Header />

        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(45deg, #6a11cb, #2575fc, #8a2be2, #1e3c72, #0072ff, #4c1d95)",
            backgroundSize: "400% 400%",
            animation: "aurora 10s infinite alternate ease-in-out",
          }}
        ></div>

        <main className="relative z-10 min-h-screen flex flex-col items-center text-white">
          <div className="flex flex-col gap-6 items-center justify-start w-full mt-32">
            <div className="text-center text-white font-['Rowdies-Regular'] text-4xl font-normal leading-[120%] tracking-tight">
              나만의 디지털 앨범
            </div>
            <div className="text-center text-white font-['Asap-Regular'] text-lg font-normal leading-[150%]">
              당신의 추억을 소중하게 간직하세요.
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate("/album/new")}
              className="px-4 py-2 bg-gray-400 bg-opacity-70 border text-white rounded-md hover:bg-gray-500"
            >
              새 앨범 만들기
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-8">
            {albums.map((album) => (
                <div
                    key={album.id}
                    className="rounded-2xl p-8 w-[400px] transform transition-transform duration-500 hover:scale-105 shadow-2xl hover:shadow-indigo-500/50"
                    style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    }}
                >
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                    <div className="text-[#0b0805] font-rowdies text-2xl leading-[140%] tracking-tight">
                        {album.title}
                    </div>
                    <img
                        className="w-6 h-6 cursor-pointer close"
                        src="close.svg"
                        alt="삭제"
                        onClick={() => handleDelete(album.id)}
                    />
                    </div>

                    <p className="text-sm text-gray-600">
                    {new Date(album.createdAt).toLocaleString()}
                    </p>

                    <button
                    onClick={() => navigate(`/album/${album.id}`)}
                    className="flex items-center justify-center gap-2 rounded-md"
                    >
                    <div className="text-[#0b0805] text-base font-medium">상세 보기</div>
                    <img className="w-6 h-6" src="icon-chevron-right0.svg" alt="상세 보기" />
                    </button>
                </div>
                </div>
            ))}
            </div>
        </main>
      </div>
    </>
  );
};

export default DigitalAlbumList;

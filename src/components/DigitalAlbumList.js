import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const DigitalAlbumList = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [albums, setAlbums] = useState([]);

  // 앨범 목록 가져오기
  useEffect(() => {
    fetch(`https://api.puzzlelog.me/albums?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched albums:", data);
        setAlbums(Array.isArray(data.data) ? data.data : []);
      })
      .catch((error) => console.error("Error fetching albums:", error));
  }, [userId]);

  // 앨범 삭제
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://api.puzzlelog.me/albums/${id}`, {
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
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
        {/* 헤더 영역 */}
        <Header />

        <main className="mt-8 w-full max-w-full font-cafe24 mx-auto flex justify-center items-center">
          <div className="text-center">
            <div className="flex flex-col gap-6 items-center justify-start w-full mt-28">
              <div className="text-4xl font-bold text-white">
                나만의 디지털 앨범
              </div>
              <div className="text-xl font-bold text-white">
                당신의 추억을 소중하게 간직하세요.
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => navigate("/album/new")}
                className="mt-4 px-6 py-2 border border-white bg-transparent text-white rounded-md font-cafe24pretty hover:bg-white hover:text-[#1e1b4b] transition-all duration-300 hover:border-transparent hover:scale-105"
              >
                새 앨범 만들기
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="rounded-2xl p-8 w-[400px] transform transition-transform duration-500 hover:scale-105 shadow-2xl hover:shadow-indigo-500/50"
                  style={{
                    animation: "pulseGlow2 3s infinite",
                    background: "rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div className="text-white font-rowdies text-2xl leading-[140%] tracking-tight">
                        {album.title}
                      </div>
                      <img
                        className="w-6 h-6 cursor-pointer close"
                        src="close.svg"
                        alt="삭제"
                        onClick={() => handleDelete(album.id)}
                      />
                    </div>

                    <p className="text-sm text-white">
                      {new Date(album.createdAt).toLocaleString()}
                    </p>

                    <button
                      onClick={() => navigate(`/album/${album.id}`)}
                      className="flex items-center justify-center gap-2 rounded-md"
                    >
                      <div className="text-white text-base font-medium">
                        상세 보기
                      </div>
                      <img
                        className="w-6 h-6"
                        src="icon-chevron-right0.svg"
                        alt="상세 보기"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>  
        </main>
      </div>
    </>
  );
};

export default DigitalAlbumList;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import FabricCanvasViewer from "./FabricCanvasViewer";
import axios from "axios";

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

const AlbumDetail = () => {
<<<<<<< HEAD
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(`https://api.puzzlelog.me/albums/${albumId}`);
        console.log("Fetched Album Data:", response.data);
        setAlbum(response.data.data);
      } catch (err) {
        console.error("Error fetching album details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  useEffect(() => {
    if (album && album.diaryId && album.diaryId.length > 0) {
      const fetchDiaries = async () => {
        try {
          const diaryPromises = album.diaryId.map((diaryId) =>
            axios.get(`https://api.puzzlelog.me/diaries/${diaryId}?includeElements=true`)
          );
          const responses = await Promise.all(diaryPromises);
          const diaryData = responses.map((res) => res.data.data);
          console.log("Fetched Diaries Data:", diaryData);
          setDiaries(diaryData);
        } catch (err) {
          console.error("Error fetching diary details:", err);
        }
      };
      fetchDiaries();
    }
  }, [album]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://api.puzzlelog.me/albums/${albumId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("앨범 삭제 실패");
        return;
      }

      alert("앨범이 삭제되었습니다.");
      navigate("/digitalAlbum");
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("삭제 처리 실패");
    }
  };

  if (loading) return <div className="text-center mt-20 text-white">로딩 중...</div>;
  if (!album) return <div className="text-center mt-20 text-white">앨범을 찾을 수 없습니다.</div>;

  return (
    <>
      <style>{auroraStyle}</style>
      <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-[#1e1b4b] to-[#3b0764]">
        <Header />

        <main className="mt-28 flex w-full max-w-9xl font-cafe24 mx-auto justify-center items-center">
          <div className="text-center mb-4">
            <div
              className="w-full max-w-8xl p-6 rounded-lg shadow mt-4 border border-white"
              style={{
                animation: "pulseGlow2 3s infinite",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "20px",
              }}
            >
              <div className="flex flex-col gap-6 items-center justify-start w-full">
                <div className="text-4xl font-bold text-white">
                  제목 : {album.title}
                </div>
                <div className="text-xl font-bold text-gray-300">
                  {new Date(album.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {diaries.length > 0 ? (
                  diaries.map((diary) => (
                    <div key={diary.diaryId} className="rounded-lg">
                      <div className="p-2 rounded-lg">
                        <FabricCanvasViewer diary={diary} debugId={diary.diaryId} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">이 앨범에 저장된 일기가 없습니다.</p>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  className="px-4 py-2 bg-transparent border border-white text-white rounded-md hover:bg-white hover:text-[#1e1b4b] transition-all duration-300"
                  onClick={() => navigate(-1)}
                >
                  뒤로 가기
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-transparent border border-red-500 text-white rounded-lg hover:bg-red-500 hover:text-[#1e1b4b] transition-all duration-300"
                >
                  앨범 삭제
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
=======
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await axios.get(`https://api.puzzlelog.me/albums/${albumId}`);
                console.log("Fetched Album Data:", response.data);
                setAlbum(response.data.data);
            } catch (err) {
                console.error("Error fetching album details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbum();
    }, [albumId]);

    useEffect(() => {
        if (album && album.diaryId && album.diaryId.length > 0) {
            const fetchDiaries = async () => {
                try {
                    const diaryPromises = album.diaryId.map((diaryId) =>
                        axios.get(`https://api.puzzlelog.me/diaries/${diaryId}?includeElements=true`)
                    );
                    const responses = await Promise.all(diaryPromises);
                    const diaryData = responses.map((res) => res.data.data);
                    console.log("Fetched Diaries Data:", diaryData);
                    setDiaries(diaryData);
                } catch (err) {
                    console.error("Error fetching diary details:", err);
                }
            };
            fetchDiaries();
        }
    }, [album]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`https://api.puzzlelog.me/albums/${albumId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                alert("앨범 삭제 실패");
                return;
            }

            alert("앨범이 삭제되었습니다.");
            navigate("/digitalAlbum");
        } catch (error) {
            console.error("Error deleting album:", error);
            alert("삭제 처리 실패");
        }
    };

    if (loading) return <div className="text-center mt-20">로딩 중...</div>;
    if (!album) return <div className="text-center mt-20">앨범을 찾을 수 없습니다.</div>;

    return (
        <>
            <style>{auroraStyle}</style>
            <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">
                <Header />

                <main className="mt-28 flex w-full max-w-9xl font-cafe24 mx-auto justify-center items-center">
                <div className="text-center mb-4">

                    <div className="w-full max-w-8xl bg-white bg-opacity-50 p-6 rounded-lg shadow mt-4"
                        style={{
                            animation: "pulseGlow2 3s infinite",
                            background: "rgba(255, 255, 255, 0.2)",
                            padding: '20px'
                        }}
                    >
                        <div className="flex flex-col gap-6 items-center justify-start w-full">
                            <div className="text-4xl font-bold text-[#5A3E2B]">
                                제목 : {album.title}
                            </div>
                            <div className="text-xl font-bold text-gray-500">
                                {new Date(album.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {diaries.length > 0 ? (
                                diaries.map((diary) => (
                                    <div key={diary.diaryId} className="rounded-lg">
                                        <div className="p-2 rounded-lg">
                                            <FabricCanvasViewer diary={diary} debugId={diary.diaryId} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">이 앨범에 저장된 일기가 없습니다.</p>
                            )}
                        </div>

                        <button
                            className="px-4 py-2 bg-gray-400 bg-opacity-70 border text-white rounded-md hover:bg-gray-500 mr-8"
                            onClick={() => navigate(-1)}
                        >
                            뒤로 가기
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-400 bg-opacity-70 border text-white rounded-lg hover:bg-red-500"
                        >
                            앨범 삭제
                        </button>
                    </div>

                </div>
                </main>
            </div>
        </>
    );
>>>>>>> b504c1f (subscription)
};

export default AlbumDetail;

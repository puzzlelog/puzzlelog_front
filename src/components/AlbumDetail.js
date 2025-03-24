import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const AlbumDetail = () => {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://api.puzzlelog.me/api/albums/${albumId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Album Data:", data); // 응답 데이터 확인
                setAlbum(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching album details : ", err);
                setLoading(false);
            });
    }, [albumId]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://api.puzzlelog.me/api/albums/${albumId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                alert("앨범 삭제 실패");
                return;
            }

            alert("앨범이 삭제되었습니다.");
            navigate("/digitalAlbum");
        } catch (error) {
            console.error("Error deleting album : ", error);
            alert("삭제 처리 실패");
        }
    };

    if (loading) return <div className="text-center mt-20">로딩 중</div>;
    if (!album) return <div className="text-center mt-20">앨범을 찾을 수 없습니다.</div>;

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
                        {album.title}
                        </div>
                        <div className="text-center text-white font-['Asap-Regular'] text-lg font-normal leading-[150%]">
                        {new Date(album.createdAt).toLocaleString()}
                        </div>
                    </div>

                    <div className="w-full max-w-3xl bg-white bg-opacity-50 p-6 rounded-lg shadow mt-8">
                                
                        <h2 className="text-xl text-black font-semibold mb-3">포함된 일기 목록</h2>
                        <ul>
                            {album.diaryId && album.diaryId.length > 0 ? (
                                album.diaryId.map((diaryId) => (
                                    <li key={diaryId} className="mb-2">
                                        <button
                                            className="text-blue-500 hover:underline"
                                        >
                                            {diaryId}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">이 앨범에 저장된 일기가 없습니다.</p>
                            )}
                        </ul>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            className="px-4 py-2 bg-gray-400 bg-opacity-70 border text-white rounded-md hover:bg-gray-500"
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

                </main>



            </div>

            

            
        </>
    );
};

export default AlbumDetail;
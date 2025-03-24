import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/AdminHeader";

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

const AdminEditAds = () => {
  const [adName, setAdName] = useState("");
  const [adImage, setAdImage] = useState(null);
  const [ads, setAds] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "http://api.puzzlelog.me/admin/stickers"; // 스티커 API 그대로 사용

  // 광고 목록 불러오기
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { "userId": "admin" },
      });
      // 🔹 type이 "AD"인 항목만 필터링
      setAds(response.data.data.filter((item) => item.type === "AD"));
    } catch (error) {
      setErrorMessage("광고 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 이미지 파일 선택
  const handleImageChange = (event) => {
    setAdImage(event.target.files[0]);
  };

  // 광고 추가 요청
  const handleAddAd = async () => {
    if (!adName || !adImage) {
      setErrorMessage("모든 필드를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("name", adName);
    formData.append("type", "AD"); // 🔹 광고 타입 고정
    formData.append("file", adImage);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "userId": "admin" },
      });

      if (response.data.success) {
        alert("광고 추가 완료");
        fetchAds();
        setIsPopupOpen(false);
      }
    } catch (error) {
      setErrorMessage("광고 추가 중 오류가 발생했습니다.");
    }
  };

  // 광고 삭제 요청
  const handleDeleteAd = async (adId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${API_URL}/${adId}`, {
        headers: { "userId": "admin" },
      });

      if (response.data.success) {
        alert("광고 삭제 완료");
        fetchAds();
      } else {
        alert(`광고 삭제 실패: ${response.data.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      alert(error.response ? error.response.data.message : "서버 오류 발생");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
      <Header /><style>{auroraStyle}</style>
      <main className="mt-48 w-full max-w-6xl font-cafe24 mx-auto justify-center items-center">
        <h2 className="text-4xl font-semibold text-left text-[#6B4F35] mb-6">
          Edit Ads
        </h2>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105"
        >
          광고 추가
        </button>

        {/* 광고 목록 표시 */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
          {ads.map((ad) => (
            <div key={ad.id} className="p-4 bg-white rounded-lg shadow-lg text-center">
              <img src={ad.imageUrl} alt={ad.name} className="w-full h-24 object-contain" />
              <p className="mt-2 text-gray-700 font-medium">{ad.name}</p>
              <button
                onClick={() => handleDeleteAd(ad.id)}
                className="mt-2 px-3 py-1 bg-[#E76F51] text-white rounded-md hover:bg-[#D4A373] transition"
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 팝업 (광고 추가) */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96"
              style={{
                animation: "pulseGlow2 3s infinite",
                background: "rgba(255, 255, 255, 0.6)",
              }}
            >
              <h3 className="text-2xl font-semibold mb-4">새로운 광고 추가</h3>
              <input
                type="text"
                placeholder="광고 이름"
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
                value={adName}
                onChange={(e) => setAdName(e.target.value)}
              />
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-3" />
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="mt-6 px-6 py-2 bg-gray-400 text-white rounded-lg border hover:bg-gray-500 transition hover:border-transparent hover:scale-105" style={{ backgroundColor: "rgba(169, 169, 169, 0.6)" }}
                >
                  취소
                </button>
                <button
                  onClick={handleAddAd}
                  className="px-6 mt-6 py-2 rounded-lg text-white transition hover:border-transparent border hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]" style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }}
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminEditAds;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AdminEditAsset = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("emoji");
  const [assetImage, setAssetImage] = useState(null);
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedType, setSelectedType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const itemsPerPage = 18;

  const API_URL = "https://api.puzzlelog.me/assets";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    if (storedUserId !== "admin") {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    if (userId === "admin") {
      fetchAssets();
    }
  }, [userId]);

  useEffect(() => {
    filterAssets(selectedType);
  }, [assets, selectedType]);

  const fetchAssets = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { userId: userId || "admin" },
        params: { timestamp: new Date().getTime() },
      });
      const filteredData = response.data.data.filter(asset => asset.type !== "AD");
      setAssets(filteredData);
    } catch (error) {
      console.error("에셋 목록을 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  const filterAssets = (type) => {
    if (type === "ALL") {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(assets.filter(asset => asset.type === type));
    }
    setCurrentPage(1);
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_URL}/${assetId}`, { headers: { userId: userId || "admin" } });
      fetchAssets();
    } catch (error) {
      console.error("에셋 삭제 중 오류가 발생했습니다.", error);
    }
  };

  const handleImageChange = (e) => {
    setAssetImage(e.target.files[0]);
  };

  const handleAddAsset = async () => {
    if (!assetName || !assetImage) {
      setErrorMessage("에셋 이름과 이미지를 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("name", assetName);
    formData.append("type", assetType);
    formData.append("file", assetImage);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          userId: userId || "admin",
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        alert("에셋 추가 완료");
        setIsPopupOpen(false);
        setAssetName("");
        setAssetType("emoji");
        setAssetImage(null);
        setErrorMessage("");
        setSelectedType(assetType);
        fetchAssets();
      } else {
        setErrorMessage("에셋 추가 실패: " + (response.data.message || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("에셋 추가 중 오류가 발생했습니다.", error);
      setErrorMessage("에셋 추가에 실패했습니다.");
    }
  };

  const indexOfLastAsset = currentPage * itemsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstAsset, indexOfLastAsset);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
      <Header /><style>{auroraStyle}</style>
      <main className="mt-28 w-full max-w-7xl flex justify-center flex-col mx-auto items-center">
        <h2 className="text-4xl font-semibold text-[#6B4F35] mb-6">Edit Asset</h2>

        <div className="mb-4 flex justify-between w-full max-w-7xl">
          <select
            className="p-2 border rounded-md"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">전체</option>
            <option value="background">배경화면</option>
            <option value="emotion">감정일기이모티콘</option>
            <option value="dolls">인형</option>
            <option value="audio">오디오</option>
            <option value="camera">카메라</option>
            <option value="daily">일상</option>
            <option value="emoji">이모지</option>
            <option value="food">음식</option>
            <option value="number">숫자</option>
            <option value="language">언어</option>
            <option value="tape">테이프</option>
            <option value="vintage">빈티지</option>
          </select>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="px-4 py-2 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105"
          >
            에셋 추가
          </button>
        </div>

        <div className="grid grid-cols-9 gap-4 w-full max-w-7xl">
          {currentAssets.map((asset) => (
            <div key={asset.id} className="p-4 w-50 bg-white rounded-lg shadow-lg text-center">
              {asset.imageUrl ? (
                <img src={asset.imageUrl} alt={asset.name} className="w-full h-24 object-contain" />
              ) : (
                <div className="w-full h-24 flex items-center justify-center text-gray-500">
                  이미지가 없습니다
                </div>
              )}
              <p className="mt-2 text-gray-700 font-medium">{asset.name}</p>
              <p className="text-gray-500 text-sm">{asset.type}</p>
              <button
                onClick={() => handleDeleteAsset(asset.id)}
                className="mt-2 px-3 py-1 bg-[#E76F51] text-white rounded-md hover:bg-[#D4A373] transition"
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 sticky bottom-0 py-4 w-full max-w-7xl">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`mx-1 px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? 'bg-[#D4A373] text-white'
                  : 'bg-[#EDE4D5] text-gray-700'
              } hover:bg-[#F4A261] transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* 팝업 (에셋 추가) */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-2xl font-semibold mb-4">새로운 에셋 추가</h3>
              <input
                type="text"
                placeholder="에셋 이름"
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
              />
              <select
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
              >
                <option value="background">배경화면</option>
                <option value="emotion">감정일기이모티콘</option>
                <option value="dolls">인형</option>
                <option value="audio">오디오</option>
                <option value="camera">카메라</option>
                <option value="daily">일상</option>
                <option value="emoji">이모지</option>
                <option value="food">음식</option>
                <option value="number">숫자</option>
                <option value="language">언어</option>
                <option value="tape">테이프</option>
                <option value="vintage">빈티지</option>
              </select>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-3" />
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg border hover:bg-gray-500 transition hover:border-transparent hover:scale-105" style={{ backgroundColor: "rgba(169, 169, 169, 0.6)" }}
                >
                  취소
                </button>
                <button
                  onClick={handleAddAsset}
                  className="px-4 py-2 bg-[#F4A261] text-white rounded-md hover:bg-[#E76F51] transition"
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

export default AdminEditAsset;
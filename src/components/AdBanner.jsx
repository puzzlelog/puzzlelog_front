import React, { useEffect, useState } from "react";
import axios from "axios";

const AdBanner = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_URL = "https://api.puzzlelog.me/admin/assets"; // 스티커 API 활용

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { "userId": "admin" },
      });

      const filteredAds = response.data.data.filter((ad) => ad.type === "AD");
      setAds(filteredAds);
    } catch (error) {
      console.error("광고 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 7000); // 7초마다 변경
      return () => clearInterval(interval);
    }
  }, [ads]);

  if (ads.length === 0) return null; // 광고가 없으면 표시 안 함

  return (
    <div className="fixed bottom-0 w-full h-32 overflow-hidden">
      <img
        src={ads[currentIndex]?.imageUrl}
        alt={ads[currentIndex]?.name}
        className="w-full h-full object-cover"
        style={{ pointerEvents: "none" }} // 클릭 방지
      />
    </div>
  );
};

export default AdBanner;

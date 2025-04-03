import React, { useEffect, useRef } from "react";
import "../styles/ShootingStarBackground.css";

const ShootingStarBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const stars = containerRef.current.querySelectorAll(".shooting-star");
    stars.forEach((star) => {
      const top = Math.random() * 80;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 1.5 + Math.random();
      star.style.top = `${top}vh`;
      star.style.left = `${left}vw`;
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;
    });

    // ✨ 반짝이는 별 위치 지정
    const twinkles = containerRef.current.querySelectorAll(".star");
    twinkles.forEach((twinkle) => {
      twinkle.style.top = `${Math.random() * 100}vh`;
      twinkle.style.left = `${Math.random() * 100}vw`;
      twinkle.style.animationDelay = `${Math.random() * 3}s`;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[9999] overflow-hidden pointer-events-none"
    >
      {/* ✨ 반짝이는 별 50개 */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={`star-${i}`} className="star" />
      ))}

      {/* 🌠 별똥별 */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="shooting-star"></div>
      ))}
    </div>
  );
};

export default ShootingStarBackground;

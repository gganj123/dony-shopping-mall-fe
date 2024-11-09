import React, { useState, useEffect } from "react";
import "../../App.css";
const images = ["/image/banner-image.jpeg", "/image/banner-image2.jpeg"];

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3초마다 이미지 변경
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="banner"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
      }}
    >
      <div className="banner-content"></div>
    </div>
  );
};

export default Banner;

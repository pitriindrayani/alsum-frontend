import React, { useEffect, useMemo, useState } from "react";
import "../assets/css/style.css";

export default function Jumbotron() {
  const images = useMemo(
    () => [
      "https://picsum.photos/id/1018/1920/1080",
      "https://picsum.photos/id/1015/1920/1080",
      "https://picsum.photos/id/1005/1920/1080",
    ],
    []
  );

  const [active, setActive] = useState(0);

  /** preload images (hilangkan efek blank) */
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  /** auto slide */
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [active]);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActive((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <section className="jumbotron">
      <div className="jumbotron-wrapper">
        {images.map((img, index) => (
          <div
            key={index}
            className={`jumbotron-slide ${
              index === active ? "active" : ""
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* Arrow */}
        <button className="arrow left" onClick={prevSlide}>
          ❮
        </button>
        <button className="arrow right" onClick={nextSlide}>
          ❯
        </button>
      </div>
    </section>
  );
}

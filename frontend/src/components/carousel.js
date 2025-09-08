"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const images = [
  "/carousel/bf109.webp",
  "/carousel/grenadier.jpg",
  "/carousel/roosevelt.jpg",
  "/carousel/stryker.jpg",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      5000 // 5s entre chaque fondu
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`carousel-${i}`}
            fill
            priority={i === 0}
            className="object-cover"
          />
          {/* overlay sombre pour lisibilité */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}
    </div>
  );
}

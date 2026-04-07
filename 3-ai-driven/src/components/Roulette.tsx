"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Restaurant } from "@/lib/types";
import { loadRestaurants } from "@/lib/storage";

const COLORS = [
  "#FF6B6B", // red
  "#4ECDC4", // teal
  "#FFE66D", // yellow
  "#A8E6CF", // mint
  "#FF8A5C", // orange
  "#6C5CE7", // purple
  "#FD79A8", // pink
  "#00CEC9", // cyan
  "#FFEAA7", // light yellow
  "#DFE6E9", // light gray
];

function getTextColor(bgColor: string): string {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a2e" : "#ffffff";
}

export default function Roulette() {
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const restaurantsRef = useRef<Restaurant[]>([]);
  const currentRotationRef = useRef(0);

  const drawWheel = useCallback((restaurants: Restaurant[], currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;
    const segmentAngle = (2 * Math.PI) / restaurants.length;

    ctx.clearRect(0, 0, size, size);

    // Draw shadow
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();

    // Draw segments
    restaurants.forEach((restaurant, i) => {
      const startAngle = currentRotation + i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const color = COLORS[i % COLORS.length];

      // Segment
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = getTextColor(color);
      ctx.font = `bold ${Math.max(12, Math.min(16, radius / 8))}px sans-serif`;

      const textRadius = radius * 0.6;
      const name = restaurant.name.length > 8
        ? restaurant.name.substring(0, 7) + "..."
        : restaurant.name;
      ctx.fillText(name, textRadius, 0);

      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center text
    ctx.fillStyle = "#374151";
    ctx.font = `bold ${Math.max(10, radius * 0.08)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LUNCH", center, center);
  }, []);

  // Draw pointer (triangle) on the right side
  const drawPointer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    // Pointer on the right
    ctx.beginPath();
    ctx.moveTo(center + radius + 8, center);
    ctx.lineTo(center + radius - 18, center - 14);
    ctx.lineTo(center + radius - 18, center + 14);
    ctx.closePath();
    ctx.fillStyle = "#EF4444";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);

  useEffect(() => {
    const restaurants = loadRestaurants();
    restaurantsRef.current = restaurants;
    if (restaurants.length > 0) {
      drawWheel(restaurants, 0);
      drawPointer();
    }
  }, [drawWheel, drawPointer]);

  const spin = useCallback(() => {
    const restaurants = restaurantsRef.current;
    if (restaurants.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelected(null);

    const segmentAngle = (2 * Math.PI) / restaurants.length;
    // Random target: at least 5 full rotations + random position
    const extraRotation = Math.random() * 2 * Math.PI;
    const totalRotation = currentRotationRef.current + (5 + Math.random() * 3) * 2 * Math.PI + extraRotation;

    const startRotation = currentRotationRef.current;
    const duration = 4000;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRot = startRotation + (totalRotation - startRotation) * eased;

      drawWheel(restaurants, currentRot);
      drawPointer();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentRotationRef.current = currentRot;

        // Determine which segment the pointer (right side, angle = 0) points to
        const normalizedRotation = ((currentRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        // Pointer is at angle 0 (right). Each segment i covers [i*segAngle, (i+1)*segAngle].
        // The wheel rotates, so the segment at angle 0 is the one where:
        // segmentIndex * segmentAngle <= (2*PI - normalizedRotation) < (segmentIndex+1) * segmentAngle
        const pointerAngle = ((2 * Math.PI - normalizedRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const selectedIndex = Math.floor(pointerAngle / segmentAngle) % restaurants.length;

        setSelected(restaurants[selectedIndex]);
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isSpinning, drawWheel, drawPointer]);

  return (
    <div className="mb-10 flex flex-col items-center">
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="drop-shadow-lg"
          style={{ width: 380, height: 380 }}
        />
      </div>
      <button
        onClick={spin}
        disabled={isSpinning}
        className="rounded-full bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-green-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSpinning ? "回転中..." : "🎰 ルーレットを回す！"}
      </button>
      {selected && !isSpinning && (
        <div className="mt-6 w-full max-w-sm rounded-xl bg-green-50 p-6 text-center shadow-md animate-in fade-in duration-300">
          <p className="text-sm text-green-600">今日のランチは...</p>
          <p className="mt-2 text-2xl font-bold text-green-800">{selected.name}</p>
          <p className="mt-1 text-sm text-green-500">{selected.genre}</p>
        </div>
      )}
    </div>
  );
}

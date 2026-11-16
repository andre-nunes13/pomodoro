"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export const Screensaver: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    setIsActive(false);
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = setTimeout(() => {
      setIsActive(true);
    }, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      resetIdleTimer();
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, handleActivity));

    idleTimer.current = setTimeout(() => {
      setIsActive(true);
    }, 5 * 60 * 1000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  // Starfield Canvas Animation
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const stars: Array<{ x: number; y: number; z: number }> = [];
    const numStars = 400;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * width,
      });
    }

    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= 4;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width;
          star.y = (Math.random() - 0.5) * height;
          star.z = width;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          const size = Math.max(1, (1 - star.z / width) * 3);
          const brightness = Math.min(255, Math.floor((1 - star.z / width) * 255));
          ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
          ctx.fillRect(px, py, size, size);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[99999] cursor-none select-none"
    />
  );
};

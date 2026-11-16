"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Volume2, VolumeX } from "lucide-react";

export const SystemTray: React.FC = () => {
  const { timeLeft, isRunning, sessionType, formatTime, settings, updateSettings, t } = useApp();
  const [timeStr, setTimeStr] = useState("");
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    updateSettings({ volume: val });
  };

  const toggleMute = () => {
    const isCurrentlyMuted = settings.soundPack === "mute";
    updateSettings({ soundPack: isCurrentlyMuted ? "win98" : "mute" });
  };

  return (
    <div className="relative flex items-center gap-1.5 px-2 py-0.5 win98-sunken bg-[#c0c0c0] h-[24px] text-xs font-sans">
      {/* Mini Pomodoro Status Indicator */}
      <div
        className={`flex items-center gap-1 px-1.5 rounded-[1px] text-[11px] font-mono font-bold ${
          isRunning
            ? sessionType === "Work"
              ? "bg-[#008000] text-white"
              : "bg-[#000080] text-white"
            : "text-[#444]"
        }`}
        title={`Pomodoro Status: ${sessionType} (${isRunning ? "Running" : "Paused"})`}
      >
        <span>{formatTime(timeLeft)}</span>
      </div>

      {/* Sound / Volume Icon */}
      <button
        onClick={() => setShowVolumePopup(!showVolumePopup)}
        className="hover:bg-white/40 p-0.5 rounded-[1px] cursor-pointer"
        title={t("audioSettings")}
      >
        {settings.soundPack === "mute" || settings.volume === 0 ? (
          <VolumeX className="w-3.5 h-3.5 text-red-700" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-black" />
        )}
      </button>

      {/* Volume Popup */}
      {showVolumePopup && (
        <div
          onMouseLeave={() => setShowVolumePopup(false)}
          className="absolute bottom-8 right-14 win98-box p-3 w-36 flex flex-col items-center gap-2 z-[9999]"
        >
          <div className="text-[11px] font-bold text-center">{t("volume")}</div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.volume}
            onChange={handleVolumeChange}
            className="w-full accent-[#000080] cursor-pointer"
          />
          <div className="flex items-center justify-between w-full text-[10px]">
            <span>{settings.volume}%</span>
            <button
              onClick={toggleMute}
              className="win98-btn px-1.5 py-0.5 text-[10px]"
            >
              {settings.soundPack === "mute" ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      )}

      {/* Live Digital Clock */}
      <span className="text-[11px] font-medium text-black tracking-tight pl-1 select-none">
        {timeStr}
      </span>
    </div>
  );
};

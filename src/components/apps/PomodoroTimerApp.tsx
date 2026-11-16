"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Play, Pause, RotateCcw, FastForward, Plus, Settings } from "lucide-react";

export const PomodoroTimerApp: React.FC = () => {
  const {
    timeLeft,
    isRunning,
    sessionType,
    cycleCount,
    toggleTimer,
    resetTimer,
    skipPhase,
    addTime,
    formatTime,
    settings,
    updateSettings,
    openWindow,
    t,
  } = useApp();

  const clockTheme = settings.clockTheme || "lcd";

  const totalDuration =
    sessionType === "Work"
      ? settings.workTime * 60
      : sessionType === "LongBreak"
      ? settings.longBreakTime * 60
      : settings.breakTime * 60;

  const progressPercent = totalDuration > 0 ? Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100)) : 0;

  const cycleProgress = ((cycleCount % settings.cyclesBeforeLongBreak) / settings.cyclesBeforeLongBreak) * 100;

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#c0c0c0] text-black font-sans">
      {/* Session Header Banner */}
      <div className="flex items-center justify-between win98-sunken px-3 py-2 bg-[#dfdfdf]">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full border border-black ${
              isRunning ? (sessionType === "Work" ? "bg-emerald-600 animate-pulse" : "bg-blue-600 animate-pulse") : "bg-amber-500"
            }`}
          />
          <span className="font-bold text-sm">
            {sessionType === "Work"
              ? t("work")
              : sessionType === "LongBreak"
              ? t("longBreak")
              : t("break")}
          </span>
        </div>

        <button
          onClick={() => openWindow("settings")}
          className="win98-btn flex items-center gap-1 text-[11px]"
          title={t("settingsTitle")}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{t("settings")}</span>
        </button>
      </div>

      {/* Authentic Windows 98 Digital Counter Display */}
      <div
        className={`p-3 flex flex-col items-center justify-center rounded-[1px] select-none ${
          clockTheme === "lcd" ? "win98-lcd-well" : "win98-led-well"
        }`}
      >
        <div className="flex items-center justify-between w-full px-1 pb-1.5 border-b border-white/10 text-[10px] font-mono tracking-wider">
          <span
            className={
              clockTheme === "lcd"
                ? "text-[#1a2216] font-bold"
                : isRunning
                ? "text-red-400 font-bold"
                : "text-gray-400 font-semibold"
            }
          >
            {sessionType.toUpperCase()} • {isRunning ? "RUNNING" : "PAUSED"}
          </span>
          <span
            className={
              clockTheme === "lcd" ? "text-[#1a2216] font-bold" : "text-gray-400 font-bold"
            }
          >
            {t("cycle")} {(cycleCount % settings.cyclesBeforeLongBreak) + 1}/{settings.cyclesBeforeLongBreak}
          </span>
        </div>

        <div
          className={`text-6xl font-extrabold tracking-widest py-2.5 win98-led-digits ${
            clockTheme === "lcd" ? "win98-lcd-digits" : "win98-led-red"
          }`}
        >
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center justify-between w-full px-1 pt-1 text-[9px] font-mono text-gray-500">
          <span>{clockTheme === "lcd" ? "CLASSIC LCD STYLE (DEFAULT)" : "MINESWEEPER LED STYLE"}</span>
          <button
            onClick={() => updateSettings({ clockTheme: clockTheme === "lcd" ? "led" : "lcd" })}
            className="hover:underline cursor-pointer text-gray-500 hover:text-black font-sans"
            title="Toggle LCD / LED display mode"
          >
            {clockTheme === "lcd" ? "[Switch to LED]" : "[Switch to LCD]"}
          </button>
        </div>
      </div>

      {/* Retro Segmented Progress Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[11px]">
          <span>Session Progress</span>
          <span className="font-bold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="win98-progress-track">
          <div
            className="win98-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cycle Progress Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[11px]">
          <span>Total Cycle Progress</span>
          <span>
            {cycleCount % settings.cyclesBeforeLongBreak} / {settings.cyclesBeforeLongBreak}
          </span>
        </div>
        <div className="win98-progress-track h-3">
          <div
            className="bg-[#000080] h-full transition-all duration-300"
            style={{ width: `${cycleProgress}%` }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={toggleTimer}
          className={`win98-btn flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 ${
            isRunning ? "bg-[#e8be14]" : "bg-[#c0c0c0]"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 text-black" />
              <span>{t("pauseTimer")}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-emerald-800" />
              <span>{t("startTimer")}</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="win98-btn py-2 px-3 text-xs flex items-center justify-center gap-1.5"
          title={t("resetTimer")}
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-800" />
          <span>{t("resetTimer")}</span>
        </button>

        <button
          onClick={skipPhase}
          className="win98-btn py-2 px-3 text-xs flex items-center justify-center gap-1.5"
          title={t("skipPhase")}
        >
          <FastForward className="w-3.5 h-3.5 text-blue-900" />
          <span>{t("skipPhase")}</span>
        </button>
      </div>

      {/* Quick Add Minutes */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-700">Quick adjust:</span>
        <button
          onClick={() => addTime(60)}
          className="win98-btn px-2 py-0.5 text-[11px] flex items-center gap-0.5"
        >
          <Plus className="w-3 h-3" />
          <span>{t("quickAdd1")}</span>
        </button>
        <button
          onClick={() => addTime(300)}
          className="win98-btn px-2 py-0.5 text-[11px] flex items-center gap-0.5"
        >
          <Plus className="w-3 h-3" />
          <span>{t("quickAdd5")}</span>
        </button>
      </div>

      {/* Strict Mode Indicator */}
      {settings.strictMode && (
        <div className="win98-sunken p-1.5 text-[11px] bg-amber-50 text-amber-900 flex items-center gap-1.5">
          <span>🔒</span>
          <span>{t("strictMode")}</span>
        </div>
      )}
    </div>
  );
};

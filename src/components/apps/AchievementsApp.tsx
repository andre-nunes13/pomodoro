"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import confetti from "canvas-confetti";
import { soundManager } from "@/lib/audio";
import { Lock, Sparkles } from "lucide-react";

export const AchievementsApp: React.FC = () => {
  const { achievements, unlockedAchievementIds, t } = useApp();

  const unlockedCount = unlockedAchievementIds.length;
  const totalCount = achievements.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const triggerFanfare = () => {
    soundManager.playAchievement();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="flex flex-col gap-2.5 p-2 bg-[#c0c0c0] font-sans text-black select-none">
      {/* Overview Banner */}
      <div className="win98-sunken p-2.5 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-inner">
            🏆
          </div>
          <div>
            <div className="font-bold text-xs">
              {t("achievementsUnlocked")}: {unlockedCount} / {totalCount} ({progressPercent}%)
            </div>
            <div className="text-[11px] text-gray-500">
              Keep focusing and organizing tasks to unlock all trophies!
            </div>
          </div>
        </div>

        <button
          onClick={triggerFanfare}
          className="win98-btn px-2.5 py-1 text-xs flex items-center gap-1 font-bold"
          title="Celebrate!"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Party</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="win98-progress-track">
        <div
          className="win98-progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Achievement Cards Grid */}
      <div className="win98-sunken bg-white p-2 max-h-[340px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {achievements.map((ach) => {
          const isUnlocked = unlockedAchievementIds.includes(ach.id);

          return (
            <div
              key={ach.id}
              className={`p-2 rounded-[2px] border flex items-start gap-2.5 transition-all ${
                isUnlocked
                  ? "bg-amber-50/60 border-amber-300 shadow-sm"
                  : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              <div
                className={`text-2xl p-1.5 rounded border shrink-0 ${
                  isUnlocked
                    ? "bg-white border-amber-300 drop-shadow-sm"
                    : "bg-gray-100 border-gray-300 grayscale"
                }`}
              >
                {ach.icon}
              </div>

              <div className="flex-1 truncate">
                <div className="flex items-center justify-between gap-1">
                  <span className={`font-bold text-xs truncate ${isUnlocked ? "text-amber-950" : "text-gray-600"}`}>
                    {ach.name}
                  </span>
                  {isUnlocked ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-300 px-1 rounded shrink-0">
                      Unlocked
                    </span>
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-gray-600 leading-snug line-clamp-2 mt-0.5">
                  {ach.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

"use client";

import React from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";

export const HelpDialog: React.FC = () => {
  const { closeWindow, t } = useApp();

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#c0c0c0] font-sans text-black select-none text-xs">
      <div className="flex items-center gap-3 border-b border-[#808080] pb-2">
        <Image
          src="/focusxp-icon.png"
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 object-contain"
        />
        <div>
          <div className="font-bold text-sm">Focus 98 • Modern Retro Pomodoro</div>
          <div className="text-[11px] text-gray-600">
            Version 2.0 (Next.js 15, shadcn/ui, TypeScript, Gemini AI)
          </div>
        </div>
      </div>

      <div className="win98-sunken bg-white p-2.5 max-h-48 overflow-y-auto flex flex-col gap-2 text-[11px] leading-relaxed">
        <p className="font-bold">✨ About Focus 98:</p>
        <p>
          Focus 98 is a full retro Windows 98 desktop environment crafted for hyper-focused
          productivity. It combines the nostalgic warmth of late-90s desktop operating systems with
          modern Next.js 15 App Router architecture, responsive window management, and Google Gemini
          AI task automation.
        </p>

        <p className="font-bold mt-1">⌨️ Quick Tips & Shortcuts:</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li><strong>Spacebar:</strong> Start or Pause the Pomodoro timer instantly.</li>
          <li><strong>R:</strong> Reset the timer back to starting duration.</li>
          <li><strong>Drag Windows:</strong> Grab any title bar to reposition windows freely.</li>
          <li><strong>AI Breakdown:</strong> Open TaskPad 98 and click &quot;AI Task Breakdown&quot; to split large goals into actionable steps.</li>
          <li><strong>Strict Mode:</strong> Turn on Strict Mode in Control Panel to prevent pausing during work sessions.</li>
        </ul>

        <p className="font-bold mt-1">❤️ Credits:</p>
        <p>
          Rebuilt with modern Next.js and shadcn/ui, inspired by classic Windows 98 and the original Pomodoro XP concept.
        </p>
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={() => closeWindow("help")}
          className="win98-btn px-5 py-1 text-xs font-bold"
        >
          {t("ok")}
        </button>
      </div>
    </div>
  );
};

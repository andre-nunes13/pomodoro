"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { soundManager } from "@/lib/audio";

export const ShutdownDialog: React.FC = () => {
  const { closeWindow, t } = useApp();
  const [option, setOption] = useState<"shutdown" | "restart" | "relax">("shutdown");
  const [isShutDown, setIsShutDown] = useState(false);

  const handleConfirm = () => {
    if (option === "restart") {
      window.location.reload();
    } else if (option === "relax") {
      closeWindow("shutdown");
    } else {
      soundManager.playShutdownXp();
      setIsShutDown(true);
    }
  };

  if (isShutDown) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-center z-[99999] p-4 font-mono select-none">
        <div className="text-amber-500 text-2xl font-bold tracking-wider mb-4 animate-pulse">
          It&apos;s now safe to turn off your computer.
        </div>
        <div className="text-gray-400 text-xs mb-6">
          Focus 98 session has paused. Take a deep breath and rest well.
        </div>
        <button
          onClick={() => {
            setIsShutDown(false);
            closeWindow("shutdown");
          }}
          className="win98-btn px-4 py-1.5 text-xs font-bold"
        >
          Resume Focus 98
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#c0c0c0] font-sans text-black text-xs select-none">
      <div className="flex items-center gap-3">
        <Image
          src="/icons/power-icon.png"
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 object-contain shrink-0"
        />
        <div className="font-bold text-xs">{t("shutdownPrompt")}</div>
      </div>

      <div className="flex flex-col gap-1.5 pl-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="shutdownOpt"
            checked={option === "shutdown"}
            onChange={() => setOption("shutdown")}
            className="accent-[#000080]"
          />
          <span>Shut down Focus 98</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="shutdownOpt"
            checked={option === "restart"}
            onChange={() => setOption("restart")}
            className="accent-[#000080]"
          />
          <span>{t("shutdownRestart")}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="shutdownOpt"
            checked={option === "relax"}
            onChange={() => setOption("relax")}
            className="accent-[#000080]"
          />
          <span>{t("shutdownRelax")}</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-[#808080] pt-2">
        <button
          onClick={handleConfirm}
          className="win98-btn px-4 py-1 font-bold text-xs"
        >
          {t("ok")}
        </button>
        <button
          onClick={() => closeWindow("shutdown")}
          className="win98-btn px-4 py-1 text-xs"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

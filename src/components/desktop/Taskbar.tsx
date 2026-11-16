"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { soundManager } from "@/lib/audio";
import { StartMenu } from "./StartMenu";
import { SystemTray } from "./SystemTray";
import { WindowId } from "@/lib/types";

export const Taskbar: React.FC = () => {
  const { windows, activeWindowId, bringToFront, minimizeWindow, t } = useApp();
  const [isStartOpen, setIsStartOpen] = useState(false);

  const handleStartToggle = () => {
    soundManager.playClick();
    setIsStartOpen((prev) => !prev);
  };

  const handleTaskClick = (id: WindowId) => {
    soundManager.playClick();
    const win = windows[id];
    if (activeWindowId === id && !win.isMinimized) {
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  const openWindowsList = (Object.keys(windows) as WindowId[]).filter(
    (id) => windows[id].isOpen
  );

  return (
    <>
      <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />

      <footer className="fixed bottom-0 left-0 right-0 h-9 win98-taskbar flex items-center px-1 z-[9990] select-none font-sans">
        {/* Start Button */}
        <button
          onClick={handleStartToggle}
          className={`win98-btn flex items-center gap-1.5 h-7 px-2 font-bold text-xs ${
            isStartOpen ? "is-active" : ""
          }`}
        >
          <Image
            src="/start-icon.png"
            alt="Start"
            width={16}
            height={16}
            className="w-4 h-4 object-contain"
          />
          <span>{t("start")}</span>
        </button>

        {/* Divider */}
        <div className="w-[3px] h-6 mx-1 border-l border-[#808080] border-r border-r-white" />

        {/* Active Application Windows */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto h-full py-0.5 no-scrollbar">
          {openWindowsList.map((id) => {
            const win = windows[id];
            const isActive = activeWindowId === id && !win.isMinimized;

            return (
              <button
                key={id}
                onClick={() => handleTaskClick(id)}
                className={`win98-task-btn max-w-[170px] min-w-[120px] truncate ${
                  isActive ? "active" : ""
                }`}
              >
                <Image
                  src={win.icon}
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain mr-1.5 shrink-0"
                />
                <span className="truncate text-[11px]">{t(win.title)}</span>
              </button>
            );
          })}
        </div>

        {/* System Tray */}
        <SystemTray />
      </footer>
    </>
  );
};

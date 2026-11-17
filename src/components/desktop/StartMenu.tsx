"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { WindowId } from "@/lib/types";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow, t } = useApp();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (id: WindowId) => {
    openWindow(id);
    onClose();
  };

  const menuItems: Array<{ id: WindowId; label: string; icon: string }> = [
    { id: "timer", label: t("timerTitle"), icon: "/icons/focusxp-icon.png" },
    { id: "tasks", label: t("tasksTitle"), icon: "/icons/documents-icon.png" },
    { id: "notes", label: t("notesTitle"), icon: "/icons/sticky-icon.png" },
    { id: "history", label: t("historyTitle"), icon: "/icons/computer-icon.png" },
    { id: "achievements", label: t("achievementsTitle"), icon: "/icons/help-icon.png" },
    { id: "settings", label: t("settingsTitle"), icon: "/icons/control-panel-icon.png" },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-9 left-0.5 win98-box z-[9999] flex p-[2px] shadow-2xl select-none"
      style={{ width: "230px" }}
    >
      {/* Windows 98 Side Banner */}
      <div className="w-7 bg-gradient-to-t from-[#000080] via-[#1084d0] to-[#000080] flex items-end justify-center pb-2 select-none">
        <span
          className="text-white font-extrabold text-sm tracking-wider font-sans transform -rotate-90 whitespace-nowrap origin-bottom-left"
          style={{ textShadow: "1px 1px 2px #000" }}
        >
          <span className="font-light">Focus</span> 98
        </span>
      </div>

      {/* Menu List */}
      <div className="flex-1 flex flex-col py-1 bg-[#c0c0c0] font-sans">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-black hover:bg-[#000080] hover:text-white transition-none text-left cursor-pointer group"
          >
            <Image
              src={item.icon}
              alt=""
              width={22}
              height={22}
              className="w-5 h-5 object-contain"
            />
            <span className="font-medium group-hover:text-white">{item.label}</span>
          </button>
        ))}

        <div className="my-1 border-t border-[#808080] border-b border-b-white" />

        {/* Help */}
        <button
          onClick={() => handleItemClick("help")}
          className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-black hover:bg-[#000080] hover:text-white text-left cursor-pointer group"
        >
          <Image
            src="/icons/help-icon.png"
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
          <span className="font-medium group-hover:text-white">{t("help")}</span>
        </button>

        {/* Run */}
        <button
          onClick={() => handleItemClick("run")}
          className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-black hover:bg-[#000080] hover:text-white text-left cursor-pointer group"
        >
          <Image
            src="/icons/run-icon.png"
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
          <span className="font-medium group-hover:text-white">{t("run")}</span>
        </button>

        <div className="my-1 border-t border-[#808080] border-b border-b-white" />

        {/* Shut Down */}
        <button
          onClick={() => handleItemClick("shutdown")}
          className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-black hover:bg-[#000080] hover:text-white text-left cursor-pointer group"
        >
          <Image
            src="/icons/power-icon.png"
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
          <span className="font-medium group-hover:text-white">{t("shutdown")}</span>
        </button>
      </div>
    </div>
  );
};

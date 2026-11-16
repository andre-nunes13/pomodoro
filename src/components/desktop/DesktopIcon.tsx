"use client";

import React from "react";
import Image from "next/image";
import { soundManager } from "@/lib/audio";

interface DesktopIconProps {
  id: string;
  title: string;
  icon?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onOpen: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  title,
  icon = "/icons/focusxp-icon.png",
  isSelected = false,
  onSelect,
  onOpen,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
    soundManager.playClick();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  return (
    <div
      data-desktop-icon={id}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className="flex flex-col items-center justify-center p-1 w-20 cursor-pointer select-none m-1 text-center"
    >
      <div
        className={`relative w-9 h-9 mb-1 drop-shadow-md transition-all ${
          isSelected ? "filter brightness-90 contrast-125" : ""
        }`}
      >
        <Image
          src={icon}
          alt={title}
          fill
          sizes="36px"
          className="object-contain pointer-events-none"
        />
      </div>
      <span
        className={`text-xs px-1 py-0.5 leading-tight font-sans tracking-tight text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,1)] ${
          isSelected
            ? "bg-[#000080] text-white outline outline-1 outline-dotted outline-white"
            : ""
        }`}
      >
        {title}
      </span>
    </div>
  );
};

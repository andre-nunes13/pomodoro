"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { WindowId } from "@/lib/types";

interface WindowFrameProps {
  id: WindowId;
  children: React.ReactNode;
  menuItems?: Array<{ label: string; onClick?: () => void }>;
  statusText?: string;
  defaultWidth?: number;
  defaultHeight?: number;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  children,
  menuItems,
  statusText,
  defaultWidth,
}) => {
  const {
    windows,
    activeWindowId,
    bringToFront,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    updatePosition,
    t,
  } = useApp();

  const win = windows[id];
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!win || !win.isOpen || win.isMinimized) {
    return null;
  }

  const isActive = activeWindowId === id;

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (win.isMaximized || isMobile) return;
    bringToFront(id);
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 120, moveEvent.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, moveEvent.clientY - dragOffset.current.y));
      updatePosition(id, newX, newY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStartHeader = (e: React.TouchEvent) => {
    if (win.isMaximized || isMobile) return;
    bringToFront(id);
    const touch = e.touches[0];
    isDragging.current = true;
    dragOffset.current = {
      x: touch.clientX - win.position.x,
      y: touch.clientY - win.position.y,
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!isDragging.current) return;
      const moveTouch = moveEvent.touches[0];
      const newX = Math.max(0, Math.min(window.innerWidth - 120, moveTouch.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, moveTouch.clientY - dragOffset.current.y));
      updatePosition(id, newX, newY);
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Mobile layout styles vs Desktop floating window styles
  const frameStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "calc(100vh - 36px)",
        zIndex: win.zIndex,
      }
    : win.isMaximized
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "calc(100vh - 36px)",
        zIndex: win.zIndex,
      }
    : {
        position: "absolute",
        top: `${win.position.y}px`,
        left: `${win.position.x}px`,
        width: `${defaultWidth || win.size.width}px`,
        maxWidth: "96vw",
        maxHeight: "calc(100vh - 50px)",
        zIndex: win.zIndex,
      };

  return (
    <div
      style={frameStyle}
      onMouseDown={() => bringToFront(id)}
      className="win98-box flex flex-col p-[3px] select-none shadow-2xl transition-all duration-75"
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDownHeader}
        onTouchStart={handleTouchStartHeader}
        onDoubleClick={() => !isMobile && maximizeWindow(id)}
        className={`win98-titlebar cursor-move ${!isActive ? "inactive" : ""}`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <Image
            src={win.icon}
            alt=""
            width={16}
            height={16}
            className="w-4 h-4 object-contain pointer-events-none"
          />
          <span className="text-xs font-bold truncate tracking-normal font-sans">
            {t(win.title)}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-[2px] ml-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            title="Minimize"
            className="win98-title-btn"
          >
            _
          </button>
          {!isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(id);
              }}
              title={win.isMaximized ? "Restore" : "Maximize"}
              className="win98-title-btn"
            >
              {win.isMaximized ? "❐" : "□"}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            title="Close"
            className="win98-title-btn font-extrabold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Optional Menu Bar (File, Edit, Help) */}
      {menuItems && menuItems.length > 0 && (
        <div className="flex items-center gap-3 px-2 py-0.5 text-xs border-b border-[#808080] bg-[#c0c0c0] font-sans">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 rounded-none cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-[#c0c0c0] p-1.5">{children}</div>

      {/* Bottom Status Bar */}
      {statusText && (
        <div className="win98-sunken mt-1 px-2 py-0.5 text-[11px] text-[#222] truncate font-sans bg-[#c0c0c0]">
          {statusText}
        </div>
      )}
    </div>
  );
};

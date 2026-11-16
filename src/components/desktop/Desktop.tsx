"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { DesktopIcon } from "./DesktopIcon";
import { WindowFrame } from "./WindowFrame";
import { Taskbar } from "./Taskbar";
import { Screensaver } from "./Screensaver";
import { Wallpaper } from "@/lib/types";

// Apps
import { PomodoroTimerApp } from "../apps/PomodoroTimerApp";
import { TaskManagerApp } from "../apps/TaskManagerApp";
import { StickyNotesApp } from "../apps/StickyNotesApp";
import { SessionHistoryApp } from "../apps/SessionHistoryApp";
import { AchievementsApp } from "../apps/AchievementsApp";
import { SettingsApp } from "../apps/SettingsApp";
import { HelpDialog } from "../apps/HelpDialog";
import { RunDialog } from "../apps/RunDialog";
import { ShutdownDialog } from "../apps/ShutdownDialog";

export const Desktop: React.FC = () => {
  const { settings, updateSettings, openWindow, clearCompletedTasks, t } = useApp();
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  // Global listener to ensure clicking anywhere outside a desktop icon immediately deselects it
  useEffect(() => {
    const handleGlobalPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest("[data-desktop-icon]")) {
        setSelectedIconId(null);
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIconId(null);
        setContextMenuPos(null);
      }
    };

    window.addEventListener("pointerdown", handleGlobalPointerDown);
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handleGlobalPointerDown);
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  const getWallpaperStyle = (): React.CSSProperties => {
    switch (settings.wallpaper) {
      case "bliss":
        return {
          backgroundImage: "url('/wallpapers/bliss.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        };
      case "setup":
        return { backgroundColor: "#000080" };
      case "clouds":
        return {
          background: "linear-gradient(180deg, #1e528e 0%, #729fcf 50%, #ffffff 100%)",
        };
      case "matrix":
        return { backgroundColor: "#07130b" };
      case "night":
        return { backgroundColor: "#1e293b" };
      case "teal98":
      default:
        return { backgroundColor: "#008080" };
    }
  };

  const handleDesktopClick = () => {
    if (contextMenuPos) setContextMenuPos(null);
    setSelectedIconId(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    if (contextMenuPos) setContextMenuPos(null);
  };

  const cycleNextWallpaper = () => {
    const wallpapers: Wallpaper[] = ["teal98", "bliss", "setup", "clouds", "matrix", "night"];
    const currentIdx = wallpapers.indexOf(settings.wallpaper);
    const nextWallpaper = wallpapers[(currentIdx + 1) % wallpapers.length];
    updateSettings({ wallpaper: nextWallpaper });
    closeContextMenu();
  };

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      style={getWallpaperStyle()}
      className="relative w-screen h-screen overflow-hidden select-none"
    >
      {/* Optional CRT Scanlines Overlay */}
      {settings.crtScanlines && (
        <div className="absolute inset-0 crt-overlay z-[999]" />
      )}

      {/* Desktop Icons Container */}
      <div className="relative z-0 p-2 flex flex-col flex-wrap gap-1 items-start h-[calc(100vh-42px)] w-max">
        <DesktopIcon
          id="timer"
          title={t("timerTitle")}
          icon="/icons/focusxp-icon.png"
          isSelected={selectedIconId === "timer"}
          onSelect={() => setSelectedIconId((prev) => (prev === "timer" ? null : "timer"))}
          onOpen={() => {
            setSelectedIconId(null);
            openWindow("timer");
          }}
        />
        <DesktopIcon
          id="tasks"
          title={t("tasksTitle")}
          icon="/icons/documents-icon.png"
          isSelected={selectedIconId === "tasks"}
          onSelect={() => setSelectedIconId((prev) => (prev === "tasks" ? null : "tasks"))}
          onOpen={() => {
            setSelectedIconId(null);
            openWindow("tasks");
          }}
        />
        <DesktopIcon
          id="notes"
          title={t("notesTitle")}
          icon="/icons/sticky-icon.png"
          isSelected={selectedIconId === "notes"}
          onSelect={() => setSelectedIconId((prev) => (prev === "notes" ? null : "notes"))}
          onOpen={() => {
            setSelectedIconId(null);
            openWindow("notes");
          }}
        />
        <DesktopIcon
          id="history"
          title={t("historyTitle")}
          icon="/icons/computer-icon.png"
          isSelected={selectedIconId === "history"}
          onSelect={() => setSelectedIconId((prev) => (prev === "history" ? null : "history"))}
          onOpen={() => {
            setSelectedIconId(null);
            openWindow("history");
          }}
        />
        <DesktopIcon
          id="achievements"
          title={t("achievementsTitle")}
          icon="/icons/help-icon.png"
          isSelected={selectedIconId === "achievements"}
          onSelect={() => setSelectedIconId((prev) => (prev === "achievements" ? null : "achievements"))}
          onOpen={() => {
            setSelectedIconId(null);
            openWindow("achievements");
          }}
        />
        <DesktopIcon
          id="settings"
          title={t("settingsTitle")}
          icon="/icons/control-panel-icon.png"
          isSelected={selectedIconId === "settings"}
          onSelect={() => setSelectedIconId((prev) => (prev === "settings" ? null : "settings"))}
          onOpen={() => {
            setSelectedIconId(null);
            openWindow("settings");
          }}
        />
        <DesktopIcon
          id="recycle"
          title={t("recycleBin")}
          icon="/icons/power-icon.png"
          isSelected={selectedIconId === "recycle"}
          onSelect={() => setSelectedIconId((prev) => (prev === "recycle" ? null : "recycle"))}
          onOpen={() => {
            setSelectedIconId(null);
            if (confirm("Empty Recycle Bin (Clear Completed Tasks)?")) {
              clearCompletedTasks();
            }
          }}
        />
      </div>

      {/* Desktop Right Click Context Menu */}
      {contextMenuPos && (
        <div
          style={{ top: `${contextMenuPos.y}px`, left: `${contextMenuPos.x}px` }}
          className="absolute win98-box p-1 z-[9999] flex flex-col w-48 font-sans text-xs shadow-2xl"
        >
          <button
            onClick={() => {
              openWindow("timer");
              closeContextMenu();
            }}
            className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
          >
            {t("timerTitle")}
          </button>
          <button
            onClick={() => {
              openWindow("tasks");
              closeContextMenu();
            }}
            className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
          >
            {t("tasksTitle")}
          </button>
          <button
            onClick={() => {
              openWindow("notes");
              closeContextMenu();
            }}
            className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
          >
            New Sticky Note
          </button>
          <div className="my-1 border-t border-[#808080]" />
          <button
            onClick={cycleNextWallpaper}
            className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center justify-between"
          >
            <span>Change Wallpaper</span>
            <span className="text-[10px] opacity-75">({settings.wallpaper})</span>
          </button>
          <button
            onClick={() => {
              openWindow("settings");
              closeContextMenu();
            }}
            className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
          >
            Properties (Settings)
          </button>
        </div>
      )}

      {/* Draggable Desktop Windows */}
      <WindowFrame id="timer" defaultWidth={430}>
        <PomodoroTimerApp />
      </WindowFrame>

      <WindowFrame id="tasks" defaultWidth={520}>
        <TaskManagerApp />
      </WindowFrame>

      <WindowFrame id="notes" defaultWidth={280}>
        <StickyNotesApp />
      </WindowFrame>

      <WindowFrame id="history" defaultWidth={600}>
        <SessionHistoryApp />
      </WindowFrame>

      <WindowFrame id="achievements" defaultWidth={540}>
        <AchievementsApp />
      </WindowFrame>

      <WindowFrame id="settings" defaultWidth={460}>
        <SettingsApp />
      </WindowFrame>

      <WindowFrame id="help" defaultWidth={420}>
        <HelpDialog />
      </WindowFrame>

      <WindowFrame id="run" defaultWidth={380}>
        <RunDialog />
      </WindowFrame>

      <WindowFrame id="shutdown" defaultWidth={380}>
        <ShutdownDialog />
      </WindowFrame>

      {/* Retro Idle Screensaver */}
      <Screensaver />

      {/* Windows 98 Taskbar */}
      <Taskbar />
    </div>
  );
};

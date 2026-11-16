"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";

export const RunDialog: React.FC = () => {
  const { openWindow, closeWindow, t } = useApp();
  const [command, setCommand] = useState("");

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "timer" || cmd === "pomo") {
      openWindow("timer");
    } else if (cmd === "tasks" || cmd === "todo") {
      openWindow("tasks");
    } else if (cmd === "notes" || cmd === "notepad") {
      openWindow("notes");
    } else if (cmd === "history" || cmd === "stats") {
      openWindow("history");
    } else if (cmd === "achievements" || cmd === "trophy") {
      openWindow("achievements");
    } else if (cmd === "settings" || cmd === "control") {
      openWindow("settings");
    } else if (cmd.startsWith("http://") || cmd.startsWith("https://")) {
      window.open(cmd, "_blank");
    } else {
      alert(`Cannot find the file '${command}'. Type 'timer', 'tasks', 'notes', 'history', or 'settings'.`);
    }

    closeWindow("run");
    setCommand("");
  };

  return (
    <form onSubmit={handleRun} className="flex flex-col gap-3 p-3 bg-[#c0c0c0] font-sans text-black text-xs select-none">
      <div className="flex items-center gap-3">
        <Image
          src="/run-icon.png"
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 object-contain shrink-0"
        />
        <div className="text-[11px] leading-tight">
          Type the name of a program, folder, or web address, and Windows will open it for you.
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="font-bold">Open:</label>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="timer, tasks, notes, history..."
          className="win98-sunken flex-1 px-2 py-1 text-xs bg-white font-mono"
          autoFocus
        />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-[#808080] pt-2">
        <button
          type="submit"
          className="win98-btn px-4 py-1 font-bold text-xs"
        >
          {t("ok")}
        </button>
        <button
          type="button"
          onClick={() => closeWindow("run")}
          className="win98-btn px-4 py-1 text-xs"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
};

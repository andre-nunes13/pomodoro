"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Trash2 } from "lucide-react";

export const StickyNotesApp: React.FC = () => {
  const { notes, setNotes, t } = useApp();
  const [noteColor, setNoteColor] = useState<string>("#ffffcc");

  const colors = [
    { label: "Yellow", hex: "#ffffcc" },
    { label: "Mint", hex: "#dcfce7" },
    { label: "Cyan", hex: "#e0f2fe" },
    { label: "Pink", hex: "#fce7f3" },
  ];

  return (
    <div
      className="flex flex-col h-full p-2 gap-1.5 font-sans select-none"
      style={{ backgroundColor: noteColor }}
    >
      {/* Mini Note Toolbar */}
      <div className="flex items-center justify-between pb-1 border-b border-black/20 text-xs">
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => setNoteColor(c.hex)}
              className="w-3.5 h-3.5 rounded-full border border-black/40 cursor-pointer"
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>

        <button
          onClick={() => setNotes("")}
          className="text-red-800 hover:text-red-950 p-0.5 text-[11px] flex items-center gap-1 cursor-pointer"
          title={t("clearNote")}
        >
          <Trash2 className="w-3 h-3" />
          <span>{t("clearNote")}</span>
        </button>
      </div>

      {/* Note Textarea */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t("notesPlaceholder")}
        className="flex-1 w-full bg-transparent resize-none p-1 text-xs text-black outline-none font-sans leading-relaxed select-text min-h-[200px]"
      />
    </div>
  );
};

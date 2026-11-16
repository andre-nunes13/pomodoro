"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Session } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Download, Trash2, Calendar, Clock, Award } from "lucide-react";

const filterSessionsByRange = (sessions: Session[], range: "all" | "7d" | "30d"): Session[] => {
  if (range === "all") return sessions;
  const now = Date.now();
  const maxDays = range === "7d" ? 7 : 30;
  return sessions.filter((s) => {
    const sessionTime = new Date(s.date).getTime();
    if (isNaN(sessionTime)) return true;
    return (now - sessionTime) / (1000 * 60 * 60 * 24) <= maxDays;
  });
};

export const SessionHistoryApp: React.FC = () => {
  const { sessions, clearSessions, t } = useApp();
  const [filterRange, setFilterRange] = useState<"all" | "7d" | "30d">("all");

  const filteredSessions = filterSessionsByRange(sessions, filterRange);

  const totalWorkMinutes = filteredSessions
    .filter((s) => s.type === "Work")
    .reduce((acc, s) => acc + s.duration, 0);

  const totalWorkHours = (totalWorkMinutes / 60).toFixed(1);
  const workCyclesCount = filteredSessions.filter((s) => s.type === "Work").length;
  const avgDuration =
    workCyclesCount > 0 ? Math.round(totalWorkMinutes / workCyclesCount) : 0;

  // Chart data formatting: take last 10 sessions chronologically
  const chartData = [...filteredSessions]
    .reverse()
    .slice(-10)
    .map((s, idx) => ({
      index: `#${idx + 1}`,
      duration: s.duration,
      type: s.type,
      date: s.date.split(" ")[0] || s.date,
    }));

  const exportCSV = () => {
    const headers = "ID,Date,Duration(min),Type,Category\n";
    const rows = sessions
      .map((s) => `"${s.id}","${s.date}",${s.duration},"${s.type}","${s.category}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `focus98_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `focus98_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-2.5 p-2 bg-[#c0c0c0] font-sans text-black">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="win98-sunken p-2 bg-white flex flex-col items-center">
          <Clock className="w-4 h-4 text-blue-800 mb-0.5" />
          <span className="text-[10px] text-gray-500 uppercase tracking-tight">
            {t("totalFocusHours")}
          </span>
          <span className="text-base font-bold font-mono text-black">
            {totalWorkHours}h
          </span>
        </div>

        <div className="win98-sunken p-2 bg-white flex flex-col items-center">
          <Award className="w-4 h-4 text-emerald-800 mb-0.5" />
          <span className="text-[10px] text-gray-500 uppercase tracking-tight">
            {t("cyclesCompleted")}
          </span>
          <span className="text-base font-bold font-mono text-black">
            {workCyclesCount}
          </span>
        </div>

        <div className="win98-sunken p-2 bg-white flex flex-col items-center">
          <Calendar className="w-4 h-4 text-purple-800 mb-0.5" />
          <span className="text-[10px] text-gray-500 uppercase tracking-tight">
            {t("avgSession")}
          </span>
          <span className="text-base font-bold font-mono text-black">
            {avgDuration}m
          </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="win98-sunken bg-white p-2">
        <div className="text-[11px] font-bold mb-1 flex items-center justify-between">
          <span>Session Duration Trends (Past Sessions)</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#000080]" />
            <span className="text-[10px] text-gray-600">Minutes</span>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="index" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#c0c0c0",
                    border: "2px solid #808080",
                    fontSize: "11px",
                    fontFamily: "sans-serif",
                  }}
                />
                <Bar dataKey="duration" fill="#000080" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-xs text-gray-500 italic">
            {t("noHistory")}
          </div>
        )}
      </div>

      {/* Controls & Filter */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-gray-700">Filter:</span>
          <select
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value as "all" | "7d" | "30d")}
            className="win98-sunken px-1.5 py-0.5 text-xs bg-white cursor-pointer"
          >
            <option value="all">{t("filterAll")}</option>
            <option value="7d">{t("filterWeek")}</option>
            <option value="30d">{t("filterMonth")}</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={exportCSV}
            className="win98-btn px-2 py-0.5 text-[11px] flex items-center gap-1"
            title={t("exportCSV")}
          >
            <Download className="w-3 h-3" />
            <span>CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="win98-btn px-2 py-0.5 text-[11px] flex items-center gap-1"
            title={t("exportJSON")}
          >
            <Download className="w-3 h-3" />
            <span>Backup</span>
          </button>
          {sessions.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all session history records?")) {
                  clearSessions();
                }
              }}
              className="win98-btn px-2 py-0.5 text-[11px] text-red-700"
              title="Clear all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="win98-sunken bg-white max-h-44 overflow-y-auto text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#dfdfdf] border-b border-[#808080] text-[10px] font-bold text-gray-700 sticky top-0">
              <th className="p-1">{t("date")}</th>
              <th className="p-1">{t("type")}</th>
              <th className="p-1">{t("durationMin")}</th>
              <th className="p-1">Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500 italic">
                  {t("noHistory")}
                </td>
              </tr>
            ) : (
              filteredSessions.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-blue-50 text-[11px]">
                  <td className="p-1 font-mono text-[10px]">{s.date}</td>
                  <td className="p-1">
                    <span
                      className={`px-1 py-0.2 rounded text-[10px] border ${
                        s.type === "Work"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}
                    >
                      {s.type}
                    </span>
                  </td>
                  <td className="p-1 font-mono font-bold">{s.duration} min</td>
                  <td className="p-1 text-gray-600">{s.category}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { soundManager } from "@/lib/audio";
import { Language, SoundPack, Wallpaper } from "@/lib/types";
import { Sliders, Volume2, Monitor, Globe, RotateCcw } from "lucide-react";

export const SettingsApp: React.FC = () => {
  const { settings, updateSettings, resetSettings, t } = useApp();
  const [activeTab, setActiveTab] = useState<"timer" | "audio" | "appearance" | "general">("timer");

  const handleTestAlarm = () => {
    soundManager.playAlarm();
  };

  const handleTestFanfare = () => {
    soundManager.playAchievement();
  };

  const handleTestClick = () => {
    soundManager.playClick();
  };

  const handleTestStartup = () => {
    soundManager.playStartupXp();
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-[#c0c0c0] font-sans text-black select-none">
      {/* Settings Tabs Header */}
      <div className="flex items-center gap-1 border-b border-[#808080] pb-1">
        <button
          onClick={() => setActiveTab("timer")}
          className={`win98-btn flex items-center gap-1 text-xs py-1 px-2.5 ${
            activeTab === "timer" ? "is-active font-bold" : ""
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t("timerConfig")}</span>
        </button>

        <button
          onClick={() => setActiveTab("audio")}
          className={`win98-btn flex items-center gap-1 text-xs py-1 px-2.5 ${
            activeTab === "audio" ? "is-active font-bold" : ""
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{t("audioSettings")}</span>
        </button>

        <button
          onClick={() => setActiveTab("appearance")}
          className={`win98-btn flex items-center gap-1 text-xs py-1 px-2.5 ${
            activeTab === "appearance" ? "is-active font-bold" : ""
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{t("appearance")}</span>
        </button>

        <button
          onClick={() => setActiveTab("general")}
          className={`win98-btn flex items-center gap-1 text-xs py-1 px-2.5 ${
            activeTab === "general" ? "is-active font-bold" : ""
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t("generalSettings")}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="win98-sunken bg-white p-3 min-h-[300px] text-xs flex flex-col gap-3">
        {/* TAB 1: TIMER CONFIG */}
        {activeTab === "timer" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t("workTime")}:</label>
              <input
                type="number"
                min={1}
                max={120}
                value={settings.workTime}
                onChange={(e) => updateSettings({ workTime: parseInt(e.target.value, 10) || 25 })}
                className="win98-sunken w-20 px-2 py-0.5 text-center font-mono font-bold"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">{t("breakTime")}:</label>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.breakTime}
                onChange={(e) => updateSettings({ breakTime: parseInt(e.target.value, 10) || 5 })}
                className="win98-sunken w-20 px-2 py-0.5 text-center font-mono font-bold"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">{t("longBreakTime")}:</label>
              <input
                type="number"
                min={1}
                max={90}
                value={settings.longBreakTime}
                onChange={(e) => updateSettings({ longBreakTime: parseInt(e.target.value, 10) || 15 })}
                className="win98-sunken w-20 px-2 py-0.5 text-center font-mono font-bold"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">{t("cyclesBeforeLong")}:</label>
              <input
                type="number"
                min={1}
                max={12}
                value={settings.cyclesBeforeLongBreak}
                onChange={(e) =>
                  updateSettings({ cyclesBeforeLongBreak: parseInt(e.target.value, 10) || 4 })
                }
                className="win98-sunken w-20 px-2 py-0.5 text-center font-mono font-bold"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <div>
                <div className="font-bold">Clock Display Style</div>
                <div className="text-[11px] text-gray-500">
                  Switch between Vintage Olive LCD and Minesweeper Red LED.
                </div>
              </div>
              <select
                value={settings.clockTheme || "lcd"}
                onChange={(e) => updateSettings({ clockTheme: e.target.value as "lcd" | "led" })}
                className="win98-sunken px-2 py-1 bg-white cursor-pointer"
              >
                <option value="lcd">Classic LCD (Default)</option>
                <option value="led">Minesweeper Red LED</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
              <div>
                <div className="font-bold">{t("strictMode")}</div>
                <div className="text-[11px] text-gray-500">
                  Prevents pausing or resetting during work sprints for maximum focus discipline.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.strictMode}
                onChange={(e) => updateSettings({ strictMode: e.target.checked })}
                className="w-4 h-4 accent-[#000080] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 2: AUDIO & SOUNDS */}
        {activeTab === "audio" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t("soundPack")}:</label>
              <select
                value={settings.soundPack}
                onChange={(e) => updateSettings({ soundPack: e.target.value as SoundPack })}
                className="win98-sunken px-2 py-1 bg-white cursor-pointer"
              >
                <option value="xp">{t("soundPackXp")}</option>
                <option value="win98">Windows 98 Classic Chimes</option>
                <option value="arcade">8-Bit Retro Arcade</option>
                <option value="modern">Subtle Modern Tones</option>
                <option value="mute">Mute All Sounds</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label className="font-medium">{t("volume")}:</label>
                <span className="font-mono">{settings.volume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: parseInt(e.target.value, 10) })}
                className="w-full accent-[#000080] cursor-pointer"
              />
            </div>

            <div className="border-t border-gray-200 pt-2">
              <div className="font-bold mb-1.5">Test Sound Effects:</div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleTestStartup}
                  className="win98-btn px-2.5 py-1 text-xs"
                >
                  {t("testStartupSound")}
                </button>
                <button
                  onClick={handleTestClick}
                  className="win98-btn px-2.5 py-1 text-xs"
                >
                  Click Sound
                </button>
                <button
                  onClick={handleTestAlarm}
                  className="win98-btn px-2.5 py-1 text-xs"
                >
                  Timer Alarm
                </button>
                <button
                  onClick={handleTestFanfare}
                  className="win98-btn px-2.5 py-1 text-xs"
                >
                  Fanfare
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPEARANCE & THEMES */}
        {activeTab === "appearance" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t("wallpaper")}:</label>
              <select
                value={settings.wallpaper}
                onChange={(e) => updateSettings({ wallpaper: e.target.value as Wallpaper })}
                className="win98-sunken px-2 py-1 bg-white cursor-pointer"
              >
                <option value="teal98">{t("wallpaperTeal")}</option>
                <option value="bliss">{t("wallpaperBliss")}</option>
                <option value="setup">{t("wallpaperSetup")}</option>
                <option value="clouds">{t("wallpaperClouds")}</option>
                <option value="matrix">{t("wallpaperMatrix")}</option>
                <option value="night">{t("wallpaperNight")}</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
              <div>
                <div className="font-bold">{t("crtEffect")}</div>
                <div className="text-[11px] text-gray-500">
                  Adds subtle CRT phosphor monitor scanlines across the screen.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.crtScanlines}
                onChange={(e) => updateSettings({ crtScanlines: e.target.checked })}
                className="w-4 h-4 accent-[#000080] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 4: GENERAL & SHORTCUTS */}
        {activeTab === "general" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">{t("language")}:</label>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as Language })}
                className="win98-sunken px-2 py-1 bg-white cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="pt">Português (Brasil)</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <div className="font-bold mb-1.5">{t("shortcuts")}:</div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-1 bg-gray-50 border rounded flex justify-between">
                  <span>Start / Pause Timer</span>
                  <kbd className="font-mono bg-white px-1 border">Space</kbd>
                </div>
                <div className="p-1 bg-gray-50 border rounded flex justify-between">
                  <span>Reset Timer</span>
                  <kbd className="font-mono bg-white px-1 border">R</kbd>
                </div>
                <div className="p-1 bg-gray-50 border rounded flex justify-between">
                  <span>Open Timer</span>
                  <kbd className="font-mono bg-white px-1 border">{settings.keyboardShortcuts.timer.toUpperCase()}</kbd>
                </div>
                <div className="p-1 bg-gray-50 border rounded flex justify-between">
                  <span>Open Tasks</span>
                  <kbd className="font-mono bg-white px-1 border">{settings.keyboardShortcuts.tasks.toUpperCase()}</kbd>
                </div>
                <div className="p-1 bg-gray-50 border rounded flex justify-between">
                  <span>Open History</span>
                  <kbd className="font-mono bg-white px-1 border">{settings.keyboardShortcuts.history.toUpperCase()}</kbd>
                </div>
                <div className="p-1 bg-gray-50 border rounded flex justify-between">
                  <span>Open Sticky Notes</span>
                  <kbd className="font-mono bg-white px-1 border">{settings.keyboardShortcuts.notes.toUpperCase()}</kbd>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
              <div>
                <div className="font-bold text-red-700">{t("resetDefaults")}</div>
                <div className="text-[11px] text-gray-500">
                  Resets timer lengths, theme, and shortcuts to default values.
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm(t("resetConfirm"))) {
                    resetSettings();
                  }
                }}
                className="win98-btn px-2.5 py-1 text-red-700 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

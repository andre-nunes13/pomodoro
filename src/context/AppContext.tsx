"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import confetti from "canvas-confetti";
import { soundManager } from "@/lib/audio";
import { translations } from "@/lib/translations";
import {
  WindowId,
  WindowState,
  Task,
  TaskCategory,
  TaskPriority,
  Session,
  SessionType,
  Achievement,
  AppSettings,
  Language,
} from "@/lib/types";

interface AppContextType {
  // Timer
  timeLeft: number;
  isRunning: boolean;
  sessionType: SessionType;
  cycleCount: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipPhase: () => void;
  addTime: (seconds: number) => void;
  formatTime: (seconds: number) => string;

  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // Tasks
  tasks: Task[];
  addTask: (description: string, category?: TaskCategory, priority?: TaskPriority, dueDate?: string | null, generatedByAI?: boolean) => void;
  editTask: (id: number, description: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  deleteTasks: (ids: number[]) => void;
  clearCompletedTasks: () => void;
  importTasks: (newTasks: Array<{ description: string; category?: TaskCategory; priority?: TaskPriority }>) => void;

  // Sticky Notes
  notes: string;
  setNotes: (text: string) => void;

  // Sessions / Analytics
  sessions: Session[];
  clearSessions: () => void;

  // Achievements
  achievements: Achievement[];
  unlockedAchievementIds: number[];

  // Windows
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  bringToFront: (id: WindowId) => void;
  updatePosition: (id: WindowId, x: number, y: number) => void;

  // I18n
  t: (key: string) => string;
  language: Language;
}

const defaultSettings: AppSettings = {
  workTime: 25,
  breakTime: 5,
  longBreakTime: 15,
  cyclesBeforeLongBreak: 4,
  strictMode: false,
  notificationsEnabled: true,
  soundPack: "xp",
  volume: 60,
  language: "en",
  wallpaper: "bliss",
  crtScanlines: false,
  clockTheme: "lcd",
  keyboardShortcuts: {
    timer: "t",
    history: "h",
    tasks: "k",
    achievements: "a",
    notes: "n",
    settings: "s",
  },
};

const defaultWindows: Record<WindowId, WindowState> = {
  timer: {
    id: "timer",
    title: "timerTitle",
    icon: "/icons/focusxp-icon.png",
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 50, y: 40 },
    size: { width: 440, height: 490 },
  },
  tasks: {
    id: "tasks",
    title: "tasksTitle",
    icon: "/icons/documents-icon.png",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 520, y: 40 },
    size: { width: 520, height: 530 },
  },
  notes: {
    id: "notes",
    title: "notesTitle",
    icon: "/icons/sticky-icon.png",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 4,
    position: { x: 1060, y: 60 },
    size: { width: 280, height: 320 },
  },
  history: {
    id: "history",
    title: "historyTitle",
    icon: "/icons/computer-icon.png",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 3,
    position: { x: 140, y: 70 },
    size: { width: 620, height: 540 },
  },
  achievements: {
    id: "achievements",
    title: "achievementsTitle",
    icon: "/icons/help-icon.png",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 2,
    position: { x: 200, y: 80 },
    size: { width: 560, height: 480 },
  },
  settings: {
    id: "settings",
    title: "settingsTitle",
    icon: "/icons/control-panel-icon.png",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 250, y: 60 },
    size: { width: 480, height: 510 },
  },
  help: {
    id: "help",
    title: "help",
    icon: "/icons/help-icon.png",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 180, y: 100 },
    size: { width: 450, height: 360 },
  },
  run: {
    id: "run",
    title: "run",
    icon: "/icons/run-icon.png",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 50,
    position: { x: 80, y: 260 },
    size: { width: 380, height: 180 },
  },
  shutdown: {
    id: "shutdown",
    title: "shutdownTitle",
    icon: "/icons/power-icon.png",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 100,
    position: { x: 260, y: 180 },
    size: { width: 380, height: 230 },
  },
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Persistence helper
  const isMountedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
  }, []);
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    try {
      const stored = localStorage.getItem("focus98_settings");
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Windows State
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(() => {
    if (typeof window === "undefined") return defaultWindows;
    try {
      const stored = localStorage.getItem("focus98_windows");
      if (!stored) return defaultWindows;
      const parsed = JSON.parse(stored);
      const merged: Record<WindowId, WindowState> = { ...defaultWindows };
      (Object.keys(defaultWindows) as WindowId[]).forEach((key) => {
        if (parsed[key]) {
          merged[key] = {
            ...defaultWindows[key],
            isOpen: parsed[key].isOpen ?? defaultWindows[key].isOpen,
            isMinimized: parsed[key].isMinimized ?? defaultWindows[key].isMinimized,
            isMaximized: parsed[key].isMaximized ?? defaultWindows[key].isMaximized,
            zIndex: parsed[key].zIndex ?? defaultWindows[key].zIndex,
            position: parsed[key].position || defaultWindows[key].position,
            size: parsed[key].size || defaultWindows[key].size,
          };
        }
      });
      return merged;
    } catch {
      return defaultWindows;
    }
  });
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>("timer");
  const highestZIndex = useRef(20);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("focus98_tasks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sticky Notes
  const [notes, setNotes] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem("focus98_notes") || "";
    } catch {
      return "";
    }
  });

  // Sessions
  const [sessions, setSessions] = useState<Session[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("focus98_sessions");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Unlocked Achievements IDs
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("focus98_achievements");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(settings.workTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<SessionType>("Work");
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [endTime, setEndTime] = useState<number | null>(null);

  // Sync sound settings
  useEffect(() => {
    soundManager.setVolume(settings.volume / 100);
    soundManager.setSoundPack(settings.soundPack);
  }, [settings.volume, settings.soundPack]);

  // Persist state
  useEffect(() => {
    if (!isMountedRef.current) return;
    localStorage.setItem("focus98_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    localStorage.setItem("focus98_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    localStorage.setItem("focus98_notes", notes);
  }, [notes]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    localStorage.setItem("focus98_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    localStorage.setItem("focus98_achievements", JSON.stringify(unlockedAchievementIds));
  }, [unlockedAchievementIds]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    localStorage.setItem("focus98_windows", JSON.stringify(windows));
  }, [windows]);

  // Translations
  const t = useCallback(
    (key: string): string => {
      const lang = settings.language;
      return translations[lang]?.[key] || translations.en?.[key] || key;
    },
    [settings.language]
  );

  // Window Manager Actions
  const bringToFront = useCallback((id: WindowId) => {
    highestZIndex.current += 1;
    setActiveWindowId(id);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: false,
        zIndex: highestZIndex.current,
      },
    }));
    soundManager.playClick();
  }, []);

  const openWindow = useCallback(
    (id: WindowId) => {
      highestZIndex.current += 1;
      setActiveWindowId(id);
      setWindows((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isOpen: true,
          isMinimized: false,
          zIndex: highestZIndex.current,
        },
      }));
      soundManager.playClick();
    },
    []
  );

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
    soundManager.playClick();
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));
    setActiveWindowId(null);
    soundManager.playClick();
  }, []);

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
    soundManager.playClick();
  }, []);

  const updatePosition = useCallback((id: WindowId, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position: { x, y },
      },
    }));
  }, []);

  // Format Time Helper
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }, []);

  // Achievements Definition
  const achievementsList: Achievement[] = useMemo(
    () => [
      {
        id: 1,
        name: "First Steps",
        description: "Complete your first work sprint",
        icon: "🌱",
        condition: () => cycleCount >= 1,
      },
      {
        id: 2,
        name: "Initial Productivity",
        description: "Complete 5 work cycles",
        icon: "⚡",
        condition: () => cycleCount >= 5,
      },
      {
        id: 3,
        name: "Pomodoro Master",
        description: "Complete 20 work cycles",
        icon: "👑",
        condition: () => cycleCount >= 20,
      },
      {
        id: 4,
        name: "Marathon Runner",
        description: "Complete 50 work cycles",
        icon: "🏃‍♂️",
        condition: () => cycleCount >= 50,
      },
      {
        id: 5,
        name: "First Task",
        description: "Add your first task in TaskPad 98",
        icon: "📝",
        condition: () => tasks.length >= 1,
      },
      {
        id: 6,
        name: "Task Organizer",
        description: "Add 10 tasks",
        icon: "📁",
        condition: () => tasks.length >= 10,
      },
      {
        id: 7,
        name: "Task Completed",
        description: "Mark a task as completed",
        icon: "✅",
        condition: () => tasks.some((t) => t.completed),
      },
      {
        id: 8,
        name: "Productive Machine",
        description: "Complete 5 tasks",
        icon: "🎯",
        condition: () => tasks.filter((t) => t.completed).length >= 5,
      },
      {
        id: 9,
        name: "Strict Focus",
        description: "Complete a cycle in Strict Mode",
        icon: "🔒",
        condition: () => settings.strictMode && cycleCount >= 1,
      },
      {
        id: 10,
        name: "AI Pioneer",
        description: "Generate tasks using Gemini AI",
        icon: "🤖",
        condition: () => tasks.some((t) => t.generatedByAI === true),
      },
      {
        id: 11,
        name: "Living History",
        description: "Record 10 sessions in system history",
        icon: "📊",
        condition: () => sessions.length >= 10,
      },
      {
        id: 12,
        name: "Long Rest",
        description: "Reach your first long break",
        icon: "☕",
        condition: () => cycleCount >= settings.cyclesBeforeLongBreak,
      },
      {
        id: 13,
        name: "Customizer",
        description: "Change default wallpaper or sound pack",
        icon: "🎨",
        condition: () => settings.wallpaper !== "bliss" || settings.soundPack !== "xp",
      },
      {
        id: 14,
        name: "Notepad Wizard",
        description: "Write your first note in Sticky Notes",
        icon: "📌",
        condition: () => notes.trim().length > 10,
      },
      {
        id: 15,
        name: "Explorer 98",
        description: "Open all desktop applications",
        icon: "🧭",
        condition: () => Object.values(windows).filter((w) => w.isOpen).length >= 5,
      },
    ],
    [cycleCount, tasks, settings, sessions.length, notes, windows]
  );

  // Check achievements
  useEffect(() => {
    achievementsList.forEach((ach) => {
      if (!unlockedAchievementIds.includes(ach.id) && ach.condition()) {
        setUnlockedAchievementIds((prev) => [...prev, ach.id]);
        soundManager.playAchievement();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch {}
      }
    });
  }, [achievementsList, unlockedAchievementIds]);

  // Timer Tick Engine
  useEffect(() => {
    if (!isRunning || !endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        soundManager.playAlarm();

        if (sessionType === "Work") {
          const nextCount = cycleCount + 1;
          setCycleCount(nextCount);

          // Log session
          setSessions((prev) => [
            {
              id: Date.now().toString(),
              date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              duration: settings.workTime,
              category: "Work",
              type: "Work",
            },
            ...prev,
          ]);

          const isLongBreak = nextCount % settings.cyclesBeforeLongBreak === 0;
          const nextType: SessionType = isLongBreak ? "LongBreak" : "Break";
          const nextSeconds = (isLongBreak ? settings.longBreakTime : settings.breakTime) * 60;

          setSessionType(nextType);
          setTimeLeft(nextSeconds);
          setEndTime(Date.now() + nextSeconds * 1000);
        } else {
          // Log break session
          setSessions((prev) => [
            {
              id: Date.now().toString(),
              date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              duration: sessionType === "LongBreak" ? settings.longBreakTime : settings.breakTime,
              category: "Break",
              type: sessionType,
            },
            ...prev,
          ]);

          const nextSeconds = settings.workTime * 60;
          setSessionType("Work");
          setTimeLeft(nextSeconds);
          setEndTime(Date.now() + nextSeconds * 1000);
        }

        // The new phase auto-started after the alarm: soft transition blip
        soundManager.playNotification();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, endTime, sessionType, cycleCount, settings]);

  const toggleTimer = useCallback(() => {
    if (settings.strictMode && isRunning && sessionType === "Work") {
      soundManager.playError();
      return;
    }
    soundManager.playClick();
    setIsRunning((prev) => {
      if (!prev) {
        setEndTime(Date.now() + timeLeft * 1000);
      } else {
        setEndTime(null);
      }
      return !prev;
    });
  }, [settings.strictMode, isRunning, sessionType, timeLeft]);

  const resetTimer = useCallback(() => {
    if (settings.strictMode && isRunning && sessionType === "Work") {
      soundManager.playError();
      return;
    }
    soundManager.playClick();
    setIsRunning(false);
    setEndTime(null);
    setSessionType("Work");
    setTimeLeft(settings.workTime * 60);
    setCycleCount(0);
  }, [settings.strictMode, isRunning, sessionType, settings.workTime]);

  const skipPhase = useCallback(() => {
    if (settings.strictMode && isRunning && sessionType === "Work") {
      soundManager.playError();
      return;
    }
    soundManager.playClick();
    setIsRunning(false);
    setEndTime(null);
    if (sessionType === "Work") {
      const isLongBreak = (cycleCount + 1) % settings.cyclesBeforeLongBreak === 0;
      setSessionType(isLongBreak ? "LongBreak" : "Break");
      setTimeLeft((isLongBreak ? settings.longBreakTime : settings.breakTime) * 60);
    } else {
      setSessionType("Work");
      setTimeLeft(settings.workTime * 60);
    }
  }, [isRunning, sessionType, cycleCount, settings]);

  const addTime = useCallback((seconds: number) => {
    soundManager.playClick();
    setTimeLeft((prev) => {
      const updated = prev + seconds;
      if (endTime) {
        setEndTime((end) => (end ? end + seconds * 1000 : null));
      }
      return updated;
    });
  }, [endTime]);

  // Tasks actions
  const addTask = useCallback(
    (description: string, category: TaskCategory = "Work", priority: TaskPriority = "Medium", dueDate: string | null = null, generatedByAI = false) => {
      soundManager.playClick();
      setTasks((prev) => [
        {
          id: Date.now(),
          description,
          completed: false,
          category,
          priority,
          dueDate,
          createdAt: new Date().toLocaleDateString(),
          generatedByAI,
        },
        ...prev,
      ]);
    },
    []
  );

  const editTask = useCallback((id: number, description: string) => {
    soundManager.playClick();
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, description } : t)));
  }, []);

  const toggleTask = useCallback((id: number) => {
    soundManager.playClick();
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const deleteTask = useCallback((id: number) => {
    soundManager.playClick();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const deleteTasks = useCallback((ids: number[]) => {
    soundManager.playClick();
    setTasks((prev) => prev.filter((t) => !ids.includes(t.id)));
  }, []);

  const clearCompletedTasks = useCallback(() => {
    soundManager.playClick();
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const importTasks = useCallback((newTasks: Array<{ description: string; category?: TaskCategory; priority?: TaskPriority }>) => {
    soundManager.playClick();
    const formatted: Task[] = newTasks.map((t, i) => ({
      id: Date.now() + i,
      description: t.description,
      completed: false,
      category: t.category || "Work",
      priority: t.priority || "Medium",
      createdAt: new Date().toLocaleDateString(),
      generatedByAI: true,
    }));
    setTasks((prev) => [...formatted, ...prev]);
  }, []);

  const clearSessions = useCallback(() => {
    soundManager.playClick();
    setSessions([]);
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    soundManager.playClick();
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      if (partial.workTime && !isRunning && sessionType === "Work") {
        setTimeLeft(partial.workTime * 60);
      }
      return updated;
    });
  }, [isRunning, sessionType]);

  const resetSettings = useCallback(() => {
    soundManager.playClick();
    setSettings(defaultSettings);
    setTimeLeft(defaultSettings.workTime * 60);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      const sc = settings.keyboardShortcuts;
      if (e.key === " " && !e.repeat) {
        e.preventDefault();
        toggleTimer();
      } else if (e.key.toLowerCase() === "r" && !e.repeat) {
        resetTimer();
      } else if (e.key.toLowerCase() === sc.timer) {
        openWindow("timer");
      } else if (e.key.toLowerCase() === sc.tasks) {
        openWindow("tasks");
      } else if (e.key.toLowerCase() === sc.notes) {
        openWindow("notes");
      } else if (e.key.toLowerCase() === sc.history) {
        openWindow("history");
      } else if (e.key.toLowerCase() === sc.achievements) {
        openWindow("achievements");
      } else if (e.key.toLowerCase() === sc.settings) {
        openWindow("settings");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.keyboardShortcuts, toggleTimer, resetTimer, openWindow]);

  return (
    <AppContext.Provider
      value={{
        timeLeft,
        isRunning,
        sessionType,
        cycleCount,
        toggleTimer,
        resetTimer,
        skipPhase,
        addTime,
        formatTime,
        settings,
        updateSettings,
        resetSettings,
        tasks,
        addTask,
        editTask,
        toggleTask,
        deleteTask,
        deleteTasks,
        clearCompletedTasks,
        importTasks,
        notes,
        setNotes,
        sessions,
        clearSessions,
        achievements: achievementsList,
        unlockedAchievementIds,
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        bringToFront,
        updatePosition,
        t,
        language: settings.language,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export type WindowId =
  | "timer"
  | "tasks"
  | "notes"
  | "history"
  | "achievements"
  | "settings"
  | "help"
  | "run"
  | "shutdown";

export interface WindowState {
  id: WindowId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type TaskCategory = "Study" | "Work" | "Personal" | "Leisure" | "Other";
export type TaskPriority = "High" | "Medium" | "Low";

export interface Task {
  id: number;
  description: string;
  completed: boolean;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  generatedByAI?: boolean;
}

export type SessionType = "Work" | "Break" | "LongBreak";

export interface Session {
  id: string;
  date: string;
  duration: number; // in minutes
  category: string;
  type: SessionType;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  condition: () => boolean;
  unlockedAt?: string;
}

export type Language = "en" | "pt" | "es";
export type Wallpaper = "teal98" | "bliss" | "setup" | "clouds" | "matrix" | "night";
export type SoundPack = "xp" | "win98" | "arcade" | "modern" | "mute";

export type ClockTheme = "lcd" | "led";

export interface AppSettings {
  workTime: number; // in minutes
  breakTime: number;
  longBreakTime: number;
  cyclesBeforeLongBreak: number;
  strictMode: boolean;
  notificationsEnabled: boolean;
  soundPack: SoundPack;
  volume: number; // 0 to 100
  language: Language;
  wallpaper: Wallpaper;
  crtScanlines: boolean;
  clockTheme: ClockTheme;
  keyboardShortcuts: {
    timer: string;
    history: string;
    tasks: string;
    achievements: string;
    notes: string;
    settings: string;
  };
}

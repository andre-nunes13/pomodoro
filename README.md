# 🖥️ Focus 98 — Modern Windows 98 Inspired Pomodoro

> A reimagined, high-performance Pomodoro and task management desktop operating system built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui primitives**, and **Google Gemini AI**.

---

## 🚀 Features

- ⏱️ **Pomodoro Timer**:
  - Customizable Work, Short Break, and Long Break durations.
  - Authentic retro LCD digital clock with segmented progress tracking.
  - Strict Mode (locks pause and reset during work sprints to maximize focus discipline).
  - Quick-adjust (+1 min, +5 min) buttons.
- 🗂️ **TaskPad 98 (Task Manager)**:
  - Full task organization with Categories (Work, Study, Personal, Leisure, Other) and Priorities (High, Medium, Low).
  - Inline editing, completed toggles, and category filtering.
  - Batch actions (Select All, Delete Selected, Clear Completed).
  - 🤖 **Gemini AI Task Breakdown**: Automatically decomposes large projects or topics into structured, actionable subtasks with priorities. Includes a smart fallback generator when offline.
- 📝 **Sticky Notes**:
  - Nostalgic draggable sticky note pad with multi-color themes (Classic Yellow, Mint, Cyan, Pink).
  - Auto-saved to local storage.
- 📊 **System History & Analytics**:
  - Interactive productivity charts powered by Recharts.
  - Key metrics: Total Focus Hours, Completed Cycles, and Average Duration.
  - Time-range filters (All Time, Last 7 Days, Last 30 Days).
  - One-click CSV and JSON backup export.
- 🏆 **Trophy Room (Achievements)**:
  - 15+ unlockable productivity achievements with retro badges, confetti celebration, and sound fanfare.
- 🎛️ **Control Panel (Settings)**:
  - Timer length customization.
  - Web Audio sound pack switcher (Windows 98 classic chimes, 8-bit arcade, modern tones, mute) with volume slider.
  - Wallpapers: Windows 98 Classic Teal (`#008080`), Windows XP Bliss, Setup 98 Blue, Retro Clouds, Matrix Green, Dark Slate.
  - Retro CRT scanline monitor effect toggle.
  - Multi-language support (English, Português, Español).
  - Keyboard shortcuts configuration.
- 🪟 **Retro Window Manager & Desktop OS**:
  - Multi-window desktop with dragging, minimizing, maximizing/restoring, and z-index window layering.
  - Windows 98 Taskbar with Start Menu, active depressed window buttons, and live system tray clock.
  - Starfield warp screensaver on idle.
  - Classic "Shut Down Windows" and "Run..." dialogs.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Start / Pause Timer |
| <kbd>R</kbd> | Reset Timer |
| <kbd>T</kbd> | Open Pomodoro Timer Window |
| <kbd>K</kbd> | Open TaskPad 98 Window |
| <kbd>N</kbd> | Open Sticky Notes Window |
| <kbd>H</kbd> | Open System History Window |
| <kbd>A</kbd> | Open Trophy Room (Achievements) |
| <kbd>S</kbd> | Open Control Panel (Settings) |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with authentic Windows 98 3D beveled design system
- **UI Components**: shadcn/ui & Radix UI primitives (`@radix-ui/react-*`)
- **Icons**: [Lucide React](https://lucide.dev/) & authentic retro Windows system icons
- **AI Integration**: Official `@google/genai` SDK (Gemini 2.0 Flash)
- **Charts**: [Recharts](https://recharts.org/)
- **Audio**: Web Audio API zero-latency retro sound synthesizer

---

## 📦 Getting Started

### 1. Install Dependencies

```bash
cd focus98
npm install
```

### 2. (Optional) Set up Gemini AI API Key

To enable real-time Gemini AI task generation, create a `.env.local` file in the `focus98/` directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: Even without an API key, the built-in smart heuristic template generator ensures the feature works out of the box!)*

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

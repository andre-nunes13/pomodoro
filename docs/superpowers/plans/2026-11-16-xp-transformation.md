# Windows XP Transformation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform FocusXP into an authentic Windows XP desktop environment featuring an authentic boot sequence, Bliss wallpaper default, synthesized XP sounds, categorized public assets, an XP Luna design system, and a Pomodoro counter app styled as a native Windows XP dialog.

**Architecture:** Client-side Next.js 16 (React 19, Turbopack, Tailwind 4) desktop OS simulation. Replace Windows 98 bevel system (`win98.css`) with an authentic Luna Blue visual system (`xp.css`). Reorganize flat `public/` directory into categorized subdirectories (`icons/`, `wallpapers/`, `sounds/`, `cursors/`, `screenshots/`) and purge dead files. Synthesize Windows XP startup, shutdown, error, and notification motifs via Web Audio API, setting Bliss and XP sounds as defaults. Implement a staged `BootSequence` (black boot screen with moving 3-pill progress bar -> Luna logon screen with click-to-login -> startup sound -> desktop).

**Tech Stack:** Next.js 16.4.5 App Router, React 19.3, TypeScript 5, Tailwind CSS 4, Web Audio API, Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-16-xp-upgrade-design.md`

## Global Constraints

- Must compile cleanly with `npm run build` and pass `npm run lint` with 0 errors.
- Client-only desktop environment rendered with `ssr: false` in `src/app/page.tsx`.
- Browser autoplay policy: AudioContext must be unlocked via user gesture; XP startup sound plays upon user interaction on the logon welcome screen.
- Persist existing `localStorage` keys (`focus98_settings`, `focus98_tasks`, etc.) without breakages or forced resets.
- All new user-facing strings must support English (`en`), Portuguese (`pt`), and Spanish (`es`) in `src/lib/translations.ts`.
- No copyrighted Microsoft `.wav` or binary media additions: all new sound motifs are synthesized in Web Audio in `src/lib/audio.ts`.
- CRT scanlines effect and fullscreen/mobile support must continue functioning.

## Review Focus

1. Asset path 404s: Verify that every moved image, icon, cursor, wallpaper, and sound resolves to its new `/icons/`, `/wallpapers/`, `/sounds/`, or `/cursors/` path.
2. Autoplay block on boot: Ensure boot sequence does not fail silently if audio is blocked; user click on logon tile reliably unlocks audio and triggers the startup sound.
3. First-paint flash: Loading fallback in `src/app/page.tsx` must be black (`#000000`) instead of teal to avoid flickering before the boot screen mounts.
4. Sound pack selection: Switching between `xp`, `win98`, `arcade`, `modern`, and `mute` in Settings must update real-time behavior without errors.
5. Window frame and Pomodoro timer responsiveness: Luna chrome must preserve window dragging, minimizing, maximizing, resizing, and control clicks across screen sizes.

---

### Task 1: Re-organize `public/` Assets & Remove Dead Legacy Files

**Files:**
- Create: Directories `public/icons`, `public/wallpapers`, `public/sounds`, `public/cursors`, `public/screenshots`
- Move:
  - `public/bliss.jpg` -> `public/wallpapers/bliss.jpg`
  - `public/sound.mp3` -> `public/sounds/alarm.mp3`
  - `public/xp-cursor.cur` -> `public/cursors/xp-cursor.cur`
  - `public/xp-pointer.cur` -> `public/cursors/xp-pointer.cur`
  - `public/screenshot-desktop.png` -> `public/screenshots/screenshot-desktop.png`
  - `public/*-icon.png` -> `public/icons/`
- Delete:
  - Dead public files: `public/screenshot-desktop.png.png`, `public/xp-icon.png`, `public/battery-icon.png`, `public/network-icon.png`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `public/file.svg`, `public/globe.svg`, `public/index.html`, `public/service-worker.js`, `public/404.html`
  - Dead CRA files: `src/App.js`, `src/index.js`, `src/components/Achievements.js`, `src/components/PomodoroTimer.js`, `src/components/SessionHistory.js`, `src/components/Settings.js`, `src/components/StickyNote.js`, `src/components/Taskbar.js`, `src/components/Taskbar.css`, `src/components/TaskList.js`, `src/context/AppContext.js`, `src/context/translations.js`, `src/chakra.config.js`, `src/App.css`, `src/index.css`, `src/logo.svg`, `src/reportWebVitals.js`
- Modify:
  - `src/app/globals.css` (update cursor paths)
  - `src/app/layout.tsx` (update icon path)
  - `src/lib/audio.ts` (update alarm sound path)
  - `src/components/desktop/Desktop.tsx` (update wallpaper and icon paths)
  - `src/components/desktop/DesktopIcon.tsx` (update default icon path)
  - `src/components/desktop/StartMenu.tsx` (update icon paths)
  - `src/components/desktop/SystemTray.tsx` (update volume icon paths)
  - `src/components/desktop/Taskbar.tsx` (update start icon path)
  - `src/components/apps/HelpDialog.tsx` (update focusxp icon path)
  - `src/components/apps/RunDialog.tsx` (update run icon path)
  - `src/components/apps/ShutdownDialog.tsx` (update power icon path)
  - `src/context/AppContext.tsx` (update initial window icon paths)

**Interfaces:**
- Consumes: Existing asset paths in `src/`
- Produces: Clean asset paths pointing to `/icons/`, `/wallpapers/`, `/sounds/`, `/cursors/`, `/screenshots/`

- [ ] **Step 1: Create category directories in `public/` and move assets**
  Create `public/icons`, `public/wallpapers`, `public/sounds`, `public/cursors`, `public/screenshots`. Move `bliss.jpg`, `sound.mp3` (as `alarm.mp3`), `.cur` files, `screenshot-desktop.png`, and icons.

- [ ] **Step 2: Delete dead assets and unreachable CRA legacy files**
  Delete confirmed dead assets in `public/` and `.js` / `.css` CRA legacy files in `src/`.

- [ ] **Step 3: Update all path references across `src/` to match new asset locations**
  Update `globals.css`, `layout.tsx`, `audio.ts`, `Desktop.tsx`, `DesktopIcon.tsx`, `StartMenu.tsx`, `SystemTray.tsx`, `Taskbar.tsx`, `HelpDialog.tsx`, `RunDialog.tsx`, `ShutdownDialog.tsx`, and `AppContext.tsx`.

- [ ] **Step 4: Run build to verify no broken imports or missing files**
  Run: `npm run build`
  Expected: Compiled successfully with 0 errors.

- [ ] **Step 5: Commit**
  ```bash
  git add public/ src/
  git commit -m "refactor(assets): reorganize public folder and purge dead files"
  ```

---

### Task 2: Sound System Expansion & XP Defaults

**Files:**
- Modify: `src/lib/audio.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/translations.ts`
- Modify: `src/context/AppContext.tsx`
- Modify: `src/components/apps/SettingsApp.tsx`
- Modify: `src/components/apps/ShutdownDialog.tsx`

**Interfaces:**
- Consumes: Web Audio API AudioContext
- Produces:
  - `SoundManager.prototype.playStartupXp(): void`
  - `SoundManager.prototype.playShutdownXp(): void`
  - `SoundManager.prototype.playError(): void`
  - `SoundManager.prototype.playNotification(): void`
  - `SoundPack`: `"xp" | "win98" | "arcade" | "modern" | "mute"`
  - `Wallpaper`: default is `"bliss"`
  - `SoundPack`: default is `"xp"`

- [ ] **Step 1: Ensure Web Audio motifs and sound packs in `src/lib/audio.ts`**
  Implement authentic XP startup chord/bell motif (`playStartupXp`), shutdown descending chords (`playShutdownXp`), critical stop two-tone error (`playError`), notification balloon blip (`playNotification`), and distinct audio parameters for `xp`, `modern`, `arcade`, and `win98` packs. Point alarm sound to `/sounds/alarm.mp3`.

- [ ] **Step 2: Update `types.ts` and `translations.ts` for XP sound pack**
  Ensure `"xp"` is in `SoundPack` type and add i18n labels (`en`: "Windows XP", `pt`: "Windows XP", `es`: "Windows XP").

- [ ] **Step 3: Set Bliss as default wallpaper and XP as default sound pack in `AppContext.tsx`**
  Update `defaultSettings`: `wallpaper: "bliss"`, `soundPack: "xp"`. Update Customizer achievement condition. Wire `soundManager.playError()` to strict mode violations and `soundManager.playNotification()` to auto-phase transitions.

- [ ] **Step 4: Wire `ShutdownDialog.tsx` to call `playShutdownXp()` on shutdown confirm**
  When user selects shutdown action and clicks OK, trigger `soundManager.playShutdownXp()`.

- [ ] **Step 5: Update `SettingsApp.tsx` to expose Windows XP sound pack in selector**
  Include `"xp"` option in sound pack dropdown.

- [ ] **Step 6: Run build to verify audio and context typing**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 7: Commit**
  ```bash
  git add src/lib/audio.ts src/lib/types.ts src/lib/translations.ts src/context/AppContext.tsx src/components/apps/SettingsApp.tsx src/components/apps/ShutdownDialog.tsx
  git commit -m "feat(audio): add XP synthesized motifs and set bliss and xp sound pack as default"
  ```

---

### Task 3: Luna Design System (`src/styles/xp.css`) & Typography

**Files:**
- Create: `src/styles/xp.css`
- Delete: `src/styles/win98.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: CSS custom properties and standard Tailwind utilities
- Produces:
  - `.xp-window`: Luna window container styling with 8px rounded top corners and blue outer border.
  - `.xp-titlebar`: Active Luna blue gradient (`linear-gradient(180deg, #0a246a 0%, #0055ea 8%, #0855dd 40%, #0040be 88%, #002e99 93%, #0055ea 100%)`) with white title text and subtle drop shadow.
  - `.xp-titlebar.inactive`: Muted Luna blue-gray gradient (`linear-gradient(180deg, #7a96df 0%, #a4bde7 100%)`).
  - `.xp-caption-btn`: Luna minimize, maximize, and red close (`.xp-caption-close`) caption buttons.
  - `.xp-btn`: Authentic rounded XP Luna button with 3px border radius, subtle border gradient, warm hover state, and blue focus ring.
  - `.xp-groupbox`: XP groupbox with 1px border (`#d0d0bf`), rounded 4px corners, and styled legend.
  - `.xp-sunken` / `.xp-field`: Sunken 1px input field with `#7f9db9` border.
  - `.xp-progress`: XP chunked green progress bar trough and glowing segmented progress blocks.
  - `.xp-statusbar`: Classic XP status bar with segment panels and bottom-right resize gripper.
  - `.xp-font`: Tahoma, "Segoe UI", Arial, sans-serif font stack.

- [ ] **Step 1: Create `src/styles/xp.css` with authentic Windows XP Luna Blue tokens and classes**
  Define CSS variables (`--xp-face`, `--xp-blue-dark`, `--xp-blue-light`, `--xp-highlight`, etc.) and classes for window frames, titlebars, buttons, groupboxes, text fields, progress bars, and status bars.

- [ ] **Step 2: Update `src/app/globals.css` to import `xp.css` instead of `win98.css`**
  Update font stack to prioritize Tahoma and Segoe UI, set background defaults, and adjust retro scrollbars for Luna styling.

- [ ] **Step 3: Remove `src/styles/win98.css`**
  Delete the file once references are redirected.

- [ ] **Step 4: Run build to test stylesheet syntax**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/styles/xp.css src/app/globals.css
  git commit -m "feat(styles): implement authentic Windows XP Luna design system"
  ```

---

### Task 4: Windows XP Desktop Chrome Overhaul

**Files:**
- Modify: `src/components/desktop/WindowFrame.tsx`
- Modify: `src/components/desktop/Taskbar.tsx`
- Modify: `src/components/desktop/StartMenu.tsx`
- Modify: `src/components/desktop/SystemTray.tsx`
- Modify: `src/components/desktop/DesktopIcon.tsx`
- Modify: `src/components/desktop/Desktop.tsx`

**Interfaces:**
- Consumes: `xp.css` classes and `AppContext` window state
- Produces: Authentic XP Luna desktop chrome:
  - `WindowFrame`: Rounded top corners, Luna titlebar gradient, XP caption buttons (minimize, maximize, red close button).
  - `Taskbar`: Rich blue Luna gradient bar, green pill "start" button with XP flag, recessed window buttons with orange glow on alert, sky-blue tray container.
  - `StartMenu`: Two-column XP Start Menu layout with blue user header banner, white left column (frequent apps), light-blue right column (places & settings), dark blue footer (Log Off & Turn Off Computer).
  - `DesktopIcon`: XP selection styling with translucent blue box and white text with drop shadow.

- [ ] **Step 1: Refactor `WindowFrame.tsx` to authentic Luna Window Chrome**
  Replace `win98-box`, `win98-titlebar`, and `win98-title-btn` with `xp-window`, `xp-titlebar`, and `xp-caption-btn`. Use red close button with white '✕' and rounded top corners.

- [ ] **Step 2: Refactor `Taskbar.tsx` to Luna Blue Taskbar & Green Start Button**
  Replace `win98-taskbar` with Luna gradient styling. Style Start button with iconic curved green pill design, XP flag icon, and bold italic "start" label. Style window tabs with Luna active/inactive bevels.

- [ ] **Step 3: Refactor `StartMenu.tsx` to Two-Column Windows XP Start Menu**
  Implement user header with avatar and username, white left column for apps, soft blue right column for system items, and dark blue footer with Log Off and Turn Off buttons.

- [ ] **Step 4: Refactor `SystemTray.tsx` and `DesktopIcon.tsx` to Luna styling**
  Style tray area with indented sky-blue Luna styling and clean clock. Style desktop icons with XP selection highlight.

- [ ] **Step 5: Run build to verify desktop chrome compilation**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 6: Commit**
  ```bash
  git add src/components/desktop/
  git commit -m "feat(desktop): overhaul WindowFrame, Taskbar, StartMenu, and Desktop to Luna XP"
  ```

---

### Task 5: Pomodoro Counter App XP Dialog Overhaul

**Files:**
- Modify: `src/components/apps/PomodoroTimerApp.tsx`

**Interfaces:**
- Consumes: `useAppContext()`, `xp.css` classes
- Produces: XP-styled native Pomodoro dialog window:
  - Styled XP groupboxes for Timer, Phase Info, and Controls.
  - Authentic XP segmented green progress bar indicating session completion.
  - Luna push buttons (Start, Pause, Reset, Skip) with hover, active, and default focus styling.
  - Status bar with XP segment panels (cycles count, streak, mode).
  - Preserved LCD/LED display toggle with refined sunken bevel.

- [ ] **Step 1: Update `PomodoroTimerApp.tsx` layout and replace `win98-*` classes with `xp-*`**
  Replace all `win98-box`, `win98-btn`, `win98-sunken` with `xp-groupbox`, `xp-btn`, `xp-sunken`.

- [ ] **Step 2: Implement segmented Windows XP green progress bar**
  Build a segmented progress bar using green rectangle blocks (`#32cd32`) inside a recessed trough to replicate authentic XP progress dialogs.

- [ ] **Step 3: Refactor control buttons and action triggers**
  Style "Start" as the prominent Luna default button (blue focus halo), with matching Pause, Reset, and Skip buttons.

- [ ] **Step 4: Refactor bottom status bar to XP segmented panel style**
  Display session stats in recessed XP status bar panels with resize grip styling.

- [ ] **Step 5: Run build to verify `PomodoroTimerApp`**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 6: Commit**
  ```bash
  git add src/components/apps/PomodoroTimerApp.tsx
  git commit -m "feat(pomodoro): restyle PomodoroTimerApp as authentic Windows XP dialog"
  ```

---

### Task 6: Authentic Windows XP Startup Boot Sequence

**Files:**
- Create: `src/components/desktop/BootSequence.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `soundManager.playStartupXp()` from `src/lib/audio.ts`
- Produces: `BootSequence` component with 4 distinct phases:
  1. Boot screen: Pure black screen with Windows XP logo (4-color flag, "Microsoft Windows XP Professional") and continuous scrolling 3-pill blue progress trough.
  2. Logon / Welcome screen: Classic Luna blue split screen with user avatar ("Administrator" or "FocusXP User") and "To begin, click your user name".
  3. Logon action: Clicking user tile or pressing Enter triggers "Loading your personal settings...", plays `playStartupXp()`, and fades out.
  4. Skip support: Esc or Space immediately dismisses boot sequence.
- Loading fallback in `src/app/page.tsx`: Pure black background (`#000000`) with no teal flash.

- [ ] **Step 1: Create `src/components/desktop/BootSequence.tsx`**
  Implement state machine: `'boot' -> 'logon' -> 'logging_in' -> 'complete'`.
  Implement authentic CSS animation for the 3 royal-blue glowing pills scrolling smoothly left-to-right across the boot trough.
  Implement authentic XP logon screen with user card, avatar, and click-to-login handler that invokes `soundManager.playStartupXp()`.

- [ ] **Step 2: Integrate `BootSequence` into `src/app/page.tsx` and adjust initial loading state**
  Replace teal "Loading desktop environment..." fallback in `page.tsx` with a black `#000000` screen. Mount `BootSequence` over the Desktop until `onComplete` is fired.

- [ ] **Step 3: Run build to verify boot sequence compilation**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/desktop/BootSequence.tsx src/app/page.tsx
  git commit -m "feat(boot): implement authentic Windows XP boot sequence and logon screen"
  ```

---

### Task 7: App Dialogs XP Migration, End-to-End Verification & Polish

**Files:**
- Modify: `src/components/apps/AchievementsApp.tsx`
- Modify: `src/components/apps/HelpDialog.tsx`
- Modify: `src/components/apps/RunDialog.tsx`
- Modify: `src/components/apps/SessionHistoryApp.tsx`
- Modify: `src/components/apps/SettingsApp.tsx`
- Modify: `src/components/apps/ShutdownDialog.tsx`
- Modify: `src/components/apps/StickyNotesApp.tsx`
- Modify: `src/components/apps/TaskManagerApp.tsx`

**Interfaces:**
- Consumes: `xp.css`
- Produces: Complete migration of all remaining dialogs from `win98-*` to `xp-*` classes, ensuring zero stale classes and cohesive Luna aesthetics.

- [ ] **Step 1: Migrate all remaining application dialogs to `xp-*`**
  Replace `win98-*` classes in `AchievementsApp`, `HelpDialog`, `RunDialog`, `SessionHistoryApp`, `SettingsApp`, `ShutdownDialog`, `StickyNotesApp`, and `TaskManagerApp`.

- [ ] **Step 2: Run grep check to verify zero `win98-` class references remain**
  Command: Check for any remaining occurrences of `win98-` in `src/`.
  Expected: 0 occurrences outside of legacy comments or migration docs.

- [ ] **Step 3: Run full lint and production build**
  Run: `npm run lint` and `npm run build`
  Expected: Both pass with 0 errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/apps/
  git commit -m "refactor(apps): complete XP Luna styling across all system dialogs and apps"
  ```

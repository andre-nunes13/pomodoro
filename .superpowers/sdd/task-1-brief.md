# Task 1 Brief: Re-organize public/ Assets & Remove Dead Legacy Files

## Requirements
1. Create directories:
   - `public/icons`
   - `public/wallpapers`
   - `public/sounds`
   - `public/cursors`
   - `public/screenshots`

2. Move existing assets:
   - `public/bliss.jpg` -> `public/wallpapers/bliss.jpg`
   - `public/sound.mp3` -> `public/sounds/alarm.mp3`
   - `public/xp-cursor.cur` -> `public/cursors/xp-cursor.cur`
   - `public/xp-pointer.cur` -> `public/cursors/xp-pointer.cur`
   - `public/screenshot-desktop.png` -> `public/screenshots/screenshot-desktop.png`
   - Move all icons to `public/icons/`:
     - `public/focusxp-icon.png` -> `public/icons/focusxp-icon.png`
     - `public/documents-icon.png` -> `public/icons/documents-icon.png`
     - `public/sticky-icon.png` -> `public/icons/sticky-icon.png`
     - `public/computer-icon.png` -> `public/icons/computer-icon.png`
     - `public/help-icon.png` -> `public/icons/help-icon.png`
     - `public/control-panel-icon.png` -> `public/icons/control-panel-icon.png`
     - `public/run-icon.png` -> `public/icons/run-icon.png`
     - `public/power-icon.png` -> `public/icons/power-icon.png`
     - `public/start-icon.png` -> `public/icons/start-icon.png`
     - `public/volume-icon.png` -> `public/icons/volume-icon.png`
     - `public/volume-muted-icon.png` -> `public/icons/volume-muted-icon.png`

3. Keep at root of `public/`:
   - `public/favicon.ico`
   - `public/favicon-96x96.png`
   - `public/favicon.svg`
   - `public/apple-touch-icon.png`
   - `public/web-app-manifest-192x192.png`
   - `public/web-app-manifest-512x512.png`
   - `public/manifest.json`
   - `public/robots.txt`

4. Delete dead public assets:
   - `public/screenshot-desktop.png.png`
   - `public/xp-icon.png`
   - `public/battery-icon.png`
   - `public/network-icon.png`
   - `public/next.svg`
   - `public/vercel.svg`
   - `public/window.svg`
   - `public/file.svg`
   - `public/globe.svg`
   - `public/index.html`
   - `public/service-worker.js`
   - `public/404.html`

5. Delete dead legacy CRA files in `src/`:
   - `src/App.js`
   - `src/index.js`
   - `src/components/Achievements.js`
   - `src/components/PomodoroTimer.js`
   - `src/components/SessionHistory.js`
   - `src/components/Settings.js`
   - `src/components/StickyNote.js`
   - `src/components/Taskbar.js`
   - `src/components/Taskbar.css`
   - `src/components/TaskList.js`
   - `src/context/AppContext.js`
   - `src/context/translations.js`
   - `src/chakra.config.js`
   - `src/App.css`
   - `src/index.css`
   - `src/logo.svg`
   - `src/reportWebVitals.js`

6. Update all references in `src/`:
   - `src/app/globals.css`:
     `cursor: url("/cursors/xp-cursor.cur"), default;`
     `cursor: url("/cursors/xp-pointer.cur"), pointer;`
   - `src/app/layout.tsx`:
     `icon: "/icons/focusxp-icon.png",`
     add `<link rel="manifest" href="/manifest.json" />` if not present
   - `src/lib/audio.ts`:
     `new Audio("/sounds/alarm.mp3")`
   - `src/components/desktop/Desktop.tsx`:
     `backgroundImage: "url('/wallpapers/bliss.jpg')"`
     icons: `icon="/icons/focusxp-icon.png"`, `icon="/icons/documents-icon.png"`, etc.
   - `src/components/desktop/DesktopIcon.tsx`:
     default icon fallback `icon = "/icons/focusxp-icon.png"`
   - `src/components/desktop/StartMenu.tsx`:
     all icon paths updated to `/icons/<name>-icon.png`
   - `src/components/desktop/SystemTray.tsx`:
     `/icons/volume-icon.png`, `/icons/volume-muted-icon.png`
   - `src/components/desktop/Taskbar.tsx`:
     `/icons/start-icon.png`
   - `src/components/apps/HelpDialog.tsx`:
     `/icons/focusxp-icon.png`
   - `src/components/apps/RunDialog.tsx`:
     `/icons/run-icon.png`
   - `src/components/apps/ShutdownDialog.tsx`:
     `/icons/power-icon.png`
   - `src/context/AppContext.tsx`:
     initial windows default icon paths: `/icons/focusxp-icon.png`, `/icons/documents-icon.png`, `/icons/control-panel-icon.png`, etc.

7. Verification:
   Run `npm run build` and ensure build succeeds with 0 errors.
   Write report to `.superpowers/sdd/task-1-report.md`.

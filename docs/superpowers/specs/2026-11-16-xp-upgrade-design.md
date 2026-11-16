# FocusXP — Windows XP Transformation Design

Date: 2026-11-16
Status: Builder check completed; answers incorporated (see §11)

## 1. Intent & Why

FocusXP (`focus98` package, repo `focusxp`) is a Next.js desktop-OS simulation
built around a Pomodoro counter. Its git history shows the trajectory: it was
rewritten *as* a "Windows XP-style desktop app" (`af1837d`), carries XP assets
already (`bliss.jpg`, `xp-cursor.cur`, `xp-pointer.cur`, `focusxp-icon.png`),
but the current UI drifted into a Windows 98 look ("Focus 98", `win98.css`
bevels, gray `#c0c0c0` chrome). The goal of this work is to complete the XP
transformation: a real Windows XP boot sequence, Bliss as the default
wallpaper, XP-flavored sounds, an XP-Luna visual system for the app (with the
Pomodoro timer as the centerpiece), and a tidy `public/` tree.

Success looks like: opening the app feels like booting Windows XP — black boot
screen with the flag and scrolling progress bar, XP startup sound at the
welcome screen, Bliss desktop, Luna-blue chrome — and the Pomodoro timer reads
as a native XP dialog.

## 2. Goals

1. **Startup animation** that replicates the real Windows XP boot sequence
   (boot screen → welcome screen + startup sound → desktop), replacing the
   current teal "Loading desktop environment..." fallback.
2. **Bliss wallpaper is the default** for new users.
3. **New sounds**: XP-style startup, shutdown, error, and an `xp` sound pack
   that becomes the default; existing packs keep working.
4. **Re-organize `public/`** into category subfolders; delete dead assets;
   update all references.
5. **Pomodoro counter app looks like Windows XP**: app-wide Luna visual system
   (window chrome, taskbar, Start menu, controls) with the timer window
   restyled as a native XP dialog.
6. **Good code**: no dead code shipped, clean design-system naming, all work
   verified by build + lint.

## 3. Non-goals / Anti-goals

- No Win98-vs-XP theme switcher (single XP theme; no dual-system maintenance).
- No product rename/rebrand (name, README prose beyond stale style claims,
  and keyboard shortcuts stay as they are).
- No new app features (no tray balloons, no new windows).
- No copyrighted Microsoft assets added: sounds are synthesized with the
  existing Web Audio architecture, not ripped `.wav` files. `bliss.jpg`
  (already in the repo) is kept.
- No changes to behavior: window manager, i18n (en/pt/es), localStorage keys
  and persistence, strict mode, achievements, Gemini task generation, mobile
  full-screen windows all keep working.
- Pixel-parity with XP screenshots is *not* required; recognizable Luna
  fidelity is.
- The empty `focus98/` directory is left alone (git does not track it).

## 4. Interpretation call (documented, correctable)

"The pomodoro counter app" = **the application as a whole** (it is the
pomodoro counter app; repo/origin history is the old pomodoro CRA app, and the
rewrite commit called it "a Windows XP-style desktop app"). Therefore goal 5
is an app-wide XP re-skin, with `PomodoroTimerApp` receiving the most
attention. The narrower reading (timer window only) was rejected because it
would leave Win98 chrome around XP content, which contradicts goals 1–3 and
the repo's trajectory.

## 5. Current state (verified)

- **Entry**: `src/app/page.tsx` dynamically loads `Desktop` with `ssr:false`;
  the loading fallback is a teal panel (`page.tsx:9–16`). **No boot/splash
  animation exists anywhere in the live app.**
- **Audio**: `src/lib/audio.ts` singleton `SoundManager`, all sounds
  synthesized (click, alarm, achievement, warning, startup). `playStartup()`
  (Win98 chime, `audio.ts:178`) is **never called**. Packs
  `win98|arcade|modern|mute` barely differ; `modern` is a no-op. Only file
  sound: `public/sound.mp3` (3.2 s alarm fallback).
- **Wallpaper**: `Desktop.tsx:52–75` maps ids → color/gradient; only `bliss`
  uses an image (`/bliss.jpg`, a genuine 4400×3300 Bliss photo, 2.91 MiB).
  Default is `teal98` (`AppContext.tsx:84`).
- **Design system**: `src/styles/win98.css` (229 lines) defines `win98-*`
  classes used across ~15 components; Tailwind v4 CSS-first (no config file);
  body font MS Sans Serif + XP `.cur` cursors (`globals.css`).
- **`public/`**: 36 flat entries; ≥12 dead (CRA/Firebase/Next-template
  leftovers, one stray duplicate `screenshot-desktop.png.png`).
- **Dead legacy code**: CRA/Chakra files (`src/App.js`, `src/index.js`,
  `src/components/*.js`, `src/context/AppContext.js`, `translations.js`,
  `chakra.config.js`, `App.css`, `index.css`, `Taskbar.css`, `logo.svg`,
  `reportWebVitals.js`) are unreachable from the Next bundle.
- **Timer**: `src/components/apps/PomodoroTimerApp.tsx` (211 lines), Win98
  LCD/LED wells, plain monospace digits, `win98-btn` controls; opens as
  window id `timer` via `AppContext.defaultWindows`.
- **Separate `pomodoro/` folder was deleted** (git-ignored, orphaned clone;
  content recoverable from git history and the GitHub mirror). Not restored —
  it is out of scope; the root app is its successor.

## 6. Approaches considered

### 6.1 Boot animation

- **A. CSS-only fake boot** (progress bar overlay, then desktop). Cheap, but
  no phased sequencing, awkward audio timing, hard to skip cleanly.
- **B. Phased React boot component** (chosen): a `BootSequence` overlay with
  explicit phases — black boot screen (flag + wordmark + scrolling-block
  progress trough, ~2.5–3 s) → Luna welcome screen (user tile, "click to
  log in" — the click satisfies browser autoplay policy and doubles as XP's
  log-on gesture) → XP startup sound → desktop fade-in. Skippable via
  click/keypress; runs once per full page load (SPA navigation won't re-trigger).
  No new dependencies; testable; phases are plain state.
- **C. Video file recreation**. Authentic frames, but heavy asset, bandwidth
  cost, licensing risk, and worse than code for a 3-second interaction.

**Chosen: B.** Real XP behavior = sequenced phases + startup sound; browser
autoplay policy forces a user gesture before audio, which maps naturally onto
XP's log-on screen. The current teal `loading.tsx` fallback is retinted
black so the first paint blends into the boot screen.

### 6.2 XP visual system

- **A. Overwrite `win98.css` values in place** (keep class names). Small
  diff, but class names then lie (`win98-btn` rendering an XP button) — bad
  code, confusing for the next change.
- **B. New `src/styles/xp.css` Luna design system; migrate every `win98-*`
  usage to `xp-*`; delete `win98.css`** (chosen). One design system, honest
  names, mechanical migration (grep-driven), leaves no dual-system cruft.
- **C. Dual-theme system with a switcher.** Explicitly a non-goal (extra
  scope, double maintenance).

**Chosen: B.** Migration is mechanical and parallelizable; the result is one
XP design system with tokens (`--xp-face #ECE9D8`, Luna title/taskbar
gradients, selection blue `#316AC5`, Tahoma-based font stack, XP button/field/
groupbox/progress/statusbar classes). Exact Luna hex values and gradient stops
are verified against reference screenshots during implementation (left to the
builder).

Scope of the re-skin: `globals.css` (font, background), `WindowFrame` (Luna
gradient title bar with rounded top corners, XP caption buttons incl. red
close), `Taskbar` (Luna blue gradient, green rounded Start button, XP tray),
`StartMenu` (XP two-column blue menu with user header and green footer bar),
`SystemTray`, `DesktopIcon` labels (XP selection highlight), and every dialog
surface that used `win98-box`/`win98-btn`/`win98-sunken`/etc. The CRT
scanline feature keeps working (it is orthogonal).

### 6.3 Sounds

- **A. Ship recorded XP `.wav` samples.** Authentic, but copyrighted
  Microsoft assets — rejected (anti-goal).
- **B. Synthesize XP-style sounds in the existing `SoundManager`** (chosen):
  zero assets, consistent architecture, volume/pack/mute plumbing already
  exists.
- **C. Third-party royalty-free samples.** Licensing audit + asset pipeline
  for little gain over B.

**Chosen: B.** New sounds, all synthesized:

| Sound | Purpose | Wired to |
|---|---|---|
| `playStartupXp()` | XP startup motif (warm layered chords, ~4–6 s envelope) | boot welcome-screen click |
| `playShutdownXp()` | XP shutdown descending motif | `ShutdownDialog` confirm |
| `playError()` | XP "critical stop" two-tone | strict-mode denial (replaces plain warning), invalid `Run...` command |
| `playNotification()` | soft balloon blip | phase auto-transition (work⇄break) feedback alongside the alarm |

Plus: a new **`xp` sound pack (default)** giving click/alarm/achievement/
warning distinct XP-flavored synthesis parameters, and a real implementation
for the `modern` pack (currently a no-op) so every pack option does something
honest. `SettingsApp` gets the new pack option with en/pt/es labels.

### 6.4 `public/` reorganization

Target tree (standard meta files stay at root — Next/browsers expect them):

```
public/
  favicon.ico, favicon-96x96.png, favicon.svg, apple-touch-icon.png,
  web-app-manifest-192x192.png, web-app-manifest-512x512.png,
  manifest.json, robots.txt
  icons/        focusxp, documents, sticky, computer, help, control-panel,
                run, power, start, volume, volume-muted (+ screenshots? no)
  wallpapers/   bliss.jpg
  sounds/       alarm.mp3          (renamed from sound.mp3)
  cursors/      xp-cursor.cur, xp-pointer.cur
  screenshots/  screenshot-desktop.png
```

Delete (verified dead): `screenshot-desktop.png.png` (stray dup),
`xp-icon.png` (dup of focusxp-icon — verify byte-identity first),
`battery-icon.png`, `network-icon.png`, `next.svg`, `vercel.svg`,
`window.svg`, `file.svg`, `globe.svg`, `index.html`, `service-worker.js`,
`404.html`.

Reference updates: `Desktop.tsx` (bliss path), `audio.ts` (alarm path),
`globals.css` (cursor paths), `layout.tsx` (icon + wire `<link rel="manifest">`),
icon path strings in `AppContext.tsx`, `Desktop.tsx`, `StartMenu.tsx`,
`Taskbar.tsx`, `HelpDialog.tsx`, `RunDialog.tsx`, `ShutdownDialog.tsx`, plus
new boot-screen asset paths. All moves are plain `path` string changes — no
behavior change.

Also included (good-code cleanup, reversible via git): delete the dead CRA
legacy files listed in §5, since they are unreachable and duplicate the
successor app's code.

## 7. Key decisions (as made)

| # | Decision | Rationale |
|---|---|---|
| D1 | Boot runs on **every full page load**, skippable (click/any key), total ≤ ~5 s | Real PCs boot every power-on; skip respects repeat visitors |
| D2 | Startup sound plays on the **welcome-screen click** | Browser autoplay policy requires a gesture; maps to XP log-on |
| D3 | Bliss becomes default `wallpaper`; **no forced migration** of existing `localStorage["focus98_settings"]` | Stored value = explicit user state; default applies to fresh installs |
| D4 | Default `soundPack` becomes `"xp"`; existing packs retained | New default sound identity; no user lock-out |
| D5 | Design system migrates `win98-*` → `xp-*`, one system only | Honest naming, no dual theme |
| D6 | Sounds synthesized, never sampled | Licensing; matches existing architecture |
| D7 | `public/` meta files stay at root; content in category folders | Next/browsers expect root `favicon.ico`/`robots.txt`/`manifest.json` |
| D8 | Dead CRA files in `src/` deleted | Unreachable, duplicated, preserved in git history |
| D9 | Boot overlay is `position: fixed`, `z-index` above screensaver (`99999`) but the app beneath mounts normally | No changes to window manager internals |

## 8. Constraints

- Next.js 16.4.5 App Router, React 19.3, Tailwind 4 (CSS-first — no
  `tailwind.config`), TypeScript; desktop is client-only (`ssr:false`).
- All new user-facing strings need en/pt/es entries in `src/lib/translations.ts`.
- localStorage keys (`focus98_*`) must remain stable.
- Autoplay policy (D2); `AudioContext` must resume on user gesture (already
  handled in `SoundManager`).
- Verification available: `npm run lint`, `npm run build`; browser check via
  `next dev`.

## 9. Workstream sketch (for the plan; parallelizable)

1. **Public reorg + dead-file cleanup** (mechanical; touches reference
   strings — do first to avoid path conflicts).
2. **XP design system** (`xp.css`, globals, migration of `win98-*` usages).
3. **Desktop chrome** (WindowFrame, Taskbar, StartMenu, SystemTray,
   DesktopIcon) on top of the new system.
4. **PomodoroTimerApp XP restyle** (group boxes, XP buttons, XP progress,
   status bar, sunken display field; keep lcd/led toggle and all logic).
5. **Boot sequence** (`BootSequence` component + `page.tsx` integration +
   black loading fallback).
6. **Sounds** (`audio.ts` additions + pack behavior + wiring + Settings/i18n).
7. **Integration + verification** (lint, build, dev-server smoke check of
   boot → desktop → timer → shutdown sound).

Dependency notes: 2 → 3, 4 (need `xp-*` classes); 5 → 6 partially (boot
calls `playStartupXp()` — interface fixed in this doc so both can proceed in
parallel: boot agent calls `soundManager.playStartupXp()` which the audio
agent implements; integration task verifies). 1 runs first (path churn).

## 10. What's left to the builder

- Exact Luna hex values/gradient stops, rounded-corner radii, caption-button
  geometry — verify against XP reference screenshots.
- Boot phase timings, progress-block animation, welcome-screen layout details.
- Web Audio synthesis parameters for each new sound (waveforms, envelopes,
  note choices approximating the XP motifs).
- Component-internal structure and the final `xp-*` class inventory.
- Test/verification steps and any i18n string wording.

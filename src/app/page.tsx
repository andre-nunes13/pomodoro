"use client";

import dynamic from "next/dynamic";

const Desktop = dynamic(
  () => import("@/components/desktop/Desktop").then((mod) => mod.Desktop),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-[#008080] flex items-center justify-center font-sans select-none text-white">
        <div className="win98-box p-3 text-black flex flex-col items-center gap-2 shadow-2xl">
          <div className="win98-titlebar w-56 text-center text-xs px-2 py-0.5">Focus 98</div>
          <div className="text-xs font-mono py-2">Loading desktop environment...</div>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="w-full h-full">
      <Desktop />
    </main>
  );
}

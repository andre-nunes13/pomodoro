import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Focus 98 • Retro Windows 98 Pomodoro",
  description:
    "A nostalgic Windows 98-inspired productivity operating system featuring Pomodoro timer, task manager with Gemini AI, sticky notes, and session history.",
  icons: {
    icon: "/focusxp-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlaceQuest — Gamified Engineering Placement Prep",
  description:
    "Free, interactive, game-based placement training for engineering students across CS, Robotics, Electrical, and Core domains.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PlaceQuest",
  },
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${manrope.variable} ${spaceGrotesk.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('placequest_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved ? saved === 'dark' : prefersDark;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        style={{
          fontFamily: "var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif",
        }}
        className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white pb-16 lg:pb-0 transition-colors duration-200"
      >
        <GameProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <MobileNav />
        </GameProvider>
      </body>
    </html>
  );
}

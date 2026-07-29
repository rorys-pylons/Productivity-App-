import type { Metadata } from "next";
import { Cinzel, EB_Garamond, Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Scene } from "@/components/scene";
import { Weather } from "@/components/weather";
import { AmbientAudio } from "@/components/ambient-audio";
import { db } from "@/lib/db";
import { getActivePlayer } from "@/lib/active-player";
import { getActiveValley } from "@/lib/valley";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Productivity Pylons",
  description:
    "A southern-gothic productivity world. Every chore lights the wire — no penalties, only stars.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [valley, activePlayer] = await Promise.all([getActiveValley(), getActivePlayer()]);
  const players = valley
    ? await db.player.findMany({
        where: { valleyId: valley.id },
        orderBy: { createdAt: "asc" },
      })
    : [];

  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${garamond.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Scene />
        <Weather />
        <AmbientAudio />
        <Header
          players={players}
          activePlayer={activePlayer}
          valley={valley ? { name: valley.name, inviteCode: valley.inviteCode } : null}
        />
        {children}
      </body>
    </html>
  );
}

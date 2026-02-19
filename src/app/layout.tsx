import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { NotificationScheduler } from "@/components/notification-scheduler";
import { AdInterstitial } from "@/components/ads/ad-interstitial";
import { ADSENSE_PUB_ID } from "@/lib/ad-config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oruç Arkadaşım - Ramazan Rehberiniz",
  description:
    "Ramazan imsakiyesi, namaz vakitleri, iftar/sahur menüleri, günlük dua, ayet ve ibadet rehberi.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f0f23",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Google AdSense script — pub ID dolunca aktif olur */}
        {ADSENSE_PUB_ID && !ADSENSE_PUB_ID.includes("XXXX") && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <NotificationScheduler />
        <AdInterstitial />
        <div className="mx-auto flex min-h-screen max-w-lg flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto px-4 pb-20 pt-4">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

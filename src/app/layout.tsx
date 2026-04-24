import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { MotionConfig } from "motion/react";
import { t } from "@/lib/motion-tokens";
import { LenisProvider } from "@/components/LenisProvider";
import CursorProvider from "@/components/CursorProvider";
import { PaletteProvider } from "@/components/PaletteProvider";
import { PaletteBadge } from "@/components/PaletteBadge";
import { Analytics } from "@/components/Analytics";
import { Toaster } from "@/components/Toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const metadata: Metadata = {
  title: "Plaasrus",
  description: "A 3-bedroom farmhouse on Braambos — a working regenerative farm on the outskirts of George — offered for direct-booked short stays with mountain views, a kameeldoring braai, and a working farm on all sides.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={[
        geistSans.variable,
        geistMono.variable,
        cormorantGaramond.variable,
        sourceSerif4.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg font-sans">
        <LenisProvider>
          <MotionConfig transition={t.base} reducedMotion="user">
            <CursorProvider />
            {DEMO ? (
              <PaletteProvider>
                {children}
                <PaletteBadge />
              </PaletteProvider>
            ) : (
              children
            )}
          </MotionConfig>
        </LenisProvider>
        {/* Toaster must be mounted for notify.success()/notify.error() calls to render.
           Lightweight (~5KB gz); keep mounted even for projects that do not currently use toasts
           so component authors can call `notify` without wiring layout changes. */}
        <Toaster />
        {/* Zero-cost null render unless NEXT_PUBLIC_ANALYTICS_ENABLED=true. */}
        <Analytics />
      </body>
    </html>
  );
}

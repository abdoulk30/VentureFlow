import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VentureFlow | AI Matchmaker & Funding Predictor",
  description:
    "Democratizing access to venture capital through predictive market intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
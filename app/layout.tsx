import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css"; // Ensure your standard Tailwind global CSS file is imported

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VentureFlow | AI Matchmaker & Funding Predictor",
  description: "Democratizing access to venture capital through predictive market intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
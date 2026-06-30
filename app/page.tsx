"use client";

import Link from "next/link";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main style={{ backgroundColor: '#09090b', color: '#ffffff', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>VentureFlow Emergency Style Bypass</h1>
        <p style={{ color: '#a1a1aa' }}>If you can see this dark background, your Next.js server is rendering fine, and we just need to fix the path link to your Tailwind sheet!</p>
      </div>
    </main>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "NutriSense — AI-Powered Food & Health App",
  description: "Make better food choices and build healthier eating habits with AI-powered nutritional analysis, personalized meal plans, and health coaching. Powered by Google Gemini, Vision AI, and 10 integrated Google APIs.",
  keywords: "nutrition, health, AI, meal plan, food analysis, Google Gemini, fitness",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

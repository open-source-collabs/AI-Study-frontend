import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AppProvider } from "@/core/components/AppProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "StudyOS — AI Study Companion", template: "%s · StudyOS" },
  description: "A focused workspace for turning study material into structured learning.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={montserrat.variable}><body><AppProvider>{children}</AppProvider></body></html>;
}

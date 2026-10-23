import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AppProvider } from "@/core/components/AppProvider";
import { THEME_INIT_SCRIPT } from "@/core/theme";
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

// suppressHydrationWarning: the theme script sets data-theme on <html> before React loads, which is expected.
// The script must be a plain inline <script> in <head>: next/script defers it behind the Next runtime, which paints light first.
// dangerouslySetInnerHTML is safe here, the string is a constant from core/theme.ts with no user input (SECURITY.md section 4).
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html className={montserrat.variable} lang="en" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} /></head>
    <body><AppProvider>{children}</AppProvider></body>
  </html>;
}

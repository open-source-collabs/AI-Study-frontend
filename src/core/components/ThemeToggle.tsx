"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { THEME_KEY, type Theme } from "@/core/theme";

// The <html data-theme> attribute is the single source of truth (the head script sets it first), so read it from there.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function apply() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode: the theme still changes for this visit, it just is not remembered.
    }
  }

  // The browser crossfades the old and new page (see ::view-transition in globals.css). Browsers without the API,
  // and people who asked for reduced motion, get an instant switch.
  function toggle() {
    if (!("startViewTransition" in document) || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    document.startViewTransition(apply);
  }

  return <button aria-label={`Switch to ${next} theme`} className="theme-toggle" onClick={toggle} type="button">
    {theme === "dark" ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
  </button>;
}

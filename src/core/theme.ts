export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

// Runs in <head> before first paint so a dark-theme student never sees a light flash. Saved choice wins, then the OS setting.
// shortcut: the OS setting is read once per page load, it is not followed live. Add a matchMedia listener if that is wanted.
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

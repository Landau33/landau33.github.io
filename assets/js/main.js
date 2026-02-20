const THEME_KEY = "theme";

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function applyTheme(theme, { persist } = { persist: false }) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");

  if (persist) safeSet(THEME_KEY, theme);
  syncThemeToggle(theme);
}

function getInitialTheme() {
  const saved = safeGet(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
}

function syncThemeToggle(theme) {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const isLight = theme === "light";
  btn.setAttribute("aria-pressed", String(isLight));

  const label = btn.querySelector(".btn-label");
  if (label) label.textContent = isLight ? "浅色" : "深色";
}

function wireThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light", { persist: true });
  });
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

applyTheme(getInitialTheme());
wireThemeToggle();
setYear();


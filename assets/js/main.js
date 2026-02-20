const THEME_KEY = "theme";
const LANG_KEY = "lang";

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
  if (label) label.textContent = isLight ? "Light" : "Dark";
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

function applyLang(lang, { persist } = { persist: false }) {
  const root = document.documentElement;
  root.setAttribute("data-lang", lang);
  root.setAttribute("lang", lang === "zh" ? "zh-Hans" : "en");
  
  if (persist) safeSet(LANG_KEY, lang);
  
  // Update meta tags
  const metaDesc = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  const title = document.querySelector("title");
  
  if (lang === "zh") {
    if (metaDesc) metaDesc.setAttribute("content", "个人主页 | GitHub Pages");
    if (ogTitle) ogTitle.setAttribute("content", "Chris Tu | 个人主页");
    if (ogDesc) ogDesc.setAttribute("content", "个人主页 | GitHub Pages");
    if (ogLocale) ogLocale.setAttribute("content", "zh_Hans");
    if (title) title.textContent = "Chris Tu | 个人主页";
  } else {
    if (metaDesc) metaDesc.setAttribute("content", "Personal Homepage | GitHub Pages");
    if (ogTitle) ogTitle.setAttribute("content", "Chris Tu | Personal Homepage");
    if (ogDesc) ogDesc.setAttribute("content", "Personal Homepage | GitHub Pages");
    if (ogLocale) ogLocale.setAttribute("content", "en_US");
    if (title) title.textContent = "Chris Tu | Personal Homepage";
  }
}

function getInitialLang() {
  const saved = safeGet(LANG_KEY);
  if (saved === "zh" || saved === "en") return saved;
  // Default to Chinese, or detect from browser
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith("zh") ? "zh" : "en";
}

function wireLangToggle() {
  const btn = document.getElementById("langToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const currentLang = document.documentElement.getAttribute("data-lang") || "zh";
    const newLang = currentLang === "zh" ? "en" : "zh";
    applyLang(newLang, { persist: true });
  });
}

applyTheme(getInitialTheme());
applyLang(getInitialLang());
wireThemeToggle();
wireLangToggle();
setYear();


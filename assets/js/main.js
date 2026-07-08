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
  btn.setAttribute("aria-pressed", String(theme === "light"));
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

// Copy email to clipboard
document.addEventListener("DOMContentLoaded", function () {
  const copyEmailElement = document.querySelector(".copy-email");
  if (copyEmailElement) {
    copyEmailElement.addEventListener("click", function () {
      const email = this.getAttribute("data-email");
      navigator.clipboard
        .writeText(email)
        .then(function () {
          const tooltip = document.createElement("div");
          tooltip.textContent = "Copied to clipboard";
          tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
          `;

          document.body.appendChild(tooltip);

          setTimeout(() => {
            tooltip.style.opacity = "1";
          }, 10);

          setTimeout(() => {
            tooltip.style.opacity = "0";
            setTimeout(() => {
              document.body.removeChild(tooltip);
            }, 300);
          }, 1500);
        })
        .catch(function (err) {
          console.error("Copy failed:", err);
          alert("Please copy the email address manually: " + email);
        });
    });
  }
});

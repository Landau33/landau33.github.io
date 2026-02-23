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
  // 移除直接设置textContent的代码，让CSS双语规则生效
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

// 复制邮箱功能
document.addEventListener('DOMContentLoaded', function() {
    const copyEmailElement = document.querySelector('.copy-email');
    if (copyEmailElement) {
        copyEmailElement.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(function() {
                // 获取当前语言
                const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
                const tipText = currentLang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard';
                
                // 创建临时提示元素
                const tooltip = document.createElement('div');
                tooltip.textContent = tipText;
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
                
                // 显示提示
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 10);
                
                // 1.5秒后隐藏并移除
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(tooltip);
                    }, 300);
                }, 1500);
                
            }).catch(function(err) {
                console.error('复制失败:', err);
                // 如果clipboard API不可用，显示提示让用户手动复制
                alert('请手动选择并复制邮箱地址: ' + email);
            });
        });
    }
});

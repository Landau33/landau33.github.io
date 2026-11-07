document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});

// Keep the bottom of the sticky sidebar (visitor map) reachable on short screens:
// if the sidebar is taller than the viewport allows, stick it lower so it scrolls
// up until its bottom edge is visible, then pins.
document.addEventListener("DOMContentLoaded", () => {
  const profile = document.querySelector(".profile");
  if (!profile || !("ResizeObserver" in window)) return;
  const baseTop = 112;
  const bottomGap = 24;
  const update = () => {
    if (getComputedStyle(profile).position !== "sticky") {
      profile.style.top = "";
      return;
    }
    const fit = window.innerHeight - profile.offsetHeight - bottomGap;
    profile.style.top = fit < baseTop ? `${fit}px` : "";
  };
  new ResizeObserver(update).observe(profile);
  window.addEventListener("resize", update);
  update();
});

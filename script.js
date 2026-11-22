// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Dark mode: follows system setting, remembers your choice
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = saved || (prefersDark ? "dark" : "light");

toggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

// Fade sections in as you scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll("section:not(.hero)").forEach((s) => {
  s.classList.add("reveal");
  observer.observe(s);
});

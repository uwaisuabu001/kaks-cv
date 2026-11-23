// Print / save as PDF
document.getElementById("print").addEventListener("click", () => window.print());

// Sections ease in as you scroll
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".contents, .entry, .feature, .profile, .skills > div, #contact")
    .forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

// Tap the note → it grows into a full sheet of paper,
// then the writing appears line by line like a pen.

const note   = document.getElementById("note");
const flyer  = document.getElementById("flyer");
const wrap   = document.getElementById("sheet-wrap");
const sheet  = document.getElementById("sheet");
const close  = document.getElementById("close");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// stagger the "writing" of each ink line
document.querySelectorAll("#sheet .ink").forEach((el, i) => el.style.setProperty("--i", i));

const place = (r, rot) => Object.assign(flyer.style, {
  left: r.left + "px", top: r.top + "px",
  width: r.width + "px", height: r.height + "px",
  transform: `rotate(${rot}deg)`,
});

// the part of the sheet that is on screen
function sheetRect() {
  const r = sheet.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width,
           height: Math.min(r.height, window.innerHeight - r.top) };
}

const after = (ms) => new Promise((res) => setTimeout(res, ms));
let busy = false;

async function open() {
  if (busy || document.body.classList.contains("open")) return;
  busy = true;
  document.body.classList.add("open");
  note.setAttribute("aria-expanded", "true");

  wrap.hidden = false;
  wrap.scrollTop = 0;
  sheet.classList.remove("ready", "writing");

  if (!reduce) {
    flyer.style.transition = "none";
    flyer.style.opacity = "1";
    flyer.style.display = "block";
    place(note.getBoundingClientRect(), -1.2);
    note.style.visibility = "hidden";
    flyer.offsetWidth;                   // apply start position
    flyer.style.transition = "";
    wrap.classList.add("show");
    place(sheetRect(), 0);
    await after(620);
  } else {
    wrap.classList.add("show");
  }

  sheet.classList.add("ready");
  flyer.style.display = "none";
  requestAnimationFrame(() => sheet.classList.add("writing"));
  history.replaceState(null, "", "#portfolio");
  close.focus({ preventScroll: true });
  busy = false;
}

async function shut() {
  if (busy || !document.body.classList.contains("open")) return;
  busy = true;

  if (!reduce) {
    flyer.style.transition = "none";
    flyer.style.display = "block";
    place(sheetRect(), 0);
    sheet.classList.remove("ready", "writing");
    flyer.offsetWidth;
    flyer.style.transition = "";
    wrap.classList.remove("show");
    place(note.getBoundingClientRect(), -1.2);
    await after(620);
    flyer.style.display = "none";
  } else {
    wrap.classList.remove("show");
    sheet.classList.remove("ready", "writing");
  }

  note.style.visibility = "";
  wrap.hidden = true;
  document.body.classList.remove("open");
  note.setAttribute("aria-expanded", "false");
  history.replaceState(null, "", location.pathname);
  note.focus({ preventScroll: true });
  busy = false;
}

note.addEventListener("click", open);
close.addEventListener("click", shut);
wrap.addEventListener("click", (e) => { if (e.target === wrap) shut(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") shut(); });

// a shared link ending in #portfolio opens straight to the sheet
if (location.hash === "#portfolio") open();

// Search Input
const searchInput = document.querySelector(".search-input");
const searchWrap = document.querySelector(".search-wrap");

searchInput.addEventListener("focus", () => {
  searchWrap.classList.add("active");
});
searchInput.addEventListener("blur", () => {
  if (searchInput.value.trim() === "") {
    searchWrap.classList.remove("active");
  }
});

// Heart Icon Toggle Color
const heartIcon = document.getElementById("heartIcon");

heartIcon.addEventListener("click", () => {
  if (heartIcon.classList.contains("fa-regular")) {
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid", "liked");
  } else {
    heartIcon.classList.remove("fa-solid", "liked");
    heartIcon.classList.add("fa-regular");
  }
});

// Active Page
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll(".hover-link");

navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href").split("/").pop();

  if (linkPage === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// Star Rating Logic
(function () {
  function uid(prefix = "rt") {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function setupRatings(scope = document) {
    const blocks = scope.querySelectorAll(".rating");
    blocks.forEach((wrap) => {
      const radios = Array.from(wrap.querySelectorAll('input[type="radio"]'));
      if (!radios.length) return;

      const groupName = wrap.dataset.group || uid("rating");
      wrap.dataset.group = groupName;

      radios.forEach((input) => {
        input.name = groupName;
        const id = uid(groupName);
        const label = input.nextElementSibling;
        input.id = id;
        if (label && label.tagName === "LABEL") {
          label.setAttribute("for", id);
          label.addEventListener("click", (e) => {
            if (input.checked) {
              e.preventDefault();
              input.checked = false;
              wrap.dataset.value = "0";
              localStorage.removeItem("rating:" + groupName);
            }
          });
        }
        input.addEventListener("change", () => {
          if (input.checked) {
            wrap.dataset.value = input.value;
            localStorage.setItem("rating:" + groupName, input.value);
          }
        });
      });

      const saved = localStorage.getItem("rating:" + groupName);
      if (saved) {
        const match = radios.find((r) => r.value === saved);
        if (match) match.checked = true;
        wrap.dataset.value = saved;
      }
    });
  }

  setupRatings();

  // Mobile filters modal
  const btnFilter = document.getElementById("btnFilter");
  const modal = document.getElementById("filtersModal");
  const mBody = document.getElementById("filtersModalBody");
  const mClose = document.getElementById("filtersModalClose");

  function openFilters() {
    const desktopFiltersInner = document.querySelector(
      ".filters-col .filters-inner"
    );
    if (desktopFiltersInner) {
      mBody.innerHTML = "";
      const clone = desktopFiltersInner.cloneNode(true);
      mBody.appendChild(clone);
      setupRatings(mBody);
    }
    modal.classList.add("open");
    setTimeout(() => modal.classList.add("reveal"), 20);
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => mClose.focus(), 80);
  }
  function closeFilters() {
    modal.classList.remove("reveal", "open");
    document.documentElement.style.overflow = "";
  }

  btnFilter?.addEventListener("click", openFilters);
  mClose?.addEventListener("click", closeFilters);
  modal?.addEventListener("click", (e) => {
    if (e.target.classList.contains("filters-backdrop")) closeFilters();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeFilters();
  });
})();

// Radio Star logic
document.querySelectorAll(".rating").forEach((wrap, idx) => {
  const group = `rating-${idx}`;
  const def = parseInt(wrap.dataset.default, 10) || 0;
  if (wrap.querySelector("input")) return;
  for (let v = 5; v >= 1; v--) {
    const input = document.createElement("input");
    const label = document.createElement("label");
    input.type = "radio";
    input.name = group;
    input.id = `${group}-${v}`;
    input.value = v;
    if (v === def) input.checked = true;
    label.setAttribute("for", input.id);
    wrap.appendChild(input);
    wrap.appendChild(label);
  }
});

// Gold Star Logic
document.querySelectorAll(".rating.rating-gold").forEach((wrap, idx) => {
  if (wrap.children.length) return;
  const group = `prod-${idx}`;
  const def = parseInt(wrap.dataset.default, 10) || 0;
  for (let v = 5; v >= 1; v--) {
    const inp = document.createElement("input");
    const lbl = document.createElement("label");
    inp.type = "radio";
    inp.name = group;
    inp.id = `${group}-${v}`;
    inp.value = v;
    if (v === def) inp.checked = true;
    lbl.setAttribute("for", inp.id);
    wrap.appendChild(inp);
    wrap.appendChild(lbl);
  }
});

// Modal Logic
const modalEl = document.getElementById("filtersModal");
const modalBody = document.getElementById("filtersModalBody");
const btnApply = document.getElementById("filtersApply");
const btnReset = document.getElementById("filtersReset");

btnApply?.addEventListener("click", () => {
  document.documentElement.style.overflow = "";
  modalEl.classList.remove("reveal", "open");
});

btnReset?.addEventListener("click", () => {
  if (!modalBody) return;

  modalBody
    .querySelectorAll(
      'input[type="text"], input[type="search"], input[type="email"], input[type="number"]'
    )
    .forEach((i) => {
      i.value = "";
    });

  modalBody
    .querySelectorAll('input[type="checkbox"], input[type="radio"]')
    .forEach((i) => {
      i.checked = false;
    });

  modalBody.querySelectorAll('input[type="range"]').forEach((r) => {
    const dv = r.getAttribute("data-default");
    r.value = dv ?? (r.min || 0);
    const hint = modalBody.querySelector(".price-hint");
    if (hint && r.min !== "" && r.max !== "") {
      const min = Number(r.min || 0),
        max = Number(r.max || 0);
      hint.textContent = `Price: $${min} – $${Math.round(
        (max - min) * (r.value / (r.max || 1)) + min
      )}`;
    }
  });

  modalBody.querySelectorAll(".rating").forEach((wrap) => {
    wrap.dataset.value = "0";
    const inputs = wrap.querySelectorAll('input[type="radio"]');
    inputs.forEach((i) => {
      i.checked = false;
    });
    const g = wrap.dataset.group;
    if (g) localStorage.removeItem("rating:" + g);
  });
});

// GSAP
// Cursor + Sparkle
gsap.set(".flair", { xPercent: -50, yPercent: -50 });

let xTo = gsap.quickTo(".flair", "x", { duration: 0.6, ease: "power3" }),
  yTo = gsap.quickTo(".flair", "y", { duration: 0.6, ease: "power3" });

const flairEl = document.querySelector(".flair");
const rootStyles = getComputedStyle(document.documentElement);
const secondaryColor = rootStyles
  .getPropertyValue("--secondary-text-color")
  .trim();

function getBackgroundColorAtPoint(x, y) {
  let el = document.elementFromPoint(x, y);

  while (el && el !== document.documentElement) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && !bg.includes("0, 0, 0, 0")) {
      return bg;
    }

    el = el.parentElement;
  }
  return (
    getComputedStyle(document.body).backgroundColor || "rgb(255, 255, 255)"
  );
}

function isAlmostWhite(rgbString) {
  const match = rgbString.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return false;

  const [r, g, b] = match.slice(1).map(Number);
  const threshold = 240;

  return r >= threshold && g >= threshold && b >= threshold;
}

window.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);

  const bg = getBackgroundColorAtPoint(e.clientX, e.clientY);

  if (isAlmostWhite(bg)) {
    flairEl.style.backgroundColor = secondaryColor;
  } else {
    flairEl.style.backgroundColor = "#ffffff";
  }
});

// Sparkle
function createSparkle(x, y, isLightBackground) {
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");

  if (isLightBackground) {
    sparkle.classList.add("sparkle-gold");
  } else {
    sparkle.classList.add("sparkle-white");
  }

  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;

  document.body.appendChild(sparkle);

  const angle = Math.random() * Math.PI * 2;
  const distance = 40 + Math.random() * 20;

  gsap.to(sparkle, {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    opacity: 0,
    scale: 0,
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => sparkle.remove(),
  });
}

window.addEventListener("click", (e) => {
  const bg = getBackgroundColorAtPoint(e.clientX, e.clientY);
  const isLightBg = isAlmostWhite(bg);

  for (let i = 0; i < 12; i++) {
    createSparkle(e.clientX, e.clientY, isLightBg);
  }
});

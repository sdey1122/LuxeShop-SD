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

// Contact Us Validation
(function () {
  const form = document.getElementById("contactForm");
  const nameEl = document.getElementById("name");
  const mailEl = document.getElementById("email");
  const msgEl = document.getElementById("message");
  const btn = document.getElementById("submitBtn");

  const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
  const trim = (v) => (v || "").trim();

  let loadingTimer;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    [nameEl, mailEl, msgEl].forEach((i) => i.setCustomValidity(""));

    if (trim(nameEl.value).length < 2) {
      nameEl.setCustomValidity("Please enter your full name.");
    }
    if (!emailOK(trim(mailEl.value))) {
      mailEl.setCustomValidity("Please enter a valid email.");
    }
    if (trim(msgEl.value).length < 10) {
      msgEl.setCustomValidity("Message should be at least 10 characters.");
    }

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    if (btn.classList.contains("is-loading")) return;

    btn.classList.add("is-loading");
    btn.setAttribute("aria-disabled", "true");

    loadingTimer = setTimeout(() => {
      const modal = new bootstrap.Modal(
        document.getElementById("thankYouModal")
      );
      modal.show();

      form.reset();
      form.classList.remove("was-validated");

      setTimeout(() => {
        btn.classList.remove("is-loading");
        btn.removeAttribute("aria-disabled");
      }, 300);
    }, 1700);
  });

  window.addEventListener("beforeunload", () => clearTimeout(loadingTimer));
})();

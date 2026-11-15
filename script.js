// ==========================================================
// 1. Light / Dark mode toggle
// ==========================================================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement; // the <html> element

// Apply a theme ("light" or "dark") to the page
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

// Read the saved theme (if any). try/catch protects against blocked storage.
function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Storage not available: the toggle still works, it just won't be remembered.
  }
}

// On first load: use the saved theme, otherwise follow the device setting
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(getSavedTheme() || (prefersDark ? "dark" : "light"));

// Switch theme when the button is clicked
themeToggle.addEventListener("click", function () {
  const newTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  saveTheme(newTheme);
});

// ==========================================================
// 2. Responsive navigation menu (mobile hamburger)
// ==========================================================
const menuToggle = document.getElementById("menuToggle");
const navList = document.getElementById("navList");

function setMenu(open) {
  navList.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", function () {
  setMenu(!navList.classList.contains("open"));
});

// Close the menu after choosing a link (smooth scrolling is done by CSS)
navList.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    setMenu(false);
  });
});

// Close the menu with the Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

// ==========================================================
// 3. Highlight the current section in the menu while scrolling
// ==========================================================
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" } // a section counts as "current" near the middle of the screen
);

sections.forEach(function (section) {
  observer.observe(section);
});

// ==========================================================
// 4. Footer year (updates automatically)
// ==========================================================
document.getElementById("year").textContent = new Date().getFullYear();
(function () {
  var THEME_KEY = "lga-accounting-theme";
  var NAV_KEY_PREFIX = "lga-accounting-nav-open-";
  var LGA_INSTANCE_KEY = "lga-instance-selection";
  var STATE_INSTANCE_KEY = "lga-state-instance";
  var themes = {
    green: {
      primary: "#1f7a4d",
      primaryStrong: "#0f5d37",
      primarySoft: "#dff3e5",
      accent: "#8fcf4f",
      bg: "#eef3ec"
    },
    blue: {
      primary: "#13598b",
      primaryStrong: "#0d3f63",
      primarySoft: "#dbeefa",
      accent: "#51a7d9",
      bg: "#edf4f8"
    },
    gold: {
      primary: "#8f6b10",
      primaryStrong: "#674a04",
      primarySoft: "#f8efd8",
      accent: "#d8b44d",
      bg: "#f5f0e6"
    }
  };

  function applyTheme(name) {
    var theme = themes[name] || themes.green;
    var root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-strong", theme.primaryStrong);
    root.style.setProperty("--primary-soft", theme.primarySoft);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--bg", theme.bg);

    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-theme-choice") === name);
    });
  }

  function loadTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || "green";
    } catch (error) {
      return "green";
    }
  }

  function storeTheme(name) {
    try {
      localStorage.setItem(THEME_KEY, name);
    } catch (error) {
      return;
    }
  }

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function normalizePath(path) {
    return String(path || "").split("/").pop().split("#")[0].split("?")[0];
  }

  function loadJSON(key) {
    var raw = storageGet(key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function compactLabel(text) {
    return String(text || "").replace(/\s+LGA$/i, "").replace(/\s+/g, " ").trim();
  }

  function makeInitials(text) {
    var cleaned = compactLabel(text);
    if (!cleaned) {
      return "LG";
    }

    var words = cleaned.split(" ").filter(Boolean);
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return words.slice(0, 2).map(function (word) {
      return word.charAt(0).toUpperCase();
    }).join("");
  }

  function buildInstanceIdentity() {
    var lgaInstance = loadJSON(LGA_INSTANCE_KEY);
    var stateInstance = loadJSON(STATE_INSTANCE_KEY);
    var title = lgaInstance && lgaInstance.lga ? lgaInstance.lga : "";
    var state = lgaInstance && lgaInstance.state ? lgaInstance.state : (stateInstance && stateInstance.state ? stateInstance.state : "");
    var headquarters = stateInstance && stateInstance.headquarters ? stateInstance.headquarters : "";
    var subtitleParts = [];

    if (state) {
      subtitleParts.push(state);
    }

    if (headquarters) {
      subtitleParts.push(headquarters);
    }

    if (!title && state) {
      title = state + " Monitoring Hub";
    }

    return {
      initials: makeInitials(title || state || "LG"),
      title: title || "LGA Finance",
      subtitle: subtitleParts.join(" / ") || "No saved instance"
    };
  }

  function hydrateRailBrand() {
    var brand = document.querySelector(".rail-brand");
    if (!brand) {
      return;
    }

    var identity = buildInstanceIdentity();
    var seal = brand.querySelector(".seal");
    var title = brand.querySelector(".rail-title strong");
    var subtitle = brand.querySelector(".rail-title span");

    if (seal) {
      seal.textContent = identity.initials;
    }

    if (title) {
      title.textContent = identity.title;
    }

    if (subtitle) {
      subtitle.textContent = identity.subtitle;
    }
  }

  function navKey(details, index) {
    var label = details.querySelector("summary span:nth-child(2)");
    var text = label ? label.textContent : "section-" + index;
    return NAV_KEY_PREFIX + text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function initPersistentNavigation() {
    var currentPage = normalizePath(window.location.pathname) || "index.html";

    document.querySelectorAll(".side-rail a[href]").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href === "#" || href.charAt(0) === "#") return;
      link.classList.toggle("active", normalizePath(href) === currentPage);
    });

    document.querySelectorAll(".nav-details").forEach(function (details, index) {
      var key = navKey(details, index);
      var summary = details.querySelector("summary");
      var hasCurrentPage = Array.from(details.querySelectorAll(".nav-submenu a[href]")).some(function (link) {
        return normalizePath(link.getAttribute("href")) === currentPage;
      });
      var storedState = storageGet(key);

      if (hasCurrentPage || storedState === "open") {
        details.open = true;
      } else if (storedState === "closed") {
        details.open = false;
      }

      if (summary) {
        summary.addEventListener("click", function (event) {
          event.preventDefault();

          if (details.open) {
            details.classList.add("nav-closing");
            storageSet(key, "closed");
            window.setTimeout(function () {
              details.open = false;
              details.classList.remove("nav-closing");
            }, 260);
            return;
          }

          details.open = true;
          storageSet(key, "open");
        });
      }

      details.addEventListener("toggle", function () {
        storageSet(key, details.open ? "open" : "closed");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var initialTheme = loadTheme();
    applyTheme(initialTheme);
    hydrateRailBrand();
    initPersistentNavigation();

    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        var selectedTheme = button.getAttribute("data-theme-choice");
        applyTheme(selectedTheme);
        storeTheme(selectedTheme);
      });
    });
  });
})();

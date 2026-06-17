(function () {
  var THEME_KEY = "lga-accounting-theme";
  var NAV_KEY_PREFIX = "lga-accounting-nav-open-";
  var LGA_INSTANCE_KEY = "lga-instance-selection";
  var STATE_INSTANCE_KEY = "lga-state-instance";
  var LOG_STORE = "budget-admin-logs";
  var CURRENT_USER_KEY = "lga-current-user-profile";
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
    var state = lgaInstance && lgaInstance.state ? lgaInstance.state : (stateInstance && stateInstance.state ? stateInstance.state : "Delta State");
    var headquarters = stateInstance && stateInstance.headquarters ? stateInstance.headquarters : "";
    var subtitleParts = [];

    subtitleParts.push(state);

    if (headquarters) {
      subtitleParts.push(headquarters);
    }

    if (!title) {
      title = "Ukwuani Local Government Council";
    }

    return {
      initials: makeInitials(title || state || "LG"),
      title: title || "LGA Finance",
      subtitle: subtitleParts.join(" / ") || "No saved instance"
    };
  }

  function activeInstanceContext() {
    var identity = buildInstanceIdentity();
    return {
      state: identity.subtitle.split(" / ")[0] || "Delta State",
      lga: identity.title || "Ukwuani Local Government Council"
    };
  }

  function currentUserProfile() {
    var stored = loadJSON(CURRENT_USER_KEY);
    if (stored && stored.name) {
      return stored;
    }

    var context = activeInstanceContext();
    return {
      name: "Tamuno Briggs",
      role: "Super Admin",
      position: "Head of Treasury Operations",
      department: "Finance",
      email: "tamuno.briggs@" + compactLabel(context.lga).toLowerCase().replace(/\s+/g, "") + ".gov.ng",
      phone: "+234 803 000 4412",
      employeeId: "PHLGA-ADM-001",
      scope: context.lga + ", " + context.state
    };
  }

  function currentFinancialYear() {
    return String(new Date().getFullYear());
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

  function injectCashbookNavigation() {
    var currentPage = normalizePath(window.location.pathname) || "index.html";
    document.querySelectorAll(".side-rail .nav-item").forEach(function (link) {
      var labelNode = link.querySelector("span:nth-child(2)");
      var label = (labelNode ? labelNode.textContent : link.textContent).replace(/\s+/g, " ").trim().toLowerCase();
      if ((label !== "cash and bank" && label !== "cashbook") || link.dataset.cashbookUpgraded === "true") {
        return;
      }

      var details = document.createElement("details");
      details.className = "nav-details";
      details.innerHTML = '' +
        '<summary class="nav-parent"><span class="nav-icon">C</span><span>Cashbook</span><span class="nav-chevron" aria-hidden="true"></span></summary>' +
        '<div class="nav-submenu">' +
        '<a href="cashbook-revenue.html"' + (currentPage === "cashbook-revenue.html" ? ' class="active"' : "") + '>Revenue</a>' +
        '<a href="cashbook-expenditure.html"' + (currentPage === "cashbook-expenditure.html" ? ' class="active"' : "") + '>Expenditure</a>' +
        '<a href="cashbook-r-and-e.html"' + (currentPage === "cashbook-r-and-e.html" ? ' class="active"' : "") + '>R and E</a>' +
        "</div>";
      details.open = ["cashbook-revenue.html", "cashbook-expenditure.html", "cashbook-r-and-e.html"].indexOf(currentPage) !== -1;

      link.dataset.cashbookUpgraded = "true";
      link.replaceWith(details);
    });
  }

  function injectLedgerNavigation() {
    var currentPage = normalizePath(window.location.pathname) || "index.html";
    document.querySelectorAll(".side-rail .nav-group").forEach(function (navGroup) {
      if (navGroup.querySelector('[data-ledger-upgraded="true"]')) {
        return;
      }

      var budgetDetails = Array.from(navGroup.querySelectorAll(".nav-details")).find(function (details) {
        var label = details.querySelector("summary span:nth-child(2)");
        return label && label.textContent && label.textContent.trim().toLowerCase() === "budget";
      });
      var cashbookDetails = Array.from(navGroup.querySelectorAll(".nav-details")).find(function (details) {
        var label = details.querySelector("summary span:nth-child(2)");
        return label && label.textContent && label.textContent.trim().toLowerCase() === "cashbook";
      });
      var vouchersDetails = Array.from(navGroup.querySelectorAll(".nav-details")).find(function (details) {
        var label = details.querySelector("summary span:nth-child(2)");
        return label && label.textContent && label.textContent.trim().toLowerCase() === "vouchers";
      });
      var details = document.createElement("details");
      details.className = "nav-details";
      details.dataset.ledgerUpgraded = "true";
      details.innerHTML = '' +
        '<summary class="nav-parent"><span class="nav-icon">L</span><span>Ledger</span><span class="nav-chevron" aria-hidden="true"></span></summary>' +
        '<div class="nav-submenu">' +
        '<a href="ledger-dvea.html"' + (currentPage === "ledger-dvea.html" ? ' class="active"' : "") + '>DVEA</a>' +
        '<a href="dvra.html"' + (currentPage === "dvra.html" ? ' class="active"' : "") + '>DVRA</a>' +
        '<a href="advance-ledger.html"' + (currentPage === "advance-ledger.html" ? ' class="active"' : "") + '>Advance Ledger</a>' +
        '<a href="salary-ledger.html"' + (currentPage === "salary-ledger.html" ? ' class="active"' : "") + '>Salary Ledger</a>' +
        '</div>';
      details.open = currentPage === "ledger-dvea.html" || currentPage === "dvra.html" || currentPage === "advance-ledger.html" || currentPage === "salary-ledger.html";

      if (cashbookDetails) {
        cashbookDetails.insertAdjacentElement("afterend", details);
      } else if (vouchersDetails) {
        vouchersDetails.insertAdjacentElement("afterend", details);
      } else if (budgetDetails) {
        budgetDetails.insertAdjacentElement("afterend", details);
      } else {
        navGroup.appendChild(details);
      }
    });
  }

  function injectWorkQueueNavigation() {
    var currentPage = normalizePath(window.location.pathname) || "index.html";
    document.querySelectorAll(".side-rail .nav-item").forEach(function (link) {
      var labelNode = link.querySelector("span:nth-child(2)");
      var label = (labelNode ? labelNode.textContent : link.textContent).replace(/\s+/g, " ").trim().toLowerCase();
      if (label !== "work queue") {
        return;
      }

      link.setAttribute("href", "work-queue.html");
      link.classList.toggle("active", currentPage === "work-queue.html");
    });
  }

  function removeAdministrationLink(navGroup, labels) {
    Array.from(navGroup.querySelectorAll(".nav-item, .nav-details")).forEach(function (node) {
      var labelNode = node.matches(".nav-details")
        ? node.querySelector("summary span:nth-child(2)")
        : node.querySelector("span:nth-child(2)");
      var label = labelNode && labelNode.textContent ? labelNode.textContent.replace(/\s+/g, " ").trim().toLowerCase() : "";
      if (labels.indexOf(label) !== -1) {
        node.remove();
      }
    });
  }

  function injectAdministrationNavigation() {
    var currentPage = normalizePath(window.location.pathname) || "index.html";
    var settingsPages = ["settings-organization.html", "settings-permissions.html", "settings-theme.html"];
    var personnelPages = ["personnels-add.html", "personnels-directory.html", "personnels-payroll.html"];

    document.querySelectorAll(".side-rail .nav-group").forEach(function (navGroup) {
      if (navGroup.querySelector('[data-admin-upgraded="true"]')) {
        return;
      }

      removeAdministrationLink(navGroup, ["users and roles", "sync monitor", "theme"]);

      var adminLabel = Array.from(navGroup.querySelectorAll(".nav-label")).find(function (label) {
        return label.textContent && label.textContent.replace(/\s+/g, " ").trim().toLowerCase() === "administration";
      });
      var settingsDetails = document.createElement("details");
      settingsDetails.className = "nav-details";
      settingsDetails.dataset.adminUpgraded = "true";
      settingsDetails.innerHTML = '' +
        '<summary class="nav-parent"><span class="nav-icon">S</span><span>Settings</span><span class="nav-chevron" aria-hidden="true"></span></summary>' +
        '<div class="nav-submenu">' +
        '<a href="settings-organization.html"' + (currentPage === "settings-organization.html" ? ' class="active"' : "") + '>Organization</a>' +
        '<a href="settings-permissions.html"' + (currentPage === "settings-permissions.html" ? ' class="active"' : "") + '>Rules & Permissions</a>' +
        '<a href="settings-theme.html"' + (currentPage === "settings-theme.html" ? ' class="active"' : "") + '>Theme & Identity</a>' +
        '</div>';
      settingsDetails.open = settingsPages.indexOf(currentPage) !== -1;

      var personnelDetails = document.createElement("details");
      personnelDetails.className = "nav-details";
      personnelDetails.dataset.adminUpgraded = "true";
      personnelDetails.innerHTML = '' +
        '<summary class="nav-parent"><span class="nav-icon">P</span><span>Personnels</span><span class="nav-chevron" aria-hidden="true"></span></summary>' +
        '<div class="nav-submenu">' +
        '<a href="personnels-add.html"' + (currentPage === "personnels-add.html" ? ' class="active"' : "") + '>Add Personnel</a>' +
        '<a href="personnels-directory.html"' + (currentPage === "personnels-directory.html" ? ' class="active"' : "") + '>Staff Directory</a>' +
        '<a href="personnels-payroll.html"' + (currentPage === "personnels-payroll.html" ? ' class="active"' : "") + '>Payroll Profiles</a>' +
        '</div>';
      personnelDetails.open = personnelPages.indexOf(currentPage) !== -1;

      if (adminLabel) {
        adminLabel.insertAdjacentElement("afterend", settingsDetails);
        settingsDetails.insertAdjacentElement("afterend", personnelDetails);
      } else {
        navGroup.appendChild(settingsDetails);
        navGroup.appendChild(personnelDetails);
      }
    });
  }

  function shellButtonMarkup(type, title, extraClass, badge) {
    var classes = "shell-icon-button" + (extraClass ? " " + extraClass : "");
    if (type === "settings") {
      return '<button class="' + classes + '" type="button" title="' + title + '" data-shell-action="settings">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4.8 13.4-.8-1.4.8-1.4 1.8-.3.9-1.6-.5-1.8 1.4-.8 1.4.8 1.6-.6.7-1.7h1.6l.7 1.7 1.6.6 1.4-.8 1.4.8-.5 1.8.9 1.6 1.8.3.8 1.4-.8 1.4-1.8.3-.9 1.6.5 1.8-1.4.8-1.4-.8-1.6.6-.7 1.7h-1.6l-.7-1.7-1.6-.6-1.4.8-1.4-.8.5-1.8-.9-1.6-1.8-.3Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/></svg>' +
        '<span class="sr-only">Settings</span></button>';
    }
    if (type === "notifications") {
      return '<div class="shell-menu-wrap"><button class="' + classes + '" type="button" title="' + title + '" data-shell-action="notifications" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a4 4 0 0 0-4 4v2.4c0 .7-.2 1.4-.6 2L6 14.8V16h12v-1.2l-1.4-2.4c-.4-.6-.6-1.3-.6-2V8a4 4 0 0 0-4-4Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><path d="M10 18a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>' +
        '<span class="shell-icon-badge">' + badge + '</span><span class="sr-only">Notifications</span></button><div class="shell-dropdown notifications-dropdown" hidden></div></div>';
    }
    if (type === "logout") {
      return '<button class="' + classes + '" type="button" title="' + title + '" data-shell-action="logout">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6H6.8A1.8 1.8 0 0 0 5 7.8v8.4A1.8 1.8 0 0 0 6.8 18H10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><path d="M14 8l4 4-4 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><path d="M18 12H10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg>' +
        '<span class="sr-only">Log out</span></button>';
    }
    return '<button class="' + classes + '" type="button" title="' + title + '" data-shell-action="profile">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg>' +
      '<span class="sr-only">Current profile</span></button>';
  }

  function latestNotifications() {
    var logs = readNotificationLogs();
    var base = logs.slice(0, 3).map(function (item) {
      return {
        title: item.change || "Recent update",
        meta: item.module || "Operations",
        time: shortTime(item.changedAt),
        href: mapNotificationLink(item.module)
      };
    });
    return base.concat([
      { title: "Two payment vouchers are waiting for checking.", meta: "Checking queue", time: "9:14 am", href: "approve-voucher.html" },
      { title: "One salary upload is pending for this month.", meta: "Salary ledger", time: "8:42 am", href: "salary-ledger.html" },
      { title: "Three staff records require payroll mapping.", meta: "Personnels", time: "Yesterday", href: "personnels-payroll.html" }
    ]).slice(0, 5);
  }

  function readNotificationLogs() {
    var raw = loadJSON(LOG_STORE);
    return Array.isArray(raw) ? raw : [];
  }

  function shortTime(value) {
    if (!value) {
      return "";
    }
    try {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(new Date(value)).replace(" AM", " am").replace(" PM", " pm");
    } catch (error) {
      return "";
    }
  }

  function mapNotificationLink(moduleName) {
    var label = String(moduleName || "").toLowerCase();
    if (label.indexOf("passing") !== -1) return "passing-voucher.html";
    if (label.indexOf("payments") !== -1) return "payments-voucher.html";
    if (label.indexOf("budget") !== -1 || label.indexOf("departments") !== -1 || label.indexOf("categories") !== -1) return "budget-log.html";
    return "dashboard.html";
  }

  function renderNotificationsDropdown(dropdown) {
    var items = latestNotifications();
    dropdown.innerHTML = '' +
      '<div class="shell-dropdown-head"><strong>Notifications</strong><span>' + items.length + ' items</span></div>' +
      '<div class="shell-dropdown-list">' +
      items.map(function (item) {
        return '<a class="shell-notification-row" href="' + item.href + '">' +
          '<strong>' + item.title + '</strong>' +
          '<span>' + item.meta + '</span>' +
          '<em>' + item.time + '</em>' +
          '</a>';
      }).join("") +
      '</div>';
  }

  function ensureTopbarActions() {
    var profile = currentUserProfile();
    document.querySelectorAll(".app-topbar .shell-actions").forEach(function (actions) {
      var settingsButton = actions.querySelector('[data-shell-action="settings"]') || Array.from(actions.querySelectorAll(".shell-icon-button")).find(function (button) {
        return /settings/i.test(button.getAttribute("title") || "");
      });
      var notificationButton = actions.querySelector('[data-shell-action="notifications"]') || Array.from(actions.querySelectorAll(".shell-icon-button")).find(function (button) {
        return /notification/i.test(button.getAttribute("title") || "");
      });
      var profileButton = actions.querySelector('[data-shell-action="profile"]') || Array.from(actions.querySelectorAll(".shell-icon-button")).find(function (button) {
        return button.classList.contains("profile") || /current profile|profile/i.test(button.getAttribute("title") || "");
      });
      var logoutButton = actions.querySelector('[data-shell-action="logout"]') || Array.from(actions.querySelectorAll(".shell-icon-button")).find(function (button) {
        return /logout|log out/i.test(button.getAttribute("title") || "");
      });

      if (settingsButton) {
        settingsButton.setAttribute("data-shell-action", "settings");
      } else {
        actions.insertAdjacentHTML("beforeend", shellButtonMarkup("settings", "Settings"));
      }

      if (notificationButton) {
        notificationButton.setAttribute("data-shell-action", "notifications");
      } else {
        actions.insertAdjacentHTML("beforeend", shellButtonMarkup("notifications", "Notifications", "", latestNotifications().length));
      }

      notificationButton = actions.querySelector('[data-shell-action="notifications"]');
      if (notificationButton) {
        var badge = notificationButton.querySelector(".shell-icon-badge");
        if (badge) {
          badge.textContent = latestNotifications().length;
        }
        if (!notificationButton.parentElement.querySelector(".shell-dropdown")) {
          notificationButton.insertAdjacentHTML("afterend", '<div class="shell-dropdown notifications-dropdown" hidden></div>');
          notificationButton.parentElement.classList.add("shell-menu-wrap");
        }
      }

      if (profileButton) {
        profileButton.setAttribute("data-shell-action", "profile");
        profileButton.classList.add("profile");
      } else {
        actions.insertAdjacentHTML("beforeend", shellButtonMarkup("profile", "Current profile: " + profile.role, "profile"));
      }
      profileButton = actions.querySelector('[data-shell-action="profile"]');
      profileButton.setAttribute("title", "Current profile: " + profile.role);

      if (logoutButton) {
        logoutButton.setAttribute("data-shell-action", "logout");
        logoutButton.classList.add("logout");
      } else {
        actions.insertAdjacentHTML("beforeend", shellButtonMarkup("logout", "Log out", "logout"));
      }
    });
  }

  function closeAllShellDropdowns() {
    document.querySelectorAll(".shell-dropdown").forEach(function (dropdown) {
      dropdown.hidden = true;
    });
    document.querySelectorAll('[data-shell-action="notifications"]').forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  function bindTopbarActions() {
    var profile = currentUserProfile();
    document.querySelectorAll('[data-shell-action="settings"]').forEach(function (button) {
      button.addEventListener("click", function () {
        window.location.href = "settings-organization.html";
      });
    });
    document.querySelectorAll('[data-shell-action="profile"]').forEach(function (button) {
      button.setAttribute("title", "Current profile: " + profile.role);
      button.addEventListener("click", function () {
        window.location.href = "profile.html";
      });
    });
    document.querySelectorAll('[data-shell-action="logout"]').forEach(function (button) {
      button.addEventListener("click", function () {
        try {
          localStorage.removeItem(CURRENT_USER_KEY);
        } catch (error) {
          return;
        }
        window.location.href = "login.html";
      });
    });
    document.querySelectorAll(".notifications-dropdown").forEach(renderNotificationsDropdown);
    document.querySelectorAll('[data-shell-action="notifications"]').forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        var dropdown = button.parentElement.querySelector(".shell-dropdown");
        var willOpen = dropdown.hidden;
        closeAllShellDropdowns();
        dropdown.hidden = !willOpen;
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".shell-menu-wrap")) {
        closeAllShellDropdowns();
      }
    });
  }

  function injectOtherReportsNavigation() {
    var currentPage = normalizePath(window.location.pathname) || "index.html";
    var reportPages = ["scfpr.html", "scfpo.html", "scfc.html", "sccn.html"];
    document.querySelectorAll(".side-rail .nav-item").forEach(function (link) {
      var labelNode = link.querySelector("span:nth-child(2)");
      var label = (labelNode ? labelNode.textContent : link.textContent).replace(/\s+/g, " ").trim().toLowerCase();
      if ((label !== "reports" && label !== "other reports") || link.dataset.reportsUpgraded === "true") {
        return;
      }

      var details = document.createElement("details");
      details.className = "nav-details";
      details.dataset.reportsUpgraded = "true";
      details.innerHTML = '' +
        '<summary class="nav-parent"><span class="nav-icon">R</span><span>Other Reports</span><span class="nav-chevron" aria-hidden="true"></span></summary>' +
        '<div class="nav-submenu">' +
        '<a href="scfpr.html"' + (currentPage === "scfpr.html" ? ' class="active"' : "") + '>SCFPR</a>' +
        '<a href="scfpo.html"' + (currentPage === "scfpo.html" ? ' class="active"' : "") + '>SCFPO</a>' +
        '<a href="scfc.html"' + (currentPage === "scfc.html" ? ' class="active"' : "") + '>SCFC</a>' +
        '<a href="sccn.html"' + (currentPage === "sccn.html" ? ' class="active"' : "") + '>SCCN</a>' +
        '</div>';
      details.open = reportPages.indexOf(currentPage) !== -1;

      link.dataset.reportsUpgraded = "true";
      link.replaceWith(details);
    });
  }

  function classifyActionButton(button) {
    if (!button || !button.classList || !button.classList.contains("button")) {
      return;
    }

    var label = [button.getAttribute("aria-label"), button.getAttribute("title"), button.textContent]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    button.classList.remove("action-add", "action-submit", "action-cancel", "action-delete", "action-edit");

    if (!label) {
      return;
    }

    if (/\b(cancel|delete|remove|reject)\b/.test(label)) {
      button.classList.add("action-cancel");
      return;
    }

    if (/\bsubmit\b/.test(label)) {
      button.classList.add("action-submit");
      return;
    }

    if (/\b(add|new|create|insert)\b/.test(label)) {
      button.classList.add("action-add");
      return;
    }

    if (/\b(edit|update)\b/.test(label)) {
      button.classList.add("action-edit");
    }
  }

  function classifyActionButtons(root) {
    var scope = root || document;
    scope.querySelectorAll(".button").forEach(classifyActionButton);
  }

  function watchActionButtons() {
    if (!window.MutationObserver) {
      return;
    }

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (!node || node.nodeType !== 1) {
            return;
          }
          if (node.matches && node.matches(".button")) {
            classifyActionButton(node);
          }
          if (node.querySelectorAll) {
            classifyActionButtons(node);
          }
        });
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var initialTheme = loadTheme();
    applyTheme(initialTheme);
    hydrateRailBrand();
    injectWorkQueueNavigation();
    injectCashbookNavigation();
    injectLedgerNavigation();
    injectOtherReportsNavigation();
    injectAdministrationNavigation();
    ensureTopbarActions();
    initPersistentNavigation();
    bindTopbarActions();
    classifyActionButtons(document);
    watchActionButtons();

    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        var selectedTheme = button.getAttribute("data-theme-choice");
        applyTheme(selectedTheme);
        storeTheme(selectedTheme);
      });
    });
  });
})();

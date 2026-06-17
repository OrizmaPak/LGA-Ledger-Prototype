(function () {
  var STORAGE_KEY = "lga-instance-selection";
  var STATE_INSTANCE_KEY = "lga-state-instance";
  var STATES_API_URL = "https://countriesnow.space/api/v0.1/countries/states";
  var NGA_LGA_API_URL = "https://nga-states-lga.onrender.com/";
  var COUNTRIESNOW_LGA_API_URL = "https://countriesnow.space/api/v0.1/countries/state/cities/q";
  var FALLBACK_STATES = [
    "Abia State", "Adamawa State", "Akwa Ibom State", "Anambra State", "Bauchi State",
    "Bayelsa State", "Benue State", "Borno State", "Cross River State", "Delta State",
    "Ebonyi State", "Edo State", "Ekiti State", "Enugu State", "Federal Capital Territory",
    "Gombe State", "Imo State", "Jigawa State", "Kaduna State", "Kano State", "Katsina State",
    "Kebbi State", "Kogi State", "Kwara State", "Lagos State", "Nasarawa State", "Niger State",
    "Ogun State", "Ondo State", "Osun State", "Oyo State", "Plateau State", "Rivers State",
    "Sokoto State", "Taraba State", "Yobe State", "Zamfara State"
  ];
  function $(id) {
    return document.getElementById(id);
  }

  function formatDate(timestamp) {
    if (!timestamp) {
      return "Not saved";
    }

    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return "Not saved";
    }
  }

  function loadJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function setFeedback(message, type) {
    var feedback = $("lga-instance-feedback");
    if (!feedback) {
      return;
    }

    feedback.textContent = message;
    feedback.className = "save-feedback" + (type ? " " + type : "");
  }

  function toNgaStateName(stateName) {
    return stateName.replace(/\s+State$/i, "").replace(/\s+/g, "");
  }

  function normalizeLgaName(name) {
    return String(name || "")
      .replace(/[–-]/g, "/")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatLgaLabel(name) {
    var normalized = normalizeLgaName(name);
    return /LGA$/i.test(normalized) ? normalized : normalized + " LGA";
  }

  function setLGAOptions(lgas, selectedLga, sourceLabel) {
    var select = $("lga-instance-name");
    var normalizedSelected = normalizeLgaName(selectedLga);
    var options = Array.from(new Set((lgas || []).map(normalizeLgaName).filter(Boolean))).sort(function (a, b) {
      return a.localeCompare(b);
    });

    if (!options.length) {
      select.innerHTML = '<option value="">No local governments found</option>';
      $("lga-source-note").textContent = sourceLabel || "No local governments were returned for the selected state.";
      return;
    }

    select.innerHTML = '<option value="">Select local government</option>' + options.map(function (name) {
      return '<option value="' + formatLgaLabel(name) + '">' + formatLgaLabel(name) + "</option>";
    }).join("");

    var matchingOption = options.find(function (name) {
      return formatLgaLabel(name) === normalizedSelected || normalizeLgaName(name) === normalizeLgaName(normalizedSelected.replace(/\s+LGA$/i, ""));
    });

    if (matchingOption) {
      select.value = formatLgaLabel(matchingOption);
    }

    $("lga-source-note").textContent = sourceLabel || "Local governments loaded successfully.";
  }

  function updatePreview(instance, sourceLabel) {
    var state = instance && instance.state ? instance.state : "";
    var lga = instance && instance.lga ? instance.lga : "";

    $("lga-preview-state").textContent = state || "Not selected";
    $("lga-preview-name").textContent = lga || "Not selected";
    $("lga-preview-source").textContent = sourceLabel || (instance && instance.source ? instance.source : "Awaiting API load");

    $("lga-summary-name").textContent = lga || "No LGA instance yet";
    $("lga-summary-description").textContent = lga
      ? "Budget control, approvals, cash book, ledgers, reports, audit log, and sync queue for " + lga + "."
      : "Save the LGA instance first. The authentication flow will then use this selected state and local government.";
    $("lga-summary-state").textContent = state || "Pending";
    $("lga-summary-saved-at").textContent = instance ? formatDate(instance.savedAt) : "Not saved";
  }

  function setStateOptions(states, sourceLabel) {
    var select = $("lga-instance-state");
    var savedLga = loadJSON(STORAGE_KEY);
    var savedStateInstance = loadJSON(STATE_INSTANCE_KEY);
    var preferredState = (savedLga && savedLga.state) || (savedStateInstance && savedStateInstance.state) || "";
    var uniqueStates = Array.from(new Set(states)).filter(Boolean).sort(function (a, b) {
      return a.localeCompare(b);
    });

    select.innerHTML = '<option value="">Select state</option>' + uniqueStates.map(function (state) {
      return '<option value="' + state + '">' + state + "</option>";
    }).join("");

    if (preferredState && uniqueStates.indexOf(preferredState) >= 0) {
      select.value = preferredState;
    }

    if (select.value) {
      fetchLgasForState(select.value, savedLga && savedLga.lga ? savedLga.lga : "");
    } else {
      setLGAOptions([], "", "Local governments will load after state selection.");
    }
    $("lga-state-source-note").textContent = sourceLabel;
    updatePreview(savedLga || { state: select.value }, sourceLabel);
  }

  async function fetchStates() {
    try {
      var response = await fetch(STATES_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: "Nigeria" })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }

      var data = await response.json();
      var states = Array.isArray(data && data.data && data.data.states)
        ? data.data.states.map(function (state) { return state.name; }).filter(Boolean)
        : [];

      if (!states.length) {
        throw new Error("No states returned");
      }

      setStateOptions(states, "State list loaded from API.");
    } catch (error) {
      setStateOptions(FALLBACK_STATES, "API unavailable. Showing fallback state list.");
    }
  }

  async function fetchLgasFromNga(stateName) {
    var response = await fetch(NGA_LGA_API_URL + "?state=" + encodeURIComponent(toNgaStateName(stateName)));

    if (!response.ok) {
      throw new Error("Primary LGA API failed");
    }

    var data = await response.json();
    if (!Array.isArray(data) || !data.length) {
      throw new Error("Primary LGA API returned no LGAs");
    }

    return {
      lgas: data,
      source: "Local governments loaded from NGA LGA API."
    };
  }

  async function fetchLgasFromCountriesNow(stateName) {
    var response = await fetch(COUNTRIESNOW_LGA_API_URL + "?country=" + encodeURIComponent("Nigeria") + "&state=" + encodeURIComponent(stateName));

    if (!response.ok) {
      throw new Error("Fallback LGA API failed");
    }

    var data = await response.json();
    var lgas = Array.isArray(data && data.data) ? data.data : [];

    if (!lgas.length) {
      throw new Error("Fallback LGA API returned no LGAs");
    }

    return {
      lgas: lgas,
      source: "Local governments loaded from CountriesNow fallback API."
    };
  }

  async function fetchLgasForState(stateName, selectedLga) {
    if (!stateName) {
      setLGAOptions([], "", "Local governments will load after state selection.");
      return;
    }

    $("lga-instance-name").innerHTML = '<option value="">Loading local governments...</option>';
    $("lga-source-note").textContent = "Loading local governments for " + stateName + "...";

    try {
      var primary = await fetchLgasFromNga(stateName);
      setLGAOptions(primary.lgas, selectedLga, primary.source);
      return;
    } catch (primaryError) {
      try {
        var fallback = await fetchLgasFromCountriesNow(stateName);
        setLGAOptions(fallback.lgas, selectedLga, fallback.source);
        return;
      } catch (fallbackError) {
        setLGAOptions([], "", "Unable to load local governments for the selected state.");
      }
    }
  }

  function handleStateChange() {
    var state = $("lga-instance-state").value.trim();
    fetchLgasForState(state, "");
    updatePreview({
      lga: $("lga-instance-name").value.trim(),
      state: state
    }, $("lga-state-source-note").textContent.trim());
  }

  function handleLgaChange() {
    updatePreview({
      lga: $("lga-instance-name").value.trim(),
      state: $("lga-instance-state").value.trim()
    }, $("lga-state-source-note").textContent.trim());
  }

  function handleSave() {
    var state = $("lga-instance-state").value.trim();
    var lga = $("lga-instance-name").value.trim();
    var sourceText = $("lga-state-source-note").textContent.trim();

    if (!state) {
      setFeedback("Select a state before saving the LGA instance.", "error");
      return;
    }

    if (!lga) {
      setFeedback("Select a local government before saving the LGA instance.", "error");
      return;
    }

    var instance = {
      lga: lga,
      savedAt: new Date().toISOString(),
      source: sourceText,
      state: state
    };

    if (!saveJSON(STORAGE_KEY, instance)) {
      setFeedback("The browser could not save this LGA instance locally.", "error");
      return;
    }

    updatePreview(instance, sourceText);
    setFeedback(lga + " instance saved successfully.", "success");
  }

  function hydrateLogin() {
    if (!$("login-selected-state")) {
      return;
    }

    var saved = loadJSON(STORAGE_KEY);
    var state = saved && saved.state ? saved.state : "Delta State";
    var lga = saved && saved.lga ? saved.lga : "Ukwuani Local Government Council";
    var lgaShortName = lga.replace(/\s+LGA$/, "");

    $("login-instance-name").textContent = lga;
    $("login-instance-meta").textContent = state + " / 2026 financial year";
    $("login-display-title").textContent = lga;
    $("login-display-meta").textContent = state + " command workspace for approvals, cash book, ledgers, reports, and sync monitoring.";
    $("login-selected-state").textContent = state;
    $("login-selected-lga").textContent = lgaShortName;
  }

  document.addEventListener("DOMContentLoaded", function () {
    hydrateLogin();

    if (!$("lga-instance-state")) {
      return;
    }

    fetchStates();
    $("save-lga-instance").addEventListener("click", handleSave);
    $("lga-instance-state").addEventListener("change", handleStateChange);
    $("lga-instance-name").addEventListener("change", handleLgaChange);
  });
})();

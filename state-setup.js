(function () {
  var STORAGE_KEY = "lga-state-instance";
  var STATES_API_URL = "https://countriesnow.space/api/v0.1/countries/states";
  var FALLBACK_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
    "Yobe", "Zamfara"
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

  function loadSavedInstance() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveInstance(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      return false;
    }

    return true;
  }

  function setFeedback(message, type) {
    var feedback = $("state-instance-feedback");
    if (!feedback) {
      return;
    }

    feedback.textContent = message;
    feedback.className = "save-feedback" + (type ? " " + type : "");
  }

  function updatePreview(instance, sourceLabel) {
    $("instance-preview-state").textContent = instance && instance.state ? instance.state : "Not selected";
    $("instance-preview-hq").textContent = instance && instance.headquarters ? instance.headquarters : "Not provided";
    $("instance-preview-populace").textContent = instance && instance.populace ? instance.populace : "Not provided";
    $("instance-preview-source").textContent = sourceLabel || (instance && instance.source ? instance.source : "Awaiting API load");

    $("summary-state-name").textContent = instance && instance.state ? instance.state + " Monitoring Hub" : "No state instance yet";
    $("summary-state-description").textContent = instance && instance.state
      ? "Central reporting, analytics, audit review, and sync backlog monitoring for the " + instance.state + " instance."
      : "Create the state instance first. After that, the monitoring hub will use this saved identity.";
    $("summary-headquarters").textContent = instance && instance.headquarters ? instance.headquarters : "Pending";
    $("summary-populace").textContent = instance && instance.populace ? instance.populace : "Pending";
    $("summary-saved-at").textContent = instance ? formatDate(instance.savedAt) : "Not saved";
  }

  function fillForm(instance) {
    if (!instance) {
      return;
    }

    if ($("state-instance-state")) {
      $("state-instance-state").value = instance.state || "";
    }

    if ($("state-instance-hq")) {
      $("state-instance-hq").value = instance.headquarters || "";
    }

    if ($("state-instance-populace")) {
      $("state-instance-populace").value = instance.populace || "";
    }
  }

  function setStateOptions(states, sourceLabel) {
    var select = $("state-instance-state");
    var savedInstance = loadSavedInstance();
    var currentValue = savedInstance && savedInstance.state ? savedInstance.state : "";
    var uniqueStates = Array.from(new Set(states)).filter(Boolean).sort(function (a, b) {
      return a.localeCompare(b);
    });

    select.innerHTML = '<option value="">Select state</option>' + uniqueStates.map(function (state) {
      return '<option value="' + state + '">' + state + "</option>";
    }).join("");

    if (currentValue && uniqueStates.indexOf(currentValue) >= 0) {
      select.value = currentValue;
    }

    $("state-source-note").textContent = sourceLabel;
    updatePreview(savedInstance, sourceLabel);
    fillForm(savedInstance);
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
      return;
    } catch (error) {
      setStateOptions(FALLBACK_STATES, "API unavailable. Showing fallback state list.");
    }
  }

  function handleSave() {
    var state = $("state-instance-state").value.trim();
    var headquarters = $("state-instance-hq").value.trim();
    var populace = $("state-instance-populace").value.trim();
    var sourceText = $("state-source-note").textContent.trim();

    if (!state) {
      setFeedback("Select a state before creating the instance.", "error");
      return;
    }

    if (!headquarters) {
      setFeedback("Enter the headquarters community before saving.", "error");
      return;
    }

    if (!populace) {
      setFeedback("Enter the populace identity before saving.", "error");
      return;
    }

    var instance = {
      headquarters: headquarters,
      populace: populace,
      savedAt: new Date().toISOString(),
      source: sourceText,
      state: state
    };

    if (!saveInstance(instance)) {
      setFeedback("The browser could not save this state instance locally.", "error");
      return;
    }

    updatePreview(instance, sourceText);
    setFeedback(state + " state instance created successfully.", "success");
  }

  function hydrateDashboard(instance) {
    if (!$("dashboard-preview-state")) {
      return;
    }

    $("dashboard-preview-state").textContent = instance && instance.state ? instance.state : "Not saved";
    $("dashboard-preview-hq").textContent = instance && instance.headquarters ? instance.headquarters : "Not saved";
    $("dashboard-preview-populace").textContent = instance && instance.populace ? instance.populace : "Not saved";
    $("dashboard-preview-saved-at").textContent = instance ? formatDate(instance.savedAt) : "Not saved";
    $("state-dashboard-name").textContent = instance && instance.state ? instance.state + " Monitoring Dashboard" : "State Monitoring Dashboard";
    $("state-dashboard-meta").textContent = instance && instance.headquarters ? instance.headquarters + " headquarters community" : "Saved state instance preview";
    $("state-dashboard-heading").textContent = instance && instance.state ? instance.state + " State Monitoring Hub" : "No saved state instance";
    $("state-dashboard-description").textContent = instance && instance.populace
      ? "Monitoring identity for " + instance.populace + " has been loaded from the saved setup."
      : "Create a state instance first so the monitoring dashboard can inherit its identity.";
    $("state-dashboard-status").textContent = instance && instance.state ? "Instance loaded" : "Awaiting setup";
    $("state-dashboard-status").className = "status-pill " + (instance && instance.state ? "ok" : "info");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var savedInstance = loadSavedInstance();
    hydrateDashboard(savedInstance);

    if (!$("state-instance-state")) {
      return;
    }

    updatePreview(savedInstance, "Loading state source...");
    fillForm(savedInstance);
    fetchStates();

    $("save-state-instance").addEventListener("click", handleSave);
    $("state-instance-state").addEventListener("change", function () {
      updatePreview({
        state: $("state-instance-state").value.trim(),
        headquarters: $("state-instance-hq").value.trim(),
        populace: $("state-instance-populace").value.trim(),
        savedAt: savedInstance ? savedInstance.savedAt : null
      }, $("state-source-note").textContent.trim());
    });
  });
})();

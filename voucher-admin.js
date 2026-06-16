(function () {
  var STORE = {
    departments: "budget-admin-departments",
    categories: "budget-admin-categories",
    items: "budget-admin-items",
    vouchers: "voucher-payment-records",
    logs: "budget-admin-logs"
  };
  var CURRENT_ACTOR = "Super Admin";
  var CURRENT_NAME = "Tamuno Briggs";
  var LOCAL_GOVERNMENT_NAME = "Port Harcourt LGA";
  var STATE_NAME = "Rivers State";
  var TABLE_STATE = {};
  var viewVoucherId = "";
  var checkingVoucherId = "";
  var passingVoucherId = "";
  var uploadedDocumentNames = [];
  var currentEntryMode = "classification";
  var SYSTEM_USERS = [
    "Tamuno Briggs",
    "Amaka George",
    "Ebiere Lawson",
    "Ngozi Nwosu",
    "Sarah Duke",
    "A. Peters"
  ];

  var seedDepartments = [
    { id: "dept-health", code: "HLT", name: "Health", status: "Active" },
    { id: "dept-works", code: "WRK", name: "Works", status: "Active" },
    { id: "dept-education", code: "EDU", name: "Education", status: "Active" },
    { id: "dept-finance", code: "FIN", name: "Finance", status: "Active" }
  ];
  var seedCategories = [
    { id: "cat-health-capital", code: "2202", name: "Primary Health Capital" },
    { id: "cat-works-roads", code: "2301", name: "Road Maintenance" },
    { id: "cat-education-grants", code: "2105", name: "Education Grants" },
    { id: "cat-admin-services", code: "2004", name: "Administrative Services" },
    { id: "cat-community-support", code: "2403", name: "Community Support" }
  ];
  var seedItems = [
    { id: "item-health-centres", categoryId: "cat-health-capital", code: "220201", name: "Primary health centre renovation" },
    { id: "item-health-equipment", categoryId: "cat-health-capital", code: "220202", name: "Rural clinic equipment" },
    { id: "item-road-repairs", categoryId: "cat-works-roads", code: "230101", name: "Township road repairs" },
    { id: "item-drainage-desilt", categoryId: "cat-works-roads", code: "230102", name: "Drainage desilting works" },
    { id: "item-school-support", categoryId: "cat-education-grants", code: "210501", name: "School support grants" }
  ];
  var seedVouchers = [
    {
      id: "pv-2026-040",
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      voucherNumber: "PV-2026-040",
      voucherDate: "2026-06-12",
      payToEntries: [
        { id: "payto-040-1", name: "Rivers Builders Ltd", description: "Township road resurfacing mobilisation" },
        { id: "payto-040-2", name: "Drainage Response Unit", description: "Drainage shoulder repairs" }
      ],
      classifications: [
        {
          id: "class-040-1",
          mode: "classification",
          departmentId: "dept-works",
          categoryId: "cat-works-roads",
          itemId: "item-road-repairs",
          advancedUser: "",
          generalDescription: "Road maintenance batch one.",
          checkedBy: "",
          passedBy: "",
          amount: 8400000
        },
        {
          id: "class-040-2",
          mode: "advanced",
          departmentId: "advanced",
          categoryId: "",
          itemId: "",
          advancedUser: "Tamuno Briggs",
          generalDescription: "Emergency oversight and direct release support.",
          checkedBy: "",
          passedBy: "",
          amount: 4000000
        }
      ],
      supportingDocuments: ["award-letter.pdf", "road-schedule.xlsx"],
      totalAmount: 12400000,
      status: "Passed",
      rejectionNote: "",
      createdAt: "2026-06-12T08:10:00Z",
      checkedAt: "2026-06-12T09:00:00Z",
      passedAt: "2026-06-12T10:42:00Z",
      rejectedAt: "",
      createdBy: CURRENT_NAME,
      checkedByWorkflow: "Amaka George",
      passedByWorkflow: CURRENT_NAME
    },
    {
      id: "pv-2026-041",
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      voucherNumber: "PV-2026-041",
      voucherDate: "2026-06-13",
      payToEntries: [
        { id: "payto-041-1", name: "Chinedu Okoro", description: "Medical supply reimbursement" }
      ],
      classifications: [
        {
          id: "class-041-1",
          mode: "classification",
          departmentId: "dept-health",
          categoryId: "cat-health-capital",
          itemId: "item-health-centres",
          advancedUser: "",
          generalDescription: "Rural clinic consumables reimbursement.",
          checkedBy: "",
          passedBy: "",
          amount: 3200000
        },
        {
          id: "class-041-2",
          mode: "classification",
          departmentId: "dept-health",
          categoryId: "cat-health-capital",
          itemId: "item-health-equipment",
          advancedUser: "",
          generalDescription: "Cold-chain replacement parts.",
          checkedBy: "",
          passedBy: "",
          amount: 2400000
        }
      ],
      supportingDocuments: ["supply-receipt.pdf"],
      totalAmount: 5600000,
      status: "Checking",
      rejectionNote: "",
      createdAt: "2026-06-13T07:45:00Z",
      checkedAt: "",
      passedAt: "",
      rejectedAt: "",
      createdBy: "Amaka George",
      checkedByWorkflow: "",
      passedByWorkflow: ""
    },
    {
      id: "pv-2026-042",
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      voucherNumber: "PV-2026-042",
      voucherDate: "2026-06-14",
      payToEntries: [
        { id: "payto-042-1", name: "Bright Future Initiative", description: "School support grant batch 1" }
      ],
      classifications: [
        {
          id: "class-042-1",
          mode: "advanced",
          departmentId: "advanced",
          categoryId: "",
          itemId: "",
          advancedUser: "Sarah Duke",
          generalDescription: "Education support grant escalation.",
          checkedBy: "",
          passedBy: "",
          amount: 3500000
        }
      ],
      supportingDocuments: ["grant-memo.pdf", "beneficiary-list.xlsx"],
      totalAmount: 3500000,
      status: "Draft",
      rejectionNote: "Return to draft after memo reference mismatch.",
      createdAt: "2026-06-14T08:15:00Z",
      checkedAt: "",
      passedAt: "",
      rejectedAt: "2026-06-14T10:12:00Z",
      createdBy: CURRENT_NAME,
      checkedByWorkflow: "",
      passedByWorkflow: ""
    }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function data() {
    return {
      departments: read(STORE.departments, seedDepartments),
      categories: read(STORE.categories, seedCategories),
      items: read(STORE.items, seedItems)
    };
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function digits(value) {
    return Number(value || 0).toLocaleString();
  }

  function displayAmount(value) {
    return Number(value || 0) ? digits(value) : "-";
  }

  function parseMoney(value) {
    return Number(String(value || "").replace(/,/g, "")) || 0;
  }

  function formatMoneyInputValue(value) {
    var cleaned = String(value || "").replace(/[^0-9.]/g, "");
    var parts = cleaned.split(".");
    var whole = parts.shift() || "";
    var decimal = parts.length ? "." + parts.join("") : "";

    if (!whole && !decimal) {
      return "";
    }

    return (whole ? Number(whole).toLocaleString() : "0") + decimal;
  }

  function stamp(value) {
    if (!value) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date(value)).replace(" AM", " am").replace(" PM", " pm");
  }

  function byId(list, id) {
    return list.find(function (item) { return item.id === id; });
  }

  function optionList(items, selectedValue, label) {
    return '<option value="">' + label + "</option>" + items.map(function (item) {
      var value = item.id || item.value || item;
      var text = item.name || item.label || item;
      var selected = value === selectedValue ? " selected" : "";
      return '<option value="' + escapeHtml(value) + '"' + selected + ">" + escapeHtml(text) + "</option>";
    }).join("");
  }

  function slug(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || String(Date.now());
  }

  function statusPill(status) {
    var type = "info";
    if (status === "Checking" || status === "Passing") {
      type = "warn";
    } else if (status === "Passed") {
      type = "ok";
    }
    return '<span class="status-pill ' + type + '">' + escapeHtml(status) + "</span>";
  }

  function applyStatusPill(id, status) {
    var element = $(id);
    var type = "info";
    if (!element) {
      return;
    }
    if (status === "Checking" || status === "Passing") {
      type = "warn";
    } else if (status === "Passed") {
      type = "ok";
    }
    element.className = "status-pill " + type;
    element.textContent = status;
  }

  function getVouchers() {
    return read(STORE.vouchers, seedVouchers).map(normalizeVoucher).sort(function (left, right) {
      return String(right.voucherDate || "").localeCompare(String(left.voucherDate || ""));
    });
  }

  function normalizePayToEntry(raw) {
    return {
      id: raw && raw.id ? raw.id : "payto-" + Date.now(),
      name: raw && raw.name ? raw.name : "",
      description: raw && raw.description ? raw.description : ""
    };
  }

  function normalizeClassification(raw) {
    return {
      id: raw && raw.id ? raw.id : "class-" + Date.now(),
      mode: raw && raw.mode === "advanced" ? "advanced" : "classification",
      departmentId: raw && raw.departmentId ? raw.departmentId : "",
      categoryId: raw && raw.categoryId ? raw.categoryId : "",
      itemId: raw && raw.itemId ? raw.itemId : "",
      advancedUser: raw && raw.advancedUser ? raw.advancedUser : "",
      generalDescription: raw && raw.generalDescription ? raw.generalDescription : "",
      checkedBy: raw && raw.checkedBy ? raw.checkedBy : "",
      passedBy: raw && raw.passedBy ? raw.passedBy : "",
      amount: Number(raw && raw.amount ? raw.amount : 0) || 0
    };
  }

  function normalizeVoucher(raw) {
    var base = raw || {};
    var payToEntries = Array.isArray(base.payToEntries) ? base.payToEntries.map(normalizePayToEntry) : [];
    var classifications = Array.isArray(base.classifications) ? base.classifications.map(normalizeClassification) : [];
    var totalAmount = classifications.reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0);
    return {
      id: base.id || "pv-" + slug(base.voucherNumber || Date.now()),
      localGovernmentName: base.localGovernmentName || LOCAL_GOVERNMENT_NAME,
      stateName: base.stateName || STATE_NAME,
      voucherNumber: base.voucherNumber || "",
      voucherDate: base.voucherDate || new Date().toISOString().slice(0, 10),
      payToEntries: payToEntries,
      classifications: classifications,
      supportingDocuments: Array.isArray(base.supportingDocuments) ? base.supportingDocuments : [],
      totalAmount: totalAmount,
      status: base.status || "Draft",
      rejectionNote: base.rejectionNote || "",
      createdAt: base.createdAt || "",
      checkedAt: base.checkedAt || "",
      passedAt: base.passedAt || "",
      rejectedAt: base.rejectedAt || "",
      createdBy: base.createdBy || "",
      checkedByWorkflow: base.checkedByWorkflow || "",
      passedByWorkflow: base.passedByWorkflow || ""
    };
  }

  function rowSearchText(markup) {
    var scratch = document.createElement("div");
    scratch.innerHTML = markup;
    return (scratch.textContent || scratch.innerText || "").toLowerCase();
  }

  function ensureTableState(id, pageSize) {
    if (!TABLE_STATE[id]) {
      TABLE_STATE[id] = { page: 1, pageSize: pageSize || 5, query: "" };
    }
    if (pageSize) {
      TABLE_STATE[id].pageSize = pageSize;
    }
    return TABLE_STATE[id];
  }

  function registerTableRows(bodyId, rows, emptyMarkup, options) {
    var body = $(bodyId);
    var state;
    if (!body) {
      return;
    }
    state = ensureTableState(bodyId, (options || {}).pageSize || 5);
    state.rows = rows.map(function (row) {
      return typeof row === "string"
        ? { markup: row, searchText: rowSearchText(row) }
        : { markup: row.markup, searchText: String(row.searchText || rowSearchText(row.markup)).toLowerCase() };
    });
    state.emptyMarkup = emptyMarkup;
    state.countId = options && options.countId;
    renderTableSet(bodyId);
  }

  function buildPageButtons(currentPage, totalPages) {
    var buttons = [];
    var page;
    for (page = 1; page <= totalPages; page += 1) {
      buttons.push('<button class="pagination-button pagination-number' + (page === currentPage ? " active" : "") + '" type="button" data-page-target="' + page + '">' + page + "</button>");
    }
    return buttons.join("");
  }

  function renderTableSet(bodyId) {
    var body = $(bodyId);
    var state = TABLE_STATE[bodyId];
    var filteredRows;
    var totalPages;
    var start;
    var visibleRows;
    var shell;
    var tools;
    var footer;

    if (!body || !state) {
      return;
    }

    filteredRows = state.query
      ? state.rows.filter(function (row) { return row.searchText.indexOf(state.query) !== -1; })
      : state.rows.slice();

    totalPages = Math.max(1, Math.ceil(filteredRows.length / state.pageSize));
    if (state.page > totalPages) {
      state.page = totalPages;
    }
    if (state.page < 1) {
      state.page = 1;
    }

    start = (state.page - 1) * state.pageSize;
    visibleRows = filteredRows.slice(start, start + state.pageSize);

    body.innerHTML = visibleRows.length
      ? visibleRows.map(function (row) { return row.markup; }).join("")
      : state.emptyMarkup;

    if (state.countId && $(state.countId)) {
      $(state.countId).textContent = filteredRows.length + " records";
    }

    shell = body.closest(".table-shell");
    if (!shell) {
      return;
    }

    tools = shell.querySelector(".table-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "table-tools";
      shell.insertBefore(tools, shell.querySelector(".table-content"));
    }
    tools.innerHTML =
      '<label class="table-search"><span>Search</span><input type="search" value="' + state.query.replace(/"/g, "&quot;") + '" placeholder="Type to filter this table"></label>';

    tools.querySelector("input").addEventListener("input", function (event) {
      state.query = event.target.value.trim().toLowerCase();
      state.page = 1;
      renderTableSet(bodyId);
    });

    footer = shell.querySelector(".table-pagination");
    if (!footer) {
      footer = document.createElement("div");
      footer.className = "table-pagination";
      shell.appendChild(footer);
    }
    footer.innerHTML =
      '<div class="table-pagination-summary">' +
      '<label class="table-tools-select"><span>Rows</span><select data-table-size><option value="5"' + (state.pageSize === 5 ? " selected" : "") + '>5</option><option value="10"' + (state.pageSize === 10 ? " selected" : "") + '>10</option></select></label>' +
      '<span class="table-range-copy">Showing <strong>' + (filteredRows.length ? start + 1 : 0) + "-" + Math.min(start + state.pageSize, filteredRows.length) + '</strong> of <strong>' + filteredRows.length + "</strong></span>" +
      "</div>" +
      '<div class="table-pagination-controls">' +
      '<button class="pagination-button" type="button" data-pagination-move="prev"' + (state.page === 1 ? " disabled" : "") + '>Prev</button>' +
      '<div class="pagination-pages">' + buildPageButtons(state.page, totalPages) + "</div>" +
      '<button class="pagination-button" type="button" data-pagination-move="next"' + (state.page === totalPages ? " disabled" : "") + '>Next</button>' +
      "</div>";

    footer.querySelector("[data-table-size]").addEventListener("change", function (event) {
      state.pageSize = Number(event.target.value);
      state.page = 1;
      renderTableSet(bodyId);
    });

    footer.querySelectorAll("[data-pagination-move]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.page += button.getAttribute("data-pagination-move") === "next" ? 1 : -1;
        renderTableSet(bodyId);
      });
    });

    footer.querySelectorAll("[data-page-target]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.page = Number(button.getAttribute("data-page-target"));
        renderTableSet(bodyId);
      });
    });
  }

  function ensureToastRoot() {
    var root = document.querySelector(".toast-stack");
    if (root) {
      return root;
    }
    root = document.createElement("div");
    root.className = "toast-stack";
    document.body.appendChild(root);
    return root;
  }

  function toast(message, type) {
    var root = ensureToastRoot();
    var item = document.createElement("div");
    item.className = "toast toast-" + (type || "info");
    item.innerHTML = '<strong>' + (type === "error" ? "Action needed" : "Successful") + '</strong><span>' + escapeHtml(message) + "</span>";
    root.appendChild(item);
    window.setTimeout(function () {
      item.classList.add("is-leaving");
      window.setTimeout(function () {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      }, 220);
    }, 2600);
  }

  function feedback(id, message, type) {
    if ($(id)) {
      $(id).textContent = message;
    }
    if (type === "success" || type === "error") {
      toast(message, type);
    }
  }

  function logVoucherChange(moduleName, changeText) {
    var logs = read(STORE.logs, []).slice();
    logs.unshift({
      id: "voucher-log-" + Date.now(),
      change: changeText,
      module: moduleName,
      actor: CURRENT_ACTOR,
      name: CURRENT_NAME,
      changedAt: new Date().toISOString()
    });
    write(STORE.logs, logs);
  }

  function attachMoneyFormatters(scope) {
    scope.querySelectorAll("[data-money-input]").forEach(function (input) {
      if (input.dataset.boundMoney === "true") {
        return;
      }
      input.dataset.boundMoney = "true";
      input.addEventListener("input", function () {
        input.value = formatMoneyInputValue(input.value);
        updateVoucherSummary();
      });
    });
  }

  function setFieldValue(id, value) {
    if ($(id)) {
      $(id).value = value || "";
    }
  }

  function getFieldValue(id) {
    return $(id) ? $(id).value.trim() : "";
  }

  function renderDocumentList() {
    if (!$("pv-document-list")) {
      return;
    }
    if (!uploadedDocumentNames.length) {
      $("pv-document-list").innerHTML = '<span class="voucher-document-empty">No documents selected.</span>';
      return;
    }
    $("pv-document-list").innerHTML = uploadedDocumentNames.map(function (name) {
      return '<span class="voucher-document-pill">' + escapeHtml(name) + "</span>";
    }).join("");
  }

  function bindDocumentInput(existingNames) {
    uploadedDocumentNames = (existingNames || []).slice();
    renderDocumentList();
    if ($("pv-supporting-documents")) {
      $("pv-supporting-documents").addEventListener("change", function (event) {
        uploadedDocumentNames = Array.from(event.target.files || []).map(function (file) { return file.name; });
        renderDocumentList();
      });
    }
  }

  function addPayToRow(entry, locked) {
    var row = document.createElement("tr");
    var dataRow = normalizePayToEntry(entry || {});
    row.className = "voucher-payto-row";
    row.setAttribute("data-payto-id", dataRow.id);
    row.innerHTML =
      '<td><input data-payto-name type="text" value="' + escapeHtml(dataRow.name) + '" placeholder="Pay to name"' + (locked ? " disabled" : "") + "></td>" +
      '<td><input data-payto-description type="text" value="' + escapeHtml(dataRow.description) + '" placeholder="Description"' + (locked ? " disabled" : "") + "></td>" +
      '<td class="voucher-payto-action">' + (locked ? '<span class="status-pill info">Locked</span>' : '<button class="button slim" type="button" data-remove-payto>Remove</button>') + "</td>";
    $("pv-payto-body").appendChild(row);

    if (!locked) {
      row.querySelector("[data-remove-payto]").addEventListener("click", function () {
        if (row.parentNode) {
          row.parentNode.removeChild(row);
          if (!document.querySelector(".voucher-payto-row")) {
            addPayToRow();
          }
        }
      });
    }
  }

  function renderPayToRows(entries, locked) {
    if (!$("pv-payto-body")) {
      return;
    }
    $("pv-payto-body").innerHTML = "";
    (entries && entries.length ? entries : [{}]).forEach(function (entry) {
      addPayToRow(entry, locked);
    });
  }

  function collectPayToRows() {
    return Array.from(document.querySelectorAll(".voucher-payto-row")).map(function (row) {
      return normalizePayToEntry({
        id: row.getAttribute("data-payto-id"),
        name: row.querySelector("[data-payto-name]").value.trim(),
        description: row.querySelector("[data-payto-description]").value.trim()
      });
    }).filter(function (entry) {
      return entry.name || entry.description;
    });
  }

  function getEconomicCodeOptions(categoryId) {
    return data().items.filter(function (item) { return item.categoryId === categoryId; });
  }

  function setCardMode(card, mode) {
    var isAdvanced = mode === "advanced";
    card.setAttribute("data-mode", mode);
    card.querySelector(".classification-fields").hidden = isAdvanced;
    card.querySelector(".advanced-fields").hidden = !isAdvanced;
    card.querySelector("[data-classification-checked]").disabled = true;
    card.querySelector("[data-classification-passed]").disabled = true;
    if (isAdvanced) {
      card.querySelector("[data-advanced-department]").value = "Advanced";
      card.querySelector("[data-advanced-economic-code]").value = "Advanced";
    }
    updateVoucherSummary();
  }

  function syncClassificationOptions(card, classification) {
    var categories = data().categories;
    var categoryField = card.querySelector("[data-classification-category]");
    var itemField = card.querySelector("[data-classification-item]");
    categoryField.innerHTML = optionList(categories, classification.categoryId, "Select category");
    itemField.innerHTML = optionList(getEconomicCodeOptions(classification.categoryId).map(function (item) {
      return { id: item.id, name: item.code + " - " + item.name };
    }), classification.itemId, "Select economic code");
  }

  function buildClassificationCard(entry, locked) {
    var classification = normalizeClassification(entry || {});
    var card = document.createElement("section");
    card.className = "voucher-classification-card";
    card.setAttribute("data-classification-id", classification.id);
    card.innerHTML =
      '<div class="voucher-classification-head">' +
      '<div><h4>Entry</h4><p>Saved as a ' + escapeHtml(classification.mode === "advanced" ? "advanced" : "classification") + ' entry.</p></div>' +
      '<span class="voucher-entry-type-pill">' + escapeHtml(classification.mode === "advanced" ? "Advanced" : "Classification") + '</span>' +
      (locked ? '<span class="status-pill info">Locked</span>' : '<button class="button slim" type="button" data-remove-classification>Remove</button>') +
      "</div>" +
      '<div class="voucher-card-body classification-fields">' +
      '<div class="voucher-section-grid three">' +
      '<label class="field"><span>Department</span><select data-classification-department' + (locked ? " disabled" : "") + '></select></label>' +
      '<label class="field"><span>Category</span><select data-classification-category' + (locked ? " disabled" : "") + '></select></label>' +
      '<label class="field"><span>Economic Code</span><select data-classification-item' + (locked ? " disabled" : "") + '></select></label>' +
      '<label class="field full"><span>General Description</span><textarea data-classification-description' + (locked ? " disabled" : "") + ">" + escapeHtml(classification.generalDescription) + '</textarea></label>' +
      '<label class="field"><span>Checked By</span><input data-classification-checked type="text" value="' + escapeHtml(classification.checkedBy) + '" disabled></label>' +
      '<label class="field"><span>Passed By</span><input data-classification-passed type="text" value="' + escapeHtml(classification.passedBy) + '" disabled></label>' +
      '<label class="field"><span>Amount</span><input data-classification-amount data-money-input type="text" value="' + (classification.amount ? digits(classification.amount) : "") + '"' + (locked ? " disabled" : "") + "></label>" +
      "</div>" +
      "</div>" +
      '<div class="voucher-card-body advanced-fields" hidden>' +
      '<div class="voucher-section-grid three">' +
      '<label class="field"><span>Department</span><input data-advanced-department type="text" value="Advanced" disabled></label>' +
      '<label class="field"><span>Category</span><select data-advanced-user' + (locked ? " disabled" : "") + '></select></label>' +
      '<label class="field"><span>Economic Code</span><input data-advanced-economic-code type="text" value="Advanced" disabled></label>' +
      '<label class="field full"><span>General Description</span><textarea data-advanced-description' + (locked ? " disabled" : "") + ">" + escapeHtml(classification.generalDescription) + '</textarea></label>' +
      '<label class="field"><span>Checked By</span><input type="text" value="' + escapeHtml(classification.checkedBy) + '" disabled></label>' +
      '<label class="field"><span>Passed By</span><input type="text" value="' + escapeHtml(classification.passedBy) + '" disabled></label>' +
      '<label class="field"><span>Amount</span><input data-advanced-amount data-money-input type="text" value="' + (classification.amount ? digits(classification.amount) : "") + '"' + (locked ? " disabled" : "") + "></label>" +
      "</div>" +
      "</div>";

    card.querySelector("[data-classification-department]").innerHTML = optionList(data().departments, classification.departmentId, "Select department");
    syncClassificationOptions(card, classification);
    card.querySelector("[data-advanced-user]").innerHTML = optionList(SYSTEM_USERS, classification.advancedUser, "Select user");

    if (!locked) {
      card.querySelector("[data-remove-classification]").addEventListener("click", function () {
        card.remove();
        if (!document.querySelector(".voucher-classification-card")) {
          addClassificationCard(null, false, currentEntryMode);
        }
        updateVoucherSummary();
      });

      card.querySelector("[data-classification-category]").addEventListener("change", function () {
        syncClassificationOptions(card, {
          categoryId: card.querySelector("[data-classification-category]").value,
          itemId: ""
        });
        updateVoucherSummary();
      });

      card.querySelectorAll("input, textarea, select").forEach(function (field) {
        field.addEventListener("input", updateVoucherSummary);
        field.addEventListener("change", updateVoucherSummary);
      });
    }

    attachMoneyFormatters(card);
    setCardMode(card, classification.mode);
    return card;
  }

  function addClassificationCard(entry, locked, mode) {
    var nextEntry = entry ? entry : { mode: mode || currentEntryMode };
    if (!$("pv-classification-list")) {
      return;
    }
    $("pv-classification-list").appendChild(buildClassificationCard(nextEntry, locked));
    updateVoucherSummary();
  }

  function renderClassificationCards(entries, locked) {
    if (!$("pv-classification-list")) {
      return;
    }
    $("pv-classification-list").innerHTML = "";
    (entries && entries.length ? entries : [{}]).forEach(function (entry) {
      addClassificationCard(entry, locked);
    });
  }

  function collectClassifications() {
    return Array.from(document.querySelectorAll(".voucher-classification-card")).map(function (card) {
      var mode = card.getAttribute("data-mode") || "classification";
      if (mode === "advanced") {
        return normalizeClassification({
          id: card.getAttribute("data-classification-id"),
          mode: "advanced",
          departmentId: "advanced",
          categoryId: "",
          itemId: "",
          advancedUser: card.querySelector("[data-advanced-user]").value,
          generalDescription: card.querySelector("[data-advanced-description]").value.trim(),
          checkedBy: "",
          passedBy: "",
          amount: parseMoney(card.querySelector("[data-advanced-amount]").value)
        });
      }
      return normalizeClassification({
        id: card.getAttribute("data-classification-id"),
        mode: "classification",
        departmentId: card.querySelector("[data-classification-department]").value,
        categoryId: card.querySelector("[data-classification-category]").value,
        itemId: card.querySelector("[data-classification-item]").value,
        advancedUser: "",
        generalDescription: card.querySelector("[data-classification-description]").value.trim(),
        checkedBy: "",
        passedBy: "",
        amount: parseMoney(card.querySelector("[data-classification-amount]").value)
      });
    }).filter(function (item) {
      return item.generalDescription || item.amount || item.departmentId || item.categoryId || item.itemId || item.advancedUser;
    });
  }

  function updateVoucherSummary() {
    var classifications = collectClassifications();
    var total = classifications.reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0);
    if ($("pv-current-classifications")) {
      $("pv-current-classifications").textContent = String(classifications.length);
    }
    if ($("pv-current-total")) {
      $("pv-current-total").textContent = total ? digits(total) : "-";
    }
    if ($("pv-summary-total")) {
      $("pv-summary-total").textContent = total ? digits(total) : "0";
    }
  }

  function setCurrentEntryMode(mode) {
    currentEntryMode = mode === "advanced" ? "advanced" : "classification";
    document.querySelectorAll("[data-entry-mode]").forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-entry-mode") === currentEntryMode);
    });
  }

  function ensureEntryCardsForMode(mode) {
    if (!document.querySelector(".voucher-classification-card")) {
      addClassificationCard(null, false, mode);
    }
  }

  function confirmEntryModeSwitch(nextMode) {
    var targetMode = nextMode === "advanced" ? "advanced" : "classification";
    var losingMode = targetMode === "advanced" ? "classification" : "advanced";
    var entries = collectClassifications();
    var entriesToRemove = entries.filter(function (entry) {
      return entry.mode === losingMode;
    });

    if (!entriesToRemove.length) {
      setCurrentEntryMode(targetMode);
      ensureEntryCardsForMode(targetMode);
      return;
    }

    var hasDataToLose = entriesToRemove.some(function (entry) {
      return entry.generalDescription ||
        entry.amount ||
        entry.departmentId ||
        entry.categoryId ||
        entry.itemId ||
        entry.advancedUser;
    });

    if (!hasDataToLose) {
      setCurrentEntryMode(targetMode);
      ensureEntryCardsForMode(targetMode);
      return;
    }

    var proceed = window.confirm(
      "Are you sure you want to switch to " +
      (targetMode === "advanced" ? "Advanced" : "Classification") +
      "? You will lose your " +
      (losingMode === "advanced" ? "Advanced" : "Classification") +
      " data on this form."
    );

    if (!proceed) {
      setCurrentEntryMode(currentEntryMode);
      return;
    }

    renderClassificationCards(entries.filter(function (entry) {
      return entry.mode === targetMode;
    }), false);
    setCurrentEntryMode(targetMode);
    ensureEntryCardsForMode(targetMode);
    updateVoucherSummary();
    feedback("pv-manage-feedback", (losingMode === "advanced" ? "Advanced" : "Classification") + " entries removed. You are now in " + (targetMode === "advanced" ? "Advanced" : "Classification") + " mode.", "success");
  }

  function populateVoucherForm(voucher) {
    if ($("pv-instance-context")) {
      $("pv-instance-context").textContent = voucher.stateName + " / " + voucher.localGovernmentName;
    }
    setFieldValue("pv-voucher-number", voucher.voucherNumber);
    setFieldValue("pv-voucher-date", voucher.voucherDate);
    renderPayToRows(voucher.payToEntries, voucher.status !== "Draft");
    renderClassificationCards(voucher.classifications, voucher.status !== "Draft");
    bindDocumentInput(voucher.supportingDocuments);
    updateVoucherSummary();
  }

  function getFormVoucher(voucherId, existing) {
    var classifications = collectClassifications();
    var totalAmount = classifications.reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0);
    return normalizeVoucher({
      id: voucherId || (existing && existing.id) || "pv-" + slug(getFieldValue("pv-voucher-number") || Date.now()),
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      voucherNumber: getFieldValue("pv-voucher-number"),
      voucherDate: getFieldValue("pv-voucher-date") || new Date().toISOString().slice(0, 10),
      payToEntries: collectPayToRows(),
      classifications: classifications,
      supportingDocuments: uploadedDocumentNames.slice(),
      totalAmount: totalAmount,
      status: existing ? existing.status : "Draft",
      rejectionNote: existing ? existing.rejectionNote : "",
      createdAt: existing ? existing.createdAt : "",
      checkedAt: existing ? existing.checkedAt : "",
      passedAt: existing ? existing.passedAt : "",
      rejectedAt: existing ? existing.rejectedAt : "",
      createdBy: existing ? existing.createdBy : "",
      checkedByWorkflow: existing ? existing.checkedByWorkflow : "",
      passedByWorkflow: existing ? existing.passedByWorkflow : ""
    });
  }

  function setVoucherFormLocked(locked) {
    if (!$("pv-form-shell")) {
      return;
    }
    $("pv-form-shell").querySelectorAll("input, textarea, select, button").forEach(function (field) {
      if (field.id === "save-pv-draft" || field.id === "submit-pv-checking" || field.id === "cancel-pv-edit") {
        return;
      }
      field.disabled = locked;
    });
  }

  function setPaymentVoucherMode(voucher) {
    var status = voucher ? voucher.status : "Draft";
    var locked = voucher && voucher.status !== "Draft";
    var statusCopy = "Draft vouchers remain editable until they are submitted for checking.";
    if (status === "Checking") {
      statusCopy = "This voucher is in checking and is locked until the checker acts.";
    } else if (status === "Passing") {
      statusCopy = "This voucher has moved to passing and remains locked.";
    } else if (status === "Passed") {
      statusCopy = "This voucher has passed and is now registered.";
    } else if (voucher && voucher.rejectionNote) {
      statusCopy = "Rejection note: " + voucher.rejectionNote;
    }

    applyStatusPill("pv-status-pill", status);
    if ($("pv-current-status")) {
      $("pv-current-status").textContent = status;
    }
    if ($("pv-current-number")) {
      $("pv-current-number").textContent = voucher && voucher.voucherNumber ? voucher.voucherNumber : "New draft";
    }
    if ($("pv-manage-feedback")) {
      $("pv-manage-feedback").textContent = statusCopy;
    }
    if ($("pv-rejection-banner")) {
      $("pv-rejection-banner").hidden = !(voucher && voucher.rejectionNote);
      if (voucher && voucher.rejectionNote) {
        $("pv-rejection-banner").textContent = "Rejection note: " + voucher.rejectionNote;
      }
    }
    if ($("save-pv-draft")) {
      $("save-pv-draft").style.display = locked ? "none" : "inline-flex";
    }
    if ($("submit-pv-checking")) {
      $("submit-pv-checking").style.display = locked ? "none" : "inline-flex";
    }
    setVoucherFormLocked(Boolean(locked));
    updateVoucherSummary();
  }

  function validateSubmission(voucher) {
    var validPayTo = voucher.payToEntries.some(function (entry) { return entry.name && entry.description; });
    var validClassification = voucher.classifications.some(function (entry) {
      if (entry.mode === "advanced") {
        return entry.advancedUser && entry.generalDescription && entry.amount;
      }
      return entry.departmentId && entry.categoryId && entry.itemId && entry.generalDescription && entry.amount;
    });
    if (!voucher.voucherNumber) {
      return "Enter voucher number before submission.";
    }
    if (!validPayTo) {
      return "Add at least one pay-to row with name and description.";
    }
    if (!validClassification) {
      return "Add at least one complete classification or advanced entry with amount.";
    }
    return "";
  }

  function classificationLabel(entry) {
    if (entry.mode === "advanced") {
      return entry.advancedUser || "-";
    }
    var item = byId(data().items, entry.itemId);
    return item ? item.code + " - " + item.name : "-";
  }

  function renderPayToPreview(voucher) {
    var rows = voucher.payToEntries.length
      ? voucher.payToEntries.map(function (entry) {
          return "<tr><td>" + escapeHtml(entry.name || "-") + "</td><td>" + escapeHtml(entry.description || "-") + "</td></tr>";
        }).join("")
      : '<tr><td colspan="2">No pay-to entries captured.</td></tr>';
    return '' +
      '<section class="voucher-paper-section"><h3>Pay To</h3>' +
      '<div class="voucher-paper-table-wrap"><table class="data-table voucher-paper-table"><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      "</section>";
  }

  function renderClassificationPreview(voucher) {
    if (!voucher.classifications.length) {
      return '<div class="voucher-empty-state"><strong>No classification captured</strong><span>This voucher does not have any saved entry yet.</span></div>';
    }
    return voucher.classifications.map(function (entry, index) {
      var department = entry.mode === "advanced" ? "Advanced" : ((byId(data().departments, entry.departmentId) || {}).name || "-");
      var category = entry.mode === "advanced" ? (entry.advancedUser || "-") : ((byId(data().categories, entry.categoryId) || {}).name || "-");
      return '' +
        '<section class="voucher-paper-section">' +
        '<h3>Entry ' + (index + 1) + " (" + escapeHtml(entry.mode === "advanced" ? "Advanced" : "Classification") + ')</h3>' +
        '<div class="voucher-paper-grid three">' +
        '<div><span>Department</span><strong>' + escapeHtml(department) + '</strong></div>' +
        '<div><span>Category</span><strong>' + escapeHtml(category) + '</strong></div>' +
        '<div><span>Economic Code</span><strong>' + escapeHtml(entry.mode === "advanced" ? "Advanced" : classificationLabel(entry)) + '</strong></div>' +
        '<div><span>General Description</span><strong>' + escapeHtml(entry.generalDescription || "-") + '</strong></div>' +
        '<div><span>Checked By</span><strong>-</strong></div>' +
        '<div><span>Passed By</span><strong>-</strong></div>' +
        '<div><span>Amount</span><strong>' + displayAmount(entry.amount) + "</strong></div>" +
        "</div></section>";
    }).join("");
  }

  function renderVoucherPreview(voucher) {
    var documents = voucher.supportingDocuments.length
      ? voucher.supportingDocuments.map(function (name) {
          return '<span class="voucher-document-pill">' + escapeHtml(name) + "</span>";
        }).join("")
      : '<span class="voucher-document-empty">No documents attached.</span>';

    return '' +
      '<article class="voucher-paper">' +
      '<div class="voucher-paper-head">' +
      '<div><p class="kicker">Voucher</p><h2>Payment Voucher</h2><p>' + escapeHtml(voucher.stateName + " / " + voucher.localGovernmentName) + "</p></div>" +
      '<div class="voucher-paper-status">' + statusPill(voucher.status) + "</div>" +
      "</div>" +
      '<div class="voucher-paper-meta">' +
      '<div><span>Voucher Number</span><strong>' + escapeHtml(voucher.voucherNumber || "-") + "</strong></div>" +
      '<div><span>Voucher Date</span><strong>' + escapeHtml(voucher.voucherDate || "-") + "</strong></div>" +
      '<div><span>Total Amount</span><strong>' + displayAmount(voucher.totalAmount) + "</strong></div>" +
      '<div><span>Entries</span><strong>' + voucher.classifications.length + "</strong></div>" +
      "</div>" +
      renderPayToPreview(voucher) +
      renderClassificationPreview(voucher) +
      '<section class="voucher-paper-section"><h3>Supporting Documents</h3><div class="voucher-document-list">' + documents + "</div></section>" +
      '<section class="voucher-paper-section"><h3>Workflow</h3><div class="voucher-paper-grid three"><div><span>Created By</span><strong>' + escapeHtml(voucher.createdBy || "-") + '</strong></div><div><span>Checked By</span><strong>' + escapeHtml(voucher.checkedByWorkflow || "-") + '</strong></div><div><span>Passed By</span><strong>' + escapeHtml(voucher.passedByWorkflow || "-") + '</strong></div><div><span>Created At</span><strong>' + stamp(voucher.createdAt) + '</strong></div><div><span>Checked At</span><strong>' + stamp(voucher.checkedAt) + '</strong></div><div><span>Passed At</span><strong>' + stamp(voucher.passedAt) + "</strong></div></div></section>" +
      (voucher.rejectionNote ? '<section class="voucher-paper-section voucher-rejection-note"><h3>Rejection Note</h3><p>' + escapeHtml(voucher.rejectionNote) + "</p></section>" : "") +
      "</article>";
  }

  function updateViewPreview(voucherId) {
    var voucher = byId(getVouchers(), voucherId || viewVoucherId);
    if (!voucher) {
      if ($("pv-view-preview")) {
        $("pv-view-preview").innerHTML = '<div class="voucher-empty-state"><strong>No voucher selected</strong><span>Select any voucher row to inspect the read-only layout.</span></div>';
      }
      return;
    }
    viewVoucherId = voucher.id;
    if ($("pv-view-preview")) {
      $("pv-view-preview").innerHTML = renderVoucherPreview(voucher);
    }
  }

  function renderPaymentVoucherTable() {
    var vouchers = getVouchers();
    registerTableRows("pv-table-body", vouchers.map(function (voucher) {
      return {
        markup: '<tr><td>' + escapeHtml(voucher.voucherNumber || "-") + '</td><td>' + escapeHtml(voucher.voucherDate || "-") + '</td><td>' + escapeHtml((voucher.payToEntries[0] || {}).name || "-") + '</td><td>' + voucher.classifications.length + '</td><td>' + digits(voucher.totalAmount) + '</td><td>' + statusPill(voucher.status) + '</td><td><div class="table-inline-actions"><button class="button slim" type="button" data-pv-view="' + escapeHtml(voucher.id) + '">View</button><a class="button slim" href="payments-voucher.html?edit=' + escapeHtml(voucher.id) + '&tab=manage">Open</a></div></td></tr>',
        searchText: [voucher.voucherNumber, voucher.voucherDate, (voucher.payToEntries[0] || {}).name || "", voucher.status].join(" ")
      };
    }), '<tr><td colspan="7">No payment vouchers saved yet.</td></tr>', { pageSize: 5, countId: "pv-record-count" });

    document.querySelectorAll("[data-pv-view]").forEach(function (button) {
      button.addEventListener("click", function () {
        updateViewPreview(button.getAttribute("data-pv-view"));
      });
    });

    if (!viewVoucherId && vouchers.length) {
      updateViewPreview(vouchers[0].id);
    } else {
      updateViewPreview(viewVoucherId);
    }
  }

  function renderPaymentVoucherManage() {
    var vouchers = getVouchers();
    var query = new URLSearchParams(window.location.search);
    var editId = query.get("edit");
    var existing = editId ? byId(vouchers, editId) : null;

    attachMoneyFormatters(document);

    if (existing) {
      populateVoucherForm(existing);
      setPaymentVoucherMode(existing);
    } else {
      if ($("pv-instance-context")) {
        $("pv-instance-context").textContent = STATE_NAME + " / " + LOCAL_GOVERNMENT_NAME;
      }
      setFieldValue("pv-voucher-date", new Date().toISOString().slice(0, 10));
      renderPayToRows([], false);
      renderClassificationCards([], false);
      bindDocumentInput([]);
      setPaymentVoucherMode(null);
    }

    setCurrentEntryMode("classification");

    if ($("add-pv-payto")) {
      $("add-pv-payto").addEventListener("click", function () {
        addPayToRow();
      });
    }
    document.querySelectorAll("[data-entry-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        confirmEntryModeSwitch(button.getAttribute("data-entry-mode"));
      });
    });
    if ($("add-pv-classification")) {
      $("add-pv-classification").addEventListener("click", function () {
        addClassificationCard(null, false, currentEntryMode);
      });
    }

    $("save-pv-draft").addEventListener("click", function () {
      var allVouchers = getVouchers();
      var voucher = getFormVoucher(existing ? existing.id : "", existing);
      var index = allVouchers.findIndex(function (entry) { return entry.id === voucher.id; });

      voucher.status = "Draft";
      voucher.rejectionNote = existing ? existing.rejectionNote : "";
      voucher.createdAt = existing ? existing.createdAt : new Date().toISOString();
      voucher.createdBy = existing ? existing.createdBy : CURRENT_NAME;
      voucher.checkedAt = existing ? existing.checkedAt : "";
      voucher.passedAt = existing ? existing.passedAt : "";
      voucher.rejectedAt = existing ? existing.rejectedAt : "";
      voucher.checkedByWorkflow = existing ? existing.checkedByWorkflow : "";
      voucher.passedByWorkflow = existing ? existing.passedByWorkflow : "";

      if (index > -1) {
        allVouchers[index] = voucher;
        logVoucherChange("Payments (PV)", "Updated payment voucher draft " + (voucher.voucherNumber || "without number") + ".");
      } else {
        allVouchers.unshift(voucher);
        logVoucherChange("Payments (PV)", "Created payment voucher draft " + (voucher.voucherNumber || "without number") + ".");
      }

      write(STORE.vouchers, allVouchers);
      setPaymentVoucherMode(voucher);
      feedback("pv-manage-feedback", "Payment voucher draft saved.", "success");
      if (!existing) {
        window.location.href = "payments-voucher.html?edit=" + voucher.id + "&tab=manage";
      }
    });

    $("submit-pv-checking").addEventListener("click", function () {
      var allVouchers = getVouchers();
      var voucher = getFormVoucher(existing ? existing.id : "", existing);
      var index = allVouchers.findIndex(function (entry) { return entry.id === voucher.id; });
      var validationMessage = validateSubmission(voucher);

      if (validationMessage) {
        feedback("pv-manage-feedback", validationMessage, "error");
        return;
      }

      voucher.status = "Checking";
      voucher.createdAt = existing ? existing.createdAt : new Date().toISOString();
      voucher.createdBy = existing ? existing.createdBy : CURRENT_NAME;
      voucher.checkedAt = "";
      voucher.passedAt = "";
      voucher.rejectedAt = "";
      voucher.checkedByWorkflow = "";
      voucher.passedByWorkflow = "";
      voucher.rejectionNote = "";

      if (index > -1) {
        allVouchers[index] = voucher;
      } else {
        allVouchers.unshift(voucher);
      }

      write(STORE.vouchers, allVouchers);
      logVoucherChange("Payments (PV)", "Submitted payment voucher " + voucher.voucherNumber + " for checking.");
      window.location.href = "approve-voucher.html?voucher=" + voucher.id;
    });
  }

  function renderWorkflowQueue(config) {
    var vouchers = getVouchers();
    var queue = vouchers.filter(function (voucher) { return voucher.status === config.status; });
    var selectedId = config.selectedGetter();
    var selected = byId(vouchers, selectedId) || queue[0];

    registerTableRows(config.bodyId, queue.map(function (voucher) {
      return {
        markup: '<tr class="' + (voucher.id === (selected && selected.id) ? "voucher-selected-row" : "") + '"><td>' + escapeHtml(voucher.voucherNumber || "-") + '</td><td>' + escapeHtml(voucher.voucherDate || "-") + '</td><td>' + escapeHtml((voucher.payToEntries[0] || {}).name || "-") + '</td><td>' + voucher.classifications.length + '</td><td>' + digits(voucher.totalAmount) + '</td><td>' + statusPill(voucher.status) + '</td><td>' + escapeHtml(voucher.createdBy || "-") + '</td><td><button class="button slim" type="button" data-review-row="' + escapeHtml(voucher.id) + '">Review</button></td></tr>',
        searchText: [voucher.voucherNumber, voucher.voucherDate, (voucher.payToEntries[0] || {}).name || "", voucher.createdBy].join(" ")
      };
    }), '<tr><td colspan="8">No vouchers in this queue.</td></tr>', { pageSize: 5, countId: config.countId });

    document.querySelectorAll("[data-review-row]").forEach(function (button) {
      button.addEventListener("click", function () {
        config.selectedSetter(button.getAttribute("data-review-row"));
        renderWorkflowQueue(config);
      });
    });

    if ($(config.previewId)) {
      if (selected) {
        $(config.previewId).innerHTML = renderVoucherPreview(selected);
        $(config.primaryButtonId).disabled = false;
        $(config.rejectButtonId).disabled = false;
        $(config.feedbackId).textContent = config.reviewCopy.replace("{voucher}", selected.voucherNumber || "selected voucher");
      } else {
        $(config.previewId).innerHTML = '<div class="voucher-empty-state"><strong>No voucher in queue</strong><span>Matching vouchers will appear here for review.</span></div>';
        $(config.primaryButtonId).disabled = true;
        $(config.rejectButtonId).disabled = true;
        $(config.feedbackId).textContent = config.emptyCopy;
      }
    }
  }

  function rejectVoucherToDraft(voucherId, note, moduleName) {
    var vouchers = getVouchers();
    var voucher = byId(vouchers, voucherId);
    if (!voucher) {
      return false;
    }
    voucher.status = "Draft";
    voucher.rejectedAt = new Date().toISOString();
    voucher.rejectionNote = note;
    voucher.checkedAt = "";
    voucher.passedAt = "";
    voucher.checkedByWorkflow = "";
    voucher.passedByWorkflow = "";
    write(STORE.vouchers, vouchers);
    logVoucherChange(moduleName, "Rejected payment voucher " + voucher.voucherNumber + " back to draft.");
    return voucher;
  }

  function renderCheckingPage() {
    var query = new URLSearchParams(window.location.search);
    checkingVoucherId = query.get("voucher") || "";
    var config = {
      status: "Checking",
      bodyId: "pv-checking-body",
      countId: "pv-checking-count",
      previewId: "pv-checking-preview",
      feedbackId: "pv-checking-feedback",
      primaryButtonId: "submit-pv-passing-btn",
      rejectButtonId: "reject-checking-btn",
      selectedGetter: function () { return checkingVoucherId; },
      selectedSetter: function (value) { checkingVoucherId = value; },
      reviewCopy: "Reviewing {voucher} for checking action.",
      emptyCopy: "No voucher awaiting checking."
    };
    renderWorkflowQueue(config);

    $("submit-pv-passing-btn").addEventListener("click", function () {
      var vouchers = getVouchers();
      var voucher = byId(vouchers, checkingVoucherId);
      if (!voucher) {
        feedback("pv-checking-feedback", "Select a voucher first.", "error");
        return;
      }
      voucher.status = "Passing";
      voucher.checkedAt = new Date().toISOString();
      voucher.checkedByWorkflow = CURRENT_NAME;
      voucher.rejectionNote = "";
      write(STORE.vouchers, vouchers);
      logVoucherChange("Checking", "Submitted payment voucher " + voucher.voucherNumber + " for passing.");
      feedback("pv-checking-feedback", voucher.voucherNumber + " moved to passing.", "success");
      checkingVoucherId = "";
      $("pv-checking-note").value = "";
      renderWorkflowQueue(config);
    });

    $("reject-checking-btn").addEventListener("click", function () {
      var note = getFieldValue("pv-checking-note");
      if (!note) {
        feedback("pv-checking-feedback", "Enter a rejection note before returning the voucher to draft.", "error");
        return;
      }
      var voucher = rejectVoucherToDraft(checkingVoucherId, note, "Checking");
      if (!voucher) {
        feedback("pv-checking-feedback", "Select a voucher first.", "error");
        return;
      }
      feedback("pv-checking-feedback", voucher.voucherNumber + " returned to draft.", "success");
      checkingVoucherId = "";
      $("pv-checking-note").value = "";
      renderWorkflowQueue(config);
    });
  }

  function renderPassingPage() {
    var query = new URLSearchParams(window.location.search);
    passingVoucherId = query.get("voucher") || "";
    var config = {
      status: "Passing",
      bodyId: "pv-passing-body",
      countId: "pv-passing-count",
      previewId: "pv-passing-preview",
      feedbackId: "pv-passing-feedback",
      primaryButtonId: "mark-pv-passed-btn",
      rejectButtonId: "reject-passing-btn",
      selectedGetter: function () { return passingVoucherId; },
      selectedSetter: function (value) { passingVoucherId = value; },
      reviewCopy: "Reviewing {voucher} for passing action.",
      emptyCopy: "No voucher awaiting passing."
    };
    renderWorkflowQueue(config);

    $("mark-pv-passed-btn").addEventListener("click", function () {
      var vouchers = getVouchers();
      var voucher = byId(vouchers, passingVoucherId);
      if (!voucher) {
        feedback("pv-passing-feedback", "Select a voucher first.", "error");
        return;
      }
      voucher.status = "Passed";
      voucher.passedAt = new Date().toISOString();
      voucher.passedByWorkflow = CURRENT_NAME;
      voucher.rejectionNote = "";
      write(STORE.vouchers, vouchers);
      logVoucherChange("Passing", "Passed payment voucher " + voucher.voucherNumber + ".");
      feedback("pv-passing-feedback", voucher.voucherNumber + " marked as passed.", "success");
      passingVoucherId = "";
      $("pv-passing-note").value = "";
      renderWorkflowQueue(config);
    });

    $("reject-passing-btn").addEventListener("click", function () {
      var note = getFieldValue("pv-passing-note");
      if (!note) {
        feedback("pv-passing-feedback", "Enter a rejection note before returning the voucher to draft.", "error");
        return;
      }
      var voucher = rejectVoucherToDraft(passingVoucherId, note, "Passing");
      if (!voucher) {
        feedback("pv-passing-feedback", "Select a voucher first.", "error");
        return;
      }
      feedback("pv-passing-feedback", voucher.voucherNumber + " returned to draft.", "success");
      passingVoucherId = "";
      $("pv-passing-note").value = "";
      renderWorkflowQueue(config);
    });
  }

  function initModuleTabs(defaultTarget) {
    var scope = document.querySelector(".main-view");
    var tabs = scope ? scope.querySelectorAll(".module-tab") : [];
    if (!tabs.length) {
      return;
    }
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var targetId = tab.getAttribute("data-tab-target");
        scope.querySelectorAll(".module-tab").forEach(function (item) {
          item.classList.toggle("active", item === tab);
        });
        scope.querySelectorAll(".tab-panel").forEach(function (panel) {
          panel.classList.toggle("active", panel.id === targetId);
        });
      });
    });
    if (defaultTarget) {
      tabs.forEach(function (tab) {
        tab.classList.toggle("active", tab.getAttribute("data-tab-target") === defaultTarget);
      });
      scope.querySelectorAll(".tab-panel").forEach(function (panel) {
        panel.classList.toggle("active", panel.id === defaultTarget);
      });
    }
  }

  function renderPaymentsPage() {
    var query = new URLSearchParams(window.location.search);
    initModuleTabs(query.get("tab") === "view" ? "pv-view-panel" : "pv-manage-panel");
    renderPaymentVoucherManage();
    renderPaymentVoucherTable();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if ($("pv-form-shell")) {
      renderPaymentsPage();
    }
    if ($("pv-checking-body")) {
      renderCheckingPage();
    }
    if ($("pv-passing-body")) {
      renderPassingPage();
    }
  });
})();

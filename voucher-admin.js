(function () {
  var STORE = {
    departments: "budget-admin-departments",
    banks: "budget-admin-banks",
    categories: "budget-admin-categories",
    items: "budget-admin-items",
    advances: "voucher-advance-records",
    vouchers: "voucher-payment-records",
    receipts: "voucher-receipt-records",
    logs: "budget-admin-logs"
  };
  var LGA_INSTANCE_KEY = "lga-instance-selection";
  var STATE_INSTANCE_KEY = "lga-state-instance";
  var CURRENT_ACTOR = "Super Admin";
  var CURRENT_NAME = "Tamuno Briggs";
  var ACTIVE_INSTANCE = loadActiveInstance();
  var LOCAL_GOVERNMENT_NAME = ACTIVE_INSTANCE.localGovernmentName;
  var STATE_NAME = ACTIVE_INSTANCE.stateName;
  var TABLE_STATE = {};
  var viewVoucherId = "";
  var viewReceiptId = "";
  var receiptApprovalId = "";
  var checkingVoucherId = "";
  var passingVoucherId = "";
  var checkingRefreshPage = function () {};
  var passingRefreshPage = function () {};
  var receiptApprovalRefreshPage = function () {};
  var receiptRefreshPage = function () {};
  var receiptEntryMode = "classification";
  var selectedAdvanceId = "";
  var checkingPageState = {
    tab: "pending",
    date: "",
    view: "table",
    detailVoucherId: "",
    selected: {
      pending: "",
      checked: "",
      rejected: ""
    }
  };
  var passingPageState = {
    view: "table",
    detailVoucherId: ""
  };
  var receiptPageState = {
    view: "table",
    detailReceiptId: ""
  };
  var receiptApprovalPageState = {
    view: "table",
    detailReceiptId: ""
  };
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

  function loadActiveInstance() {
    var lgaInstance = null;
    var stateInstance = null;

    try {
      lgaInstance = JSON.parse(localStorage.getItem(LGA_INSTANCE_KEY) || "null");
    } catch (error) {
      lgaInstance = null;
    }

    try {
      stateInstance = JSON.parse(localStorage.getItem(STATE_INSTANCE_KEY) || "null");
    } catch (error) {
      stateInstance = null;
    }

    return {
      localGovernmentName: lgaInstance && lgaInstance.lga ? lgaInstance.lga : "Port Harcourt LGA",
      stateName: lgaInstance && lgaInstance.state
        ? lgaInstance.state
        : stateInstance && stateInstance.state
          ? stateInstance.state
          : "Delta State",
      headquarters: stateInstance && stateInstance.headquarters ? stateInstance.headquarters : ""
    };
  }

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
  var seedAdvances = [
    {
      id: "adv-001",
      reference: "ADV-2026-014",
      holderName: "Rivers Builders Ltd",
      departmentId: "dept-works",
      categoryId: "cat-works-roads",
      economicCodeId: "item-road-repairs",
      paymentMethod: "bank-zenith-main",
      purpose: "Road survey and mobilisation",
      originalAmount: 2500000,
      retiredAmount: 750000,
      date: "2026-06-10"
    },
    {
      id: "adv-002",
      reference: "ADV-2026-018",
      holderName: "Health Outreach Team",
      departmentId: "dept-health",
      categoryId: "cat-health-capital",
      economicCodeId: "item-health-equipment",
      paymentMethod: "bank-first-projects",
      purpose: "Clinic equipment logistics",
      originalAmount: 1800000,
      retiredAmount: 400000,
      date: "2026-06-11"
    },
    {
      id: "adv-003",
      reference: "ADV-2026-022",
      holderName: "Sarah Duke",
      departmentId: "dept-education",
      categoryId: "cat-education-grants",
      economicCodeId: "item-school-support",
      paymentMethod: "cash",
      purpose: "School support field visit",
      originalAmount: 950000,
      retiredAmount: 0,
      date: "2026-06-13"
    }
  ];
  var fallbackBanks = [
    { id: "bank-cash", name: "Cash", description: "Cash float handled directly at the treasury desk.", accountName: "Cash on Hand" },
    { id: "bank-zenith-main", name: "Zenith Bank", description: "Primary operations account for statutory collections and daily treasury postings.", accountName: "PHALGA Main Treasury" },
    { id: "bank-first-projects", name: "First Bank", description: "Capital projects account used for infrastructure and intervention disbursements.", accountName: "PHALGA Capital Projects" },
    { id: "bank-uba-salary", name: "UBA", description: "Salary and payroll settlement account for approved staff payments.", accountName: "PHALGA Payroll Services" }
  ];
  var seedVouchers = [
    {
      id: "pv-2026-040",
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      voucherNumber: "PV-2026-040",
      voucherDate: "2026-06-12",
      paymentMethod: "bank-zenith-main",
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
      status: "Passing",
      rejectionNote: "",
      createdAt: "2026-06-12T08:10:00Z",
      checkedAt: "2026-06-12T09:00:00Z",
      passedAt: "",
      rejectedAt: "",
      createdBy: CURRENT_NAME,
      checkedByWorkflow: "Amaka George",
      passedByWorkflow: ""
    },
    {
      id: "pv-2026-041",
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      voucherNumber: "PV-2026-041",
      voucherDate: "2026-06-13",
      paymentMethod: "cash",
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
      paymentMethod: "bank-first-projects",
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
      status: "Rejected",
      rejectionNote: "Return to draft after memo reference mismatch.",
      createdAt: "2026-06-14T08:15:00Z",
      checkedAt: "",
      passedAt: "",
      rejectedAt: "2026-06-14T10:12:00Z",
      createdBy: CURRENT_NAME,
      checkedByWorkflow: "",
      passedByWorkflow: ""
    },
    {
      id: "pv-2026-043",
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      voucherNumber: "PV-2026-043",
      voucherDate: "2026-06-15",
      paymentMethod: "bank-uba-salary",
      payToEntries: [
        { id: "payto-043-1", name: "Riverline Services", description: "Administrative support release" }
      ],
      classifications: [
        {
          id: "class-043-1",
          mode: "classification",
          departmentId: "dept-finance",
          categoryId: "cat-admin-services",
          itemId: "item-health-equipment",
          advancedUser: "",
          generalDescription: "Administrative support funding.",
          checkedBy: "",
          passedBy: "",
          amount: 1800000
        }
      ],
      supportingDocuments: ["support-note.pdf"],
      totalAmount: 1800000,
      status: "Checked",
      rejectionNote: "",
      createdAt: "2026-06-15T08:15:00Z",
      checkedAt: "2026-06-15T09:00:00Z",
      passedAt: "",
      rejectedAt: "",
      createdBy: "Ebiere Lawson",
      checkedByWorkflow: CURRENT_NAME,
      passedByWorkflow: ""
    }
  ];
  var seedReceipts = [
    {
      id: "rov-2026-014",
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      treasuryReceiptVoucherNumber: "TRV-2026-014",
      receiptNo: "RCPT-2026-101",
      departmentId: "dept-finance",
      categoryId: "cat-health-capital",
      economicCodeId: "item-health-equipment",
      paymentMethod: "bank-zenith-main",
      receivedFrom: "Rivers Contractors Ltd",
      amount: 2450000,
      purpose: "Settlement for treasury service revenue and permit fees.",
      cashierSignature: "Tamuno Briggs",
      cashierName: "Tamuno Briggs",
      date: "2026-06-15",
      payerName: "T. Bright",
      witnessName: "Ebiere Lawson",
      status: "Approval",
      createdAt: "2026-06-15T10:00:00Z",
      updatedAt: "2026-06-15T10:00:00Z",
      createdBy: CURRENT_NAME
    },
    {
      id: "rov-2026-015",
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      treasuryReceiptVoucherNumber: "TRV-2026-015",
      receiptNo: "RCPT-2026-102",
      departmentId: "dept-health",
      categoryId: "cat-works-roads",
      economicCodeId: "item-road-repairs",
      paymentMethod: "cash",
      receivedFrom: "Community Health Board",
      amount: 880000,
      purpose: "Cash receipt for health centre support and related fees.",
      cashierSignature: "Amaka George",
      cashierName: "Amaka George",
      date: "2026-06-16",
      payerName: "Community Liaison",
      witnessName: "Sarah Duke",
      status: "Approved",
      createdAt: "2026-06-16T09:30:00Z",
      updatedAt: "2026-06-16T09:30:00Z",
      createdBy: "Amaka George"
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
      banks: read(STORE.banks, fallbackBanks),
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

  function getPaymentMethods() {
    var methods = [{ id: "cash", name: "Cash" }];
    var banks = data().banks || [];
    banks.forEach(function (bank) {
      if (!bank || !bank.id) {
        return;
      }
      if (String(bank.id).toLowerCase() === "bank-cash" || String(bank.name || "").toLowerCase() === "cash") {
        return;
      }
      methods.push({ id: bank.id, name: bank.name });
    });
    return methods;
  }

  function paymentMethodLabel(methodId) {
    var method = getPaymentMethods().find(function (item) { return item.id === methodId; });
    if (method) {
      return method.name;
    }
    if (methodId) {
      var bank = byId(data().banks, methodId);
      return bank ? bank.name : methodId;
    }
    return "-";
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
    } else if (status === "Checked") {
      type = "ok";
    } else if (status === "Rejected") {
      type = "danger";
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
    } else if (status === "Checked") {
      type = "ok";
    } else if (status === "Rejected") {
      type = "danger";
    }
    element.className = "status-pill " + type;
    element.textContent = status;
  }

  function getVouchers() {
    return read(STORE.vouchers, seedVouchers).map(normalizeVoucher).sort(function (left, right) {
      return String(right.voucherDate || "").localeCompare(String(left.voucherDate || ""));
    });
  }

  function getReceipts() {
    return read(STORE.receipts, seedReceipts).map(normalizeReceipt).sort(function (left, right) {
      return String(right.date || "").localeCompare(String(left.date || ""));
    });
  }

  function normalizePayToEntry(raw) {
    return {
      id: raw && raw.id ? raw.id : "payto-" + Date.now(),
      name: raw && raw.name ? raw.name : "",
      description: raw && raw.description ? raw.description : ""
    };
  }

  function normalizeAdvance(raw) {
    var base = raw || {};
    return {
      id: base.id || "adv-" + Date.now(),
      reference: base.reference || "",
      holderName: base.holderName || "",
      departmentId: base.departmentId || "",
      categoryId: base.categoryId || "",
      economicCodeId: base.economicCodeId || "",
      paymentMethod: base.paymentMethod || "cash",
      purpose: base.purpose || "",
      originalAmount: Number(base.originalAmount || 0) || 0,
      retiredAmount: Number(base.retiredAmount || 0) || 0,
      date: base.date || ""
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
      paymentMethod: base.paymentMethod || "cash",
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

  function normalizeReceipt(raw) {
    var base = raw || {};
    return {
      id: base.id || "rov-" + slug(base.treasuryReceiptVoucherNumber || base.receiptNo || Date.now()),
      localGovernmentName: base.localGovernmentName || LOCAL_GOVERNMENT_NAME,
      stateName: base.stateName || STATE_NAME,
      entryMode: base.entryMode === "retireAdvance" ? "retireAdvance" : "classification",
      advanceId: base.advanceId || "",
      advanceReference: base.advanceReference || "",
      advanceHolderName: base.advanceHolderName || "",
      advanceDepartmentId: base.advanceDepartmentId || "",
      advanceCategoryId: base.advanceCategoryId || "",
      advanceEconomicCodeId: base.advanceEconomicCodeId || "",
      advancePaymentMethod: base.advancePaymentMethod || "",
      advancePurpose: base.advancePurpose || "",
      advanceOriginalAmount: Number(base.advanceOriginalAmount || 0) || 0,
      advanceRetiredAmount: Number(base.advanceRetiredAmount || 0) || 0,
      advanceBalance: Number(base.advanceBalance || 0) || 0,
      retirePaymentMethod: base.retirePaymentMethod || "",
      treasuryReceiptVoucherNumber: base.treasuryReceiptVoucherNumber || "",
      receiptNo: base.receiptNo || "",
      departmentId: base.departmentId || "",
      categoryId: base.categoryId || "",
      economicCodeId: base.economicCodeId || "",
      paymentMethod: base.paymentMethod || "cash",
      receivedFrom: base.receivedFrom || "",
      amount: Number(base.amount || 0) || 0,
      purpose: base.purpose || "",
      cashierSignature: base.cashierSignature || "",
      cashierName: base.cashierName || "",
      date: base.date || new Date().toISOString().slice(0, 10),
      payerName: base.payerName || "",
      witnessName: base.witnessName || "",
      status: base.status || "Saved",
      createdAt: base.createdAt || "",
      updatedAt: base.updatedAt || "",
      createdBy: base.createdBy || ""
    };
  }

  function getAdvances() {
    return read(STORE.advances, seedAdvances).map(normalizeAdvance).sort(function (left, right) {
      return String(right.date || "").localeCompare(String(left.date || ""));
    });
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

  function ensureEntryModeModal() {
    var existing = $("pv-entry-mode-modal");
    var overlay;
    var dialog;
    var title;
    var message;
    var cancelButton;
    var confirmButton;

    if (existing) {
      return existing;
    }

    overlay = document.createElement("div");
    overlay.id = "pv-entry-mode-modal";
    overlay.className = "voucher-modal-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="voucher-modal" role="dialog" aria-modal="true" aria-labelledby="pv-entry-mode-title" aria-describedby="pv-entry-mode-message">' +
      '<div class="voucher-modal-hero">' +
      '<div class="voucher-modal-badge">!</div>' +
      '<div>' +
      '<p class="voucher-modal-kicker">Confirmation needed</p>' +
      '<h3 id="pv-entry-mode-title">Switch entry mode?</h3>' +
      '<p id="pv-entry-mode-message"></p>' +
      "</div>" +
      "</div>" +
      '<div class="voucher-modal-actions">' +
      '<button class="button slim" type="button" data-modal-cancel>Cancel</button>' +
      '<button class="button primary slim" type="button" data-modal-confirm>Yes, switch</button>' +
      "</div>" +
      "</div>";

    document.body.appendChild(overlay);
    dialog = overlay.querySelector(".voucher-modal");
    title = overlay.querySelector("#pv-entry-mode-title");
    message = overlay.querySelector("#pv-entry-mode-message");
    cancelButton = overlay.querySelector("[data-modal-cancel]");
    confirmButton = overlay.querySelector("[data-modal-confirm]");

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        hideEntryModeModal(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (!overlay.hidden && event.key === "Escape") {
        hideEntryModeModal(false);
      }
    });

    cancelButton.addEventListener("click", function () {
      hideEntryModeModal(false);
    });
    confirmButton.addEventListener("click", function () {
      hideEntryModeModal(true);
    });

    overlay._modalApi = {
      title: title,
      message: message,
      confirmButton: confirmButton
    };

    return overlay;
  }

  var entryModeModalResolver = null;
  var entryModeModalOpen = false;

  function hideEntryModeModal(confirmed) {
    var modal = $("pv-entry-mode-modal");
    if (modal) {
      modal.hidden = true;
    }
    entryModeModalOpen = false;
    if (entryModeModalResolver) {
      entryModeModalResolver(Boolean(confirmed));
      entryModeModalResolver = null;
    }
  }

  function showEntryModeModal(nextMode) {
    var modal = ensureEntryModeModal();
    var targetMode = nextMode === "advanced" ? "advanced" : "classification";
    var readableTarget = targetMode === "advanced" ? "Advanced" : "Classification";
    var readableSource = currentEntryMode === "advanced" ? "Advanced" : "Classification";
    var messageText = "Any data entered in the current " + readableSource + " entries will be lost. Are you sure you want to switch to " + readableTarget + "?";

    modal._modalApi.title.textContent = "Switch to " + readableTarget + "?";
    modal._modalApi.message.textContent = messageText;
    modal.hidden = false;
    entryModeModalOpen = true;
    modal._modalApi.confirmButton.focus();

    return new Promise(function (resolve) {
      entryModeModalResolver = resolve;
    });
  }

  function confirmEntryModeSwitch(nextMode) {
    var targetMode = nextMode === "advanced" ? "advanced" : "classification";
    var entries = collectClassifications();
    var hasDataToLose = entries.some(function (entry) {
      return entry.generalDescription ||
        entry.amount ||
        entry.departmentId ||
        entry.categoryId ||
        entry.itemId ||
        entry.advancedUser;
    });

    if (targetMode === currentEntryMode) {
      return;
    }

    if (hasDataToLose) {
      if (entryModeModalOpen) {
        return;
      }
      showEntryModeModal(targetMode).then(function (confirmed) {
        if (!confirmed) {
          setCurrentEntryMode(currentEntryMode);
          return;
        }

        if ($("pv-classification-list")) {
          $("pv-classification-list").innerHTML = "";
        }
        setCurrentEntryMode(targetMode);
        addClassificationCard(null, false, targetMode);
        updateVoucherSummary();
        feedback("pv-manage-feedback", "Switched to " + (targetMode === "advanced" ? "Advanced" : "Classification") + " entry mode.", "success");
      });
      return;
    }

    if ($("pv-classification-list")) {
      $("pv-classification-list").innerHTML = "";
    }
    setCurrentEntryMode(targetMode);
    addClassificationCard(null, false, targetMode);
    updateVoucherSummary();
    feedback("pv-manage-feedback", "Switched to " + (targetMode === "advanced" ? "Advanced" : "Classification") + " entry mode.", "success");
  }

  function populateVoucherForm(voucher) {
    if ($("pv-instance-context")) {
      $("pv-instance-context").textContent = voucher.stateName + " / " + voucher.localGovernmentName;
    }
    setFieldValue("pv-voucher-number", voucher.voucherNumber);
    setFieldValue("pv-voucher-date", voucher.voucherDate);
    setFieldValue("pv-payment-method", voucher.paymentMethod || "cash");
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
      paymentMethod: getFieldValue("pv-payment-method") || "cash",
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
    if ($("pv-current-payment-method")) {
      $("pv-current-payment-method").textContent = voucher ? paymentMethodLabel(voucher.paymentMethod) : "Cash";
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

  function renderPaymentMethodOptions(selectedValue) {
    return optionList(getPaymentMethods(), selectedValue || "cash", "Select payment method");
  }

  function renderReceiptDepartmentOptions(selectedValue) {
    return optionList(data().departments, selectedValue, "Select department");
  }

  function renderReceiptCategoryOptions(selectedValue) {
    return optionList(data().categories, selectedValue, "Select category");
  }

  function renderReceiptEconomicCodeOptions(categoryId, selectedValue) {
    var codes = categoryId ? getEconomicCodeOptions(categoryId) : [];
    return optionList(codes.map(function (item) {
      return { id: item.id, name: item.code + " - " + item.name };
    }), selectedValue, categoryId ? "Select economic code" : "Select category first");
  }

  function receiptDepartmentLabel(departmentId) {
    var department = byId(data().departments, departmentId);
    return department ? department.name : "-";
  }

  function receiptCategoryLabel(categoryId) {
    var category = byId(data().categories, categoryId);
    return category ? category.name : "-";
  }

  function receiptEconomicCodeLabel(itemId) {
    var item = byId(data().items, itemId);
    return item ? item.code + " - " + item.name : "-";
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
      '<div><span>Payment Method</span><strong>' + escapeHtml(paymentMethodLabel(voucher.paymentMethod)) + "</strong></div>" +
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

  function getReceiptPreviewMeta(receipt) {
    return '' +
      '<div><span>Treasury No.</span><strong>' + escapeHtml(receipt.treasuryReceiptVoucherNumber || "-") + "</strong></div>" +
      '<div><span>Receipt No.</span><strong>' + escapeHtml(receipt.receiptNo || "-") + "</strong></div>" +
      '<div><span>Date</span><strong>' + escapeHtml(receipt.date || "-") + "</strong></div>" +
      '<div><span>Payment Method</span><strong>' + escapeHtml(paymentMethodLabel(receipt.paymentMethod)) + "</strong></div>" +
      '<div><span>Department</span><strong>' + escapeHtml(receiptDepartmentLabel(receipt.departmentId)) + "</strong></div>" +
      '<div><span>Category</span><strong>' + escapeHtml(receiptCategoryLabel(receipt.categoryId)) + "</strong></div>" +
      '<div><span>Economic Code</span><strong>' + escapeHtml(receiptEconomicCodeLabel(receipt.economicCodeId)) + "</strong></div>" +
      '<div><span>Amount</span><strong>' + displayAmount(receipt.amount) + "</strong></div>";
  }

  function renderReceiptPreview(receipt) {
    var modeLabel = receipt.entryMode === "retireAdvance" ? "Retire Advance" : "Classification";
    var advanceSection = receipt.entryMode === "retireAdvance"
      ? '<section class="voucher-paper-section"><h3>Linked Advance</h3><div class="voucher-paper-grid three">' +
        '<div><span>Reference</span><strong>' + escapeHtml(receipt.advanceReference || "-") + '</strong></div>' +
        '<div><span>Holder</span><strong>' + escapeHtml(receipt.advanceHolderName || "-") + '</strong></div>' +
        '<div><span>Balance</span><strong>' + displayAmount(receipt.advanceBalance) + '</strong></div>' +
        '<div><span>Original Amount</span><strong>' + displayAmount(receipt.advanceOriginalAmount) + '</strong></div>' +
        '<div><span>Retired So Far</span><strong>' + displayAmount(receipt.advanceRetiredAmount) + '</strong></div>' +
        '<div><span>Retirement Payment Method</span><strong>' + escapeHtml(paymentMethodLabel(receipt.retirePaymentMethod || receipt.paymentMethod)) + '</strong></div>' +
        '<div><span>Mode</span><strong>Retire Advance</strong></div>' +
        "</div></section>"
      : "";

    return '' +
      '<article class="voucher-paper">' +
      '<div class="voucher-paper-head">' +
      '<div><p class="kicker">Voucher</p><h2>Receipt Voucher</h2><p>' + escapeHtml(receipt.stateName + " / " + receipt.localGovernmentName) + "</p></div>" +
      '<div class="voucher-paper-status">' + statusPill(receipt.status) + "</div>" +
      "</div>" +
      '<div class="voucher-paper-meta">' + getReceiptPreviewMeta(receipt) + '<div><span>Entry Mode</span><strong>' + escapeHtml(modeLabel) + '</strong></div></div>' +
      advanceSection +
      '<section class="voucher-paper-section"><h3>Administrative Details</h3><div class="voucher-paper-grid three">' +
      '<div><span>Department</span><strong>' + escapeHtml(receiptDepartmentLabel(receipt.departmentId)) + "</strong></div>" +
      '<div><span>Category</span><strong>' + escapeHtml(receiptCategoryLabel(receipt.categoryId)) + "</strong></div>" +
      '<div><span>Economic Code</span><strong>' + escapeHtml(receiptEconomicCodeLabel(receipt.economicCodeId)) + "</strong></div>" +
      "</div></section>" +
      '<section class="voucher-paper-section"><h3>Receipt Details</h3><div class="voucher-paper-grid three">' +
      '<div><span>Received From</span><strong>' + escapeHtml(receipt.receivedFrom || "-") + "</strong></div>" +
      '<div><span>Payer Name</span><strong>' + escapeHtml(receipt.payerName || "-") + "</strong></div>" +
      '<div><span>Witness Name</span><strong>' + escapeHtml(receipt.witnessName || "-") + "</strong></div>" +
      '<div><span>Cashier / Revenue Collector</span><strong>' + escapeHtml(receipt.cashierName || "-") + "</strong></div>" +
      '<div><span>Cashier Signature</span><strong>' + escapeHtml(receipt.cashierSignature || "-") + "</strong></div>" +
      '<div><span>Purpose / On Account Of</span><strong>' + escapeHtml(receipt.purpose || "-") + "</strong></div>" +
      "</div></section>" +
      '<section class="voucher-paper-section"><h3>Workflow</h3><div class="voucher-paper-grid three">' +
      '<div><span>Status</span><strong>' + escapeHtml(receipt.status || "Draft") + "</strong></div>" +
      '<div><span>Created By</span><strong>' + escapeHtml(receipt.createdBy || "-") + "</strong></div>" +
      '<div><span>Updated At</span><strong>' + stamp(receipt.updatedAt) + "</strong></div>" +
      '<div><span>Created At</span><strong>' + stamp(receipt.createdAt) + "</strong></div>" +
      '<div><span>Routing</span><strong>Checking, then Approval</strong></div>' +
      '<div><span>Office Copy</span><strong>Treasury record</strong></div>' +
      "</div></section>" +
      "</article>";
  }

  function getAdvanceRetirementTotal(advanceId, excludeReceiptId) {
    return getReceipts().filter(function (receipt) {
      return receipt.entryMode === "retireAdvance" && receipt.advanceId === advanceId && receipt.id !== excludeReceiptId;
    }).reduce(function (sum, receipt) {
      return sum + Number(receipt.amount || 0);
    }, 0);
  }

  function getAdvanceSummary(advanceId, excludeReceiptId) {
    var advance = byId(getAdvances(), advanceId);
    var retired = advance ? Number(advance.retiredAmount || 0) : 0;
    var linked = advance ? getAdvanceRetirementTotal(advanceId, excludeReceiptId) : 0;
    var original = advance ? Number(advance.originalAmount || 0) : 0;
    var balance = Math.max(0, original - retired - linked);

    return {
      advance: advance,
      original: original,
      retired: retired + linked,
      balance: balance
    };
  }

  function renderAdvanceOptions(selectedId) {
    var advances = getAdvances().map(function (advance) {
      var summary = getAdvanceSummary(advance.id);
      return {
        id: advance.id,
        label: (advance.reference || advance.holderName || advance.id) + " - " + (advance.holderName || "Advance holder") + " - balance " + displayAmount(summary.balance) + (summary.balance > 0 ? "" : " (retired)")
      };
    }).filter(function (advance) {
      return byId(getAdvances(), advance.id) && (getAdvanceSummary(advance.id).balance > 0 || advance.id === selectedId);
    });

    return optionList(advances, selectedId, "Select running advance");
  }

  function setReceiptEntryMode(mode) {
    receiptEntryMode = mode === "retireAdvance" ? "retireAdvance" : "classification";

    document.querySelectorAll("[data-rov-entry-mode]").forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-rov-entry-mode") === receiptEntryMode);
    });

    if ($("rov-classification-section")) {
      $("rov-classification-section").hidden = receiptEntryMode === "retireAdvance";
    }
    if ($("rov-collection-section")) {
      $("rov-collection-section").hidden = receiptEntryMode === "retireAdvance";
    }
    if ($("rov-narration-section")) {
      $("rov-narration-section").hidden = receiptEntryMode === "retireAdvance";
    }
    if ($("rov-retire-section")) {
      $("rov-retire-section").hidden = receiptEntryMode !== "retireAdvance";
    }
  }

  function populateAdvanceSummary(receipt, excludeReceiptId) {
    var summary = getAdvanceSummary(receipt.advanceId || selectedAdvanceId, excludeReceiptId || receipt.id);
    var advance = summary.advance;
    if (!advance) {
      if ($("rov-advance-balance")) {
        $("rov-advance-balance").textContent = "-";
      }
      if ($("rov-advance-status")) {
        $("rov-advance-status").textContent = "Pick an advance to load the carried details.";
      }
      ["rov-advance-reference", "rov-advance-holder", "rov-advance-department", "rov-advance-category", "rov-advance-economic-code", "rov-advance-original-amount", "rov-advance-retired-amount", "rov-advance-payment-method"].forEach(function (id) {
        if ($(id)) {
          $(id).textContent = "-";
        }
      });
      return summary;
    }

    if ($("rov-advance-balance")) {
      $("rov-advance-balance").textContent = displayAmount(summary.balance);
    }
    if ($("rov-advance-status")) {
      $("rov-advance-status").textContent = summary.balance > 0 ? "Part payment is allowed up to the remaining balance." : "This advance is fully retired.";
    }
    if ($("rov-advance-reference")) {
      $("rov-advance-reference").textContent = advance.reference || "-";
    }
    if ($("rov-advance-holder")) {
      $("rov-advance-holder").textContent = advance.holderName || "-";
    }
    if ($("rov-advance-department")) {
      $("rov-advance-department").textContent = receiptDepartmentLabel(advance.departmentId);
    }
    if ($("rov-advance-category")) {
      $("rov-advance-category").textContent = receiptCategoryLabel(advance.categoryId);
    }
    if ($("rov-advance-economic-code")) {
      $("rov-advance-economic-code").textContent = receiptEconomicCodeLabel(advance.economicCodeId);
    }
    if ($("rov-advance-original-amount")) {
      $("rov-advance-original-amount").textContent = displayAmount(summary.original);
    }
    if ($("rov-advance-retired-amount")) {
      $("rov-advance-retired-amount").textContent = displayAmount(summary.retired);
    }
    if ($("rov-advance-payment-method")) {
      $("rov-advance-payment-method").textContent = paymentMethodLabel(advance.paymentMethod);
    }

    return summary;
  }

  function applySelectedAdvanceToReceipt(advanceId, existingReceipt) {
    selectedAdvanceId = advanceId || "";
    if ($("rov-advance-id")) {
      $("rov-advance-id").value = selectedAdvanceId;
    }

    var summary = populateAdvanceSummary({
      advanceId: selectedAdvanceId,
      id: existingReceipt && existingReceipt.id ? existingReceipt.id : ""
    }, existingReceipt && existingReceipt.id);
    var advance = summary.advance;
    var keepExistingAmount = Boolean(existingReceipt && existingReceipt.entryMode === "retireAdvance" && existingReceipt.advanceId === selectedAdvanceId);

    if (advance) {
      setFieldValue("rov-department", advance.departmentId);
      setFieldValue("rov-category", advance.categoryId);
      setFieldValue("rov-economic-code", advance.economicCodeId);
      setFieldValue("rov-retire-payment-method", existingReceipt && existingReceipt.entryMode === "retireAdvance" ? (existingReceipt.retirePaymentMethod || existingReceipt.paymentMethod) : advance.paymentMethod);
      setFieldValue("rov-retire-received-from", advance.holderName);
      setFieldValue("rov-retire-payer-name", advance.holderName);
      setFieldValue("rov-retire-purpose", advance.purpose);
      setFieldValue("rov-retire-cashier-name", CURRENT_NAME);
      setFieldValue("rov-retire-witness-name", "");
      setFieldValue("rov-retire-amount", keepExistingAmount ? digits(existingReceipt.amount) : "");
    }

    return summary;
  }

  function setReceiptViewMode(mode) {
    var detailMode = mode === "detail";
    if ($("rov-view-panel")) {
      $("rov-view-panel").classList.toggle("rov-receipt-detail-mode", detailMode);
      $("rov-view-panel").classList.toggle("rov-receipt-table-mode", !detailMode);
    }
  }

  function getReceiptFromForm(existing) {
    var mode = receiptEntryMode;
    var advanceId = mode === "retireAdvance" ? getFieldValue("rov-advance-id") : "";
    var advanceSummary = advanceId ? getAdvanceSummary(advanceId, existing && existing.id ? existing.id : "") : { advance: null, original: 0, retired: 0, balance: 0 };
    var amountFieldId = mode === "retireAdvance" ? "rov-retire-amount" : "rov-amount";
    return normalizeReceipt({
      id: existing && existing.id ? existing.id : "rov-" + slug(getFieldValue("rov-treasury-number") || getFieldValue("rov-receipt-no") || Date.now()),
      localGovernmentName: LOCAL_GOVERNMENT_NAME,
      stateName: STATE_NAME,
      entryMode: mode,
      advanceId: advanceId,
      advanceReference: advanceSummary.advance ? advanceSummary.advance.reference : "",
      advanceHolderName: advanceSummary.advance ? advanceSummary.advance.holderName : "",
      advanceDepartmentId: advanceSummary.advance ? advanceSummary.advance.departmentId : "",
      advanceCategoryId: advanceSummary.advance ? advanceSummary.advance.categoryId : "",
      advanceEconomicCodeId: advanceSummary.advance ? advanceSummary.advance.economicCodeId : "",
      advancePaymentMethod: advanceSummary.advance ? advanceSummary.advance.paymentMethod : "",
      advancePurpose: advanceSummary.advance ? advanceSummary.advance.purpose : "",
      advanceOriginalAmount: advanceSummary.original,
      advanceRetiredAmount: advanceSummary.retired,
      advanceBalance: advanceSummary.balance,
      retirePaymentMethod: mode === "retireAdvance" ? getFieldValue("rov-retire-payment-method") || (advanceSummary.advance ? advanceSummary.advance.paymentMethod : "cash") : "",
      treasuryReceiptVoucherNumber: getFieldValue("rov-treasury-number"),
      receiptNo: getFieldValue("rov-receipt-no"),
      departmentId: getFieldValue("rov-department"),
      categoryId: getFieldValue("rov-category"),
      economicCodeId: getFieldValue("rov-economic-code"),
      paymentMethod: mode === "retireAdvance" ? (getFieldValue("rov-retire-payment-method") || (advanceSummary.advance ? advanceSummary.advance.paymentMethod : "cash")) : getFieldValue("rov-payment-method") || "cash",
      receivedFrom: mode === "retireAdvance"
        ? (advanceSummary.advance ? advanceSummary.advance.holderName : getFieldValue("rov-retire-received-from"))
        : getFieldValue("rov-received-from"),
      amount: parseMoney(getFieldValue(amountFieldId)),
      purpose: mode === "retireAdvance"
        ? (advanceSummary.advance ? advanceSummary.advance.purpose : getFieldValue("rov-retire-purpose"))
        : getFieldValue("rov-purpose"),
      cashierSignature: mode === "retireAdvance" ? "" : getFieldValue("rov-cashier-signature"),
      cashierName: mode === "retireAdvance"
        ? getFieldValue("rov-retire-cashier-name")
        : getFieldValue("rov-cashier-name"),
      date: getFieldValue("rov-date") || new Date().toISOString().slice(0, 10),
      payerName: mode === "retireAdvance"
        ? (advanceSummary.advance ? advanceSummary.advance.holderName : getFieldValue("rov-retire-payer-name"))
        : getFieldValue("rov-payer-name"),
      witnessName: mode === "retireAdvance"
        ? getFieldValue("rov-retire-witness-name")
        : getFieldValue("rov-witness-name"),
      status: existing ? existing.status : "Draft",
      createdAt: existing ? existing.createdAt : "",
      updatedAt: existing ? existing.updatedAt : "",
      createdBy: existing ? existing.createdBy : ""
    });
  }

  function populateReceiptForm(receipt) {
    if ($("rov-instance-context")) {
      $("rov-instance-context").textContent = receipt.stateName + " / " + receipt.localGovernmentName;
    }
    if ($("rov-overview-instance")) {
      $("rov-overview-instance").textContent = receipt.stateName + " / " + receipt.localGovernmentName;
    }
    if ($("rov-overview-instance-copy")) {
      $("rov-overview-instance-copy").textContent = "";
    }
    setReceiptEntryMode(receipt.entryMode || "classification");
    selectedAdvanceId = receipt.advanceId || "";
    if ($("rov-advance-id")) {
      $("rov-advance-id").innerHTML = renderAdvanceOptions(selectedAdvanceId);
      $("rov-advance-id").value = selectedAdvanceId;
    }
    if (receipt.entryMode === "retireAdvance") {
      if ($("rov-retire-received-from")) {
        setFieldValue("rov-retire-received-from", receipt.receivedFrom || receipt.advanceHolderName);
      }
      if ($("rov-retire-payer-name")) {
        setFieldValue("rov-retire-payer-name", receipt.payerName || receipt.advanceHolderName);
      }
      if ($("rov-retire-purpose")) {
        setFieldValue("rov-retire-purpose", receipt.purpose || receipt.advancePurpose);
      }
      if ($("rov-retire-payment-method")) {
        $("rov-retire-payment-method").innerHTML = renderPaymentMethodOptions(receipt.retirePaymentMethod || receipt.paymentMethod || receipt.advancePaymentMethod || "cash");
        setFieldValue("rov-retire-payment-method", receipt.retirePaymentMethod || receipt.paymentMethod || receipt.advancePaymentMethod || "cash");
      }
      if ($("rov-retire-cashier-name")) {
        setFieldValue("rov-retire-cashier-name", receipt.cashierName);
      }
      if ($("rov-retire-witness-name")) {
        setFieldValue("rov-retire-witness-name", receipt.witnessName);
      }
      if ($("rov-retire-amount")) {
        setFieldValue("rov-retire-amount", receipt.amount ? digits(receipt.amount) : "");
      }
      populateAdvanceSummary(receipt, receipt.id);
    }
    $("rov-department").innerHTML = renderReceiptDepartmentOptions(receipt.departmentId);
    $("rov-category").innerHTML = renderReceiptCategoryOptions(receipt.categoryId);
    $("rov-payment-method").innerHTML = renderPaymentMethodOptions(receipt.paymentMethod || "cash");
    $("rov-economic-code").innerHTML = renderReceiptEconomicCodeOptions(receipt.categoryId, receipt.economicCodeId);
    setFieldValue("rov-treasury-number", receipt.treasuryReceiptVoucherNumber);
    setFieldValue("rov-receipt-no", receipt.receiptNo);
    setFieldValue("rov-date", receipt.date || new Date().toISOString().slice(0, 10));
    setFieldValue("rov-department", receipt.departmentId);
    setFieldValue("rov-category", receipt.categoryId);
    setFieldValue("rov-economic-code", receipt.economicCodeId);
    setFieldValue("rov-payment-method", receipt.paymentMethod || "cash");
    if ($("rov-retire-payment-method")) {
      $("rov-retire-payment-method").innerHTML = renderPaymentMethodOptions(receipt.retirePaymentMethod || receipt.paymentMethod || receipt.advancePaymentMethod || "cash");
      setFieldValue("rov-retire-payment-method", receipt.retirePaymentMethod || receipt.paymentMethod || receipt.advancePaymentMethod || "cash");
    }
    setFieldValue("rov-received-from", receipt.receivedFrom);
    setFieldValue("rov-amount", receipt.amount ? digits(receipt.amount) : "");
    setFieldValue("rov-purpose", receipt.purpose);
    setFieldValue("rov-cashier-signature", receipt.cashierSignature);
    setFieldValue("rov-cashier-name", receipt.cashierName);
    setFieldValue("rov-payer-name", receipt.payerName);
    setFieldValue("rov-witness-name", receipt.witnessName);
    updateReceiptSummary(receipt);
  }

  function updateReceiptSummary(receipt) {
    var draft = receipt && receipt.treasuryReceiptVoucherNumber !== undefined ? receipt : getReceiptFromForm(receipt || null);
    if ($("rov-current-status")) {
      $("rov-current-status").textContent = draft.status || "Draft";
    }
    if ($("rov-current-number")) {
      $("rov-current-number").textContent = draft.treasuryReceiptVoucherNumber || "New receipt";
    }
    if ($("rov-current-receipt-no")) {
      $("rov-current-receipt-no").textContent = draft.receiptNo || "-";
    }
    if ($("rov-current-department")) {
      $("rov-current-department").textContent = receiptDepartmentLabel(draft.departmentId);
    }
    if ($("rov-current-category")) {
      $("rov-current-category").textContent = receiptCategoryLabel(draft.categoryId);
    }
    if ($("rov-current-payment-method")) {
      $("rov-current-payment-method").textContent = paymentMethodLabel(draft.paymentMethod || "cash");
    }
    if ($("rov-current-amount")) {
      $("rov-current-amount").textContent = draft.amount ? digits(draft.amount) : "-";
    }
    if ($("rov-current-received-from")) {
      $("rov-current-received-from").textContent = draft.receivedFrom || "-";
    }
  }

  function validateReceipt(receipt) {
    if (!receipt.treasuryReceiptVoucherNumber) {
      return "Enter the treasury receipt voucher number.";
    }
    if (!receipt.receiptNo) {
      return "Enter the receipt number.";
    }
    if (!receipt.date) {
      return "Select the receipt date.";
    }
    if (receipt.entryMode === "retireAdvance") {
      var summary = getAdvanceSummary(receipt.advanceId, receipt.id);
      if (!receipt.advanceId) {
        return "Select an advance to retire.";
      }
      if (!receipt.retirePaymentMethod) {
        return "Select the payment method for this retirement.";
      }
      if (!receipt.amount) {
        return "Enter the retire amount.";
      }
      if (receipt.amount > summary.balance) {
        return "Retire amount cannot exceed the remaining balance.";
      }
      return "";
    }
    if (!receipt.departmentId) {
      return "Select a department.";
    }
    if (!receipt.categoryId) {
      return "Select a category.";
    }
    if (!receipt.economicCodeId) {
      return "Select an economic code.";
    }
    if (!receipt.paymentMethod) {
      return "Select a payment method.";
    }
    if (!receipt.receivedFrom) {
      return "Enter who the receipt was received from.";
    }
    if (!receipt.amount) {
      return "Enter an amount.";
    }
    if (!receipt.purpose) {
      return "Enter the purpose or on-account-of note.";
    }
    if (!receipt.cashierName) {
      return "Enter the cashier or revenue collector name.";
    }
    return "";
  }

  function renderReceiptTable() {
    var receipts = getReceipts();
    var selected = byId(receipts, viewReceiptId);
    var previewId = selected ? selected.id : "";

    registerTableRows("rov-table-body", receipts.map(function (receipt) {
      return {
        markup: '<tr class="' + (receipt.id === (selected && selected.id) ? "voucher-selected-row" : "") + '"><td>' + escapeHtml(receipt.treasuryReceiptVoucherNumber || "-") + '</td><td>' + escapeHtml(receipt.receiptNo || "-") + '</td><td>' + escapeHtml(receipt.date || "-") + '</td><td>' + escapeHtml(receiptDepartmentLabel(receipt.departmentId)) + '</td><td>' + escapeHtml(receiptCategoryLabel(receipt.categoryId)) + '</td><td>' + escapeHtml(paymentMethodLabel(receipt.paymentMethod)) + '</td><td>' + escapeHtml(receipt.receivedFrom || "-") + '</td><td>' + digits(receipt.amount) + '</td><td>' + statusPill(receipt.status) + '</td><td><div class="table-inline-actions"><button class="button slim" type="button" data-rov-view="' + escapeHtml(receipt.id) + '">View</button><a class="button slim" href="receipts-voucher.html?edit=' + escapeHtml(receipt.id) + '&tab=manage">Edit</a></div></td></tr>',
        searchText: [receipt.treasuryReceiptVoucherNumber, receipt.receiptNo, receipt.date, receiptDepartmentLabel(receipt.departmentId), receiptCategoryLabel(receipt.categoryId), paymentMethodLabel(receipt.paymentMethod), receipt.receivedFrom, receipt.payerName, receipt.cashierName, receipt.advanceReference, receipt.entryMode, receipt.status].join(" ")
      };
    }), '<tr><td colspan="10">No receipts have been saved yet.</td></tr>', { pageSize: 5, countId: "rov-record-count" });

    document.querySelectorAll("[data-rov-view]").forEach(function (button) {
      button.addEventListener("click", function () {
        viewReceiptId = button.getAttribute("data-rov-view");
        updateReceiptViewPreview(viewReceiptId);
      });
    });

    document.querySelectorAll("[data-rov-export]").forEach(function (button) {
      button.addEventListener("click", function () {
        var exportType = button.getAttribute("data-rov-export");
        if (exportType === "print") {
          window.print();
          return;
        }
        toast("Receipt register export to " + exportType.toUpperCase() + " will be enabled in the next pass.", "info");
      });
    });

    if (previewId) {
      updateReceiptViewPreview(previewId);
    } else {
      updateReceiptViewPreview("");
    }
  }

  function updateReceiptViewPreview(receiptId) {
    var receipt = byId(getReceipts(), receiptId || viewReceiptId);
    if (!receipt) {
      setReceiptViewMode("table");
      if ($("rov-view-preview")) {
        $("rov-view-preview").innerHTML = '<div class="voucher-empty-state"><strong>No receipt selected</strong><span>Select a row to inspect the read-only receipt layout.</span></div>';
      }
      return;
    }
    viewReceiptId = receipt.id;
    setReceiptViewMode("detail");
    if ($("rov-view-preview")) {
      $("rov-view-preview").innerHTML = '<div class="voucher-preview-toolbar"><button class="button slim" type="button" id="rov-back-to-table">Back to table</button></div>' + renderReceiptPreview(receipt);
      if ($("rov-back-to-table")) {
        $("rov-back-to-table").addEventListener("click", function () {
          viewReceiptId = "";
          setReceiptViewMode("table");
          if ($("rov-view-preview")) {
            $("rov-view-preview").innerHTML = '<div class="voucher-empty-state"><strong>No receipt selected</strong><span>Select a row to inspect the read-only receipt layout.</span></div>';
          }
        });
      }
    }
  }

  function renderReceiptManage() {
    var query = new URLSearchParams(window.location.search);
    var existing = query.get("edit") ? byId(getReceipts(), query.get("edit")) : null;
    var isEditing = Boolean(existing);

    attachMoneyFormatters(document);
    populateReceiptForm(existing || normalizeReceipt({ date: new Date().toISOString().slice(0, 10), status: "Draft" }));
    if ($("rov-manage-feedback")) {
      $("rov-manage-feedback").textContent = isEditing ? "Editing receipt." : "Draft receipt.";
    }
    if ($("rov-status-pill")) {
      $("rov-status-pill").textContent = existing ? (existing.status || "Draft") : "Draft";
      $("rov-status-pill").className = "status-pill " + ((existing && existing.status === "Approved") ? "ok" : (existing && existing.status === "Approval") ? "warn" : "info");
    }
    if ($("save-rov-draft")) {
      $("save-rov-draft").textContent = isEditing ? "Update receipt" : "Save receipt";
    }
    if ($("submit-rov-approval")) {
      $("submit-rov-approval").textContent = isEditing ? "Send for Approval" : "Send for Approval";
    }

    document.querySelectorAll("[data-rov-entry-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        var nextMode = button.getAttribute("data-rov-entry-mode");
        setReceiptEntryMode(nextMode);
        if (nextMode === "retireAdvance") {
          applySelectedAdvanceToReceipt($("rov-advance-id") ? $("rov-advance-id").value : selectedAdvanceId, existing);
        }
        updateReceiptSummary(getReceiptFromForm(existing));
      });
    });

    if ($("rov-advance-id")) {
      $("rov-advance-id").addEventListener("change", function () {
        applySelectedAdvanceToReceipt($("rov-advance-id").value, existing);
        updateReceiptSummary(getReceiptFromForm(existing));
      });
    }

    ["rov-treasury-number", "rov-receipt-no", "rov-date", "rov-department", "rov-economic-code", "rov-payment-method", "rov-received-from", "rov-amount", "rov-purpose", "rov-cashier-signature", "rov-cashier-name", "rov-payer-name", "rov-witness-name", "rov-retire-payment-method", "rov-retire-received-from", "rov-retire-payer-name", "rov-retire-amount", "rov-retire-purpose", "rov-retire-cashier-name", "rov-retire-witness-name"].forEach(function (id) {
      if ($(id)) {
        $(id).addEventListener("input", function () {
          updateReceiptSummary(getReceiptFromForm(existing));
        });
        $(id).addEventListener("change", function () {
          updateReceiptSummary(getReceiptFromForm(existing));
        });
      }
    });

    if ($("rov-category")) {
      $("rov-category").addEventListener("change", function () {
        $("rov-economic-code").innerHTML = renderReceiptEconomicCodeOptions($("rov-category").value, $("rov-economic-code").value);
        updateReceiptSummary(getReceiptFromForm(existing));
      });
    }

    function persistReceipt(nextStatus, successMessage, nextHref) {
      var allReceipts = getReceipts();
      var receipt = getReceiptFromForm(existing);
      var index = allReceipts.findIndex(function (entry) { return entry.id === receipt.id; });
      var validationMessage = validateReceipt(receipt);

      if (validationMessage) {
        feedback("rov-manage-feedback", validationMessage, "error");
        return;
      }

      receipt.status = nextStatus || receipt.status || "Draft";
      receipt.createdAt = existing ? existing.createdAt : new Date().toISOString();
      receipt.updatedAt = new Date().toISOString();
      receipt.createdBy = existing ? existing.createdBy : CURRENT_NAME;

      if (index > -1) {
        allReceipts[index] = receipt;
        logVoucherChange("Receipts (RV)", "Updated receipt voucher " + (receipt.treasuryReceiptVoucherNumber || "without number") + ".");
      } else {
        allReceipts.unshift(receipt);
        logVoucherChange("Receipts (RV)", "Created receipt voucher " + (receipt.treasuryReceiptVoucherNumber || "without number") + ".");
      }

      write(STORE.receipts, allReceipts);
      viewReceiptId = receipt.id;
      updateReceiptViewPreview(receipt.id);
      feedback("rov-manage-feedback", successMessage, "success");
      if (nextHref) {
        window.location.href = nextHref.replace("{id}", receipt.id);
      }
    }

    if ($("save-rov-draft")) {
      $("save-rov-draft").addEventListener("click", function () {
        persistReceipt(existing ? existing.status || "Draft" : "Draft", "Receipt saved successfully.", "receipts-voucher.html?tab=view&view={id}");
      });
    }

    if ($("submit-rov-approval")) {
      $("submit-rov-approval").addEventListener("click", function () {
        persistReceipt("Approval", "Receipt sent for approval.", "receipt-approval.html?tab=pending&receipt={id}");
      });
    }
  }

  function renderReceiptsPage() {
    var query = new URLSearchParams(window.location.search);
    var initialTarget = query.get("tab") === "manage" ? "rov-manage-panel" : "rov-view-panel";
    var selectedReceiptId = query.get("view") || query.get("edit") || "";

    if (query.get("edit") && query.get("tab") !== "view") {
      initialTarget = "rov-manage-panel";
    }

    viewReceiptId = selectedReceiptId;
    initModuleTabs(initialTarget);
    renderReceiptManage();
    renderReceiptTable();
    updateReceiptViewPreview(viewReceiptId);
  }

  function getReceiptApprovalReceipts() {
    return getReceipts().filter(function (receipt) {
      return receipt.status === "Approval" || receipt.status === "Approved" || receipt.status === "Rejected";
    });
  }

  function renderReceiptApprovalPreview(receipt) {
    return renderReceiptPreview(receipt);
  }

  function setReceiptApprovalActionState(receipt) {
    var isPending = receipt && receipt.status === "Approval";
    var isApproved = receipt && receipt.status === "Approved";
    var isRejected = receipt && receipt.status === "Rejected";

    if ($("accept-receipt-approval-btn")) {
      $("accept-receipt-approval-btn").style.display = isPending ? "inline-flex" : "none";
      $("accept-receipt-approval-btn").disabled = !isPending;
    }
    if ($("reject-receipt-approval-btn")) {
      $("reject-receipt-approval-btn").style.display = isPending ? "inline-flex" : "none";
      $("reject-receipt-approval-btn").disabled = !isPending;
    }
    if ($("receipt-approval-feedback")) {
      if (!receipt) {
        $("receipt-approval-feedback").textContent = "No receipt selected.";
      } else if (isPending) {
        $("receipt-approval-feedback").textContent = "Review " + receipt.treasuryReceiptVoucherNumber + " and approve it or return it to draft.";
      } else if (isApproved) {
        $("receipt-approval-feedback").textContent = receipt.treasuryReceiptVoucherNumber + " has already been approved.";
      } else if (isRejected) {
        $("receipt-approval-feedback").textContent = receipt.treasuryReceiptVoucherNumber + " was rejected and returned.";
      }
    }
    if ($("receipt-approval-detail-status")) {
      $("receipt-approval-detail-status").className = "status-pill " + (isPending ? "warn" : isApproved ? "ok" : isRejected ? "danger" : "info");
      $("receipt-approval-detail-status").textContent = isPending ? "Pending approval" : isApproved ? "Approved" : isRejected ? "Rejected" : "Review mode";
    }
    if ($("receipt-approval-detail-copy")) {
      $("receipt-approval-detail-copy").textContent = receipt
        ? "Inspect the receipt details, then approve it or return it to draft."
        : "Inspect the selected receipt, then use the back button to return to the queue.";
    }
  }

  function renderReceiptApprovalTable() {
    var receipts = getReceiptApprovalReceipts();
    var selected = byId(receipts, receiptApprovalId) || receipts[0];

    registerTableRows("receipt-approval-body", receipts.map(function (receipt) {
      return {
        markup: '<tr class="' + (receipt.id === (selected && selected.id) ? "voucher-selected-row" : "") + '"><td>' + escapeHtml(receipt.treasuryReceiptVoucherNumber || "-") + '</td><td>' + escapeHtml(receipt.receiptNo || "-") + '</td><td>' + escapeHtml(receipt.date || "-") + '</td><td>' + escapeHtml(receiptDepartmentLabel(receipt.departmentId)) + '</td><td>' + escapeHtml(receiptCategoryLabel(receipt.categoryId)) + '</td><td>' + escapeHtml(paymentMethodLabel(receipt.paymentMethod)) + '</td><td>' + digits(receipt.amount) + '</td><td>' + statusPill(receipt.status) + '</td><td>' + escapeHtml(receipt.createdBy || "-") + '</td><td><button class="button slim" type="button" data-receipt-approval-review="' + escapeHtml(receipt.id) + '">Review</button></td></tr>',
        searchText: [receipt.treasuryReceiptVoucherNumber, receipt.receiptNo, receipt.date, receiptDepartmentLabel(receipt.departmentId), receiptCategoryLabel(receipt.categoryId), paymentMethodLabel(receipt.paymentMethod), receipt.createdBy, receipt.status].join(" ")
      };
    }), '<tr><td colspan="10">No receipts are waiting for approval.</td></tr>', { pageSize: 5, countId: "receipt-approval-count" });

    document.querySelectorAll("[data-receipt-approval-review]").forEach(function (button) {
      button.addEventListener("click", function () {
        receiptApprovalId = button.getAttribute("data-receipt-approval-review");
        updateReceiptApprovalDetail(receiptApprovalId);
      });
    });

    if (!receiptApprovalId && receipts.length) {
      updateReceiptApprovalDetail(receipts[0].id);
    } else {
      updateReceiptApprovalDetail(receiptApprovalId);
    }
  }

  function updateReceiptApprovalDetail(receiptId) {
    var receipt = byId(getReceiptApprovalReceipts(), receiptId || receiptApprovalId);
    if (!receipt) {
      if ($("receipt-approval-preview")) {
        $("receipt-approval-preview").innerHTML = '<div class="voucher-empty-state"><strong>No receipt selected</strong><span>Select a receipt row to inspect it.</span></div>';
      }
      setReceiptApprovalActionState(null);
      return;
    }
    receiptApprovalId = receipt.id;
    if ($("receipt-approval-preview")) {
      $("receipt-approval-preview").innerHTML = renderReceiptApprovalPreview(receipt);
    }
    setReceiptApprovalActionState(receipt);
  }

  function renderReceiptApprovalPage() {
    var query = new URLSearchParams(window.location.search);
    receiptApprovalId = query.get("receipt") || "";

    if ($("receipt-approval-back")) {
      $("receipt-approval-back").addEventListener("click", function () {
        receiptApprovalId = "";
        renderReceiptApprovalTable();
      });
    }

    if ($("accept-receipt-approval-btn")) {
      $("accept-receipt-approval-btn").addEventListener("click", function () {
        var receipts = getReceipts();
        var receipt = byId(receipts, receiptApprovalId);
        if (!receipt) {
          feedback("receipt-approval-feedback", "Select a receipt first.", "error");
          return;
        }
        receipt.status = "Approved";
        receipt.updatedAt = new Date().toISOString();
        write(STORE.receipts, receipts);
        logVoucherChange("Receipts (RV)", "Approved receipt voucher " + receipt.treasuryReceiptVoucherNumber + ".");
        feedback("receipt-approval-feedback", receipt.treasuryReceiptVoucherNumber + " approved.", "success");
        window.location.href = "receipts-voucher.html?tab=view&view=" + receipt.id;
      });
    }

    if ($("reject-receipt-approval-btn")) {
      $("reject-receipt-approval-btn").addEventListener("click", function () {
        var receipts = getReceipts();
        var receipt = byId(receipts, receiptApprovalId);
        if (!receipt) {
          feedback("receipt-approval-feedback", "Select a receipt first.", "error");
          return;
        }
        receipt.status = "Draft";
        receipt.updatedAt = new Date().toISOString();
        write(STORE.receipts, receipts);
        logVoucherChange("Receipts (RV)", "Returned receipt voucher " + receipt.treasuryReceiptVoucherNumber + " to draft.");
        feedback("receipt-approval-feedback", receipt.treasuryReceiptVoucherNumber + " returned to draft.", "success");
        window.location.href = "receipts-voucher.html?tab=manage&edit=" + receipt.id;
      });
    }

    renderReceiptApprovalTable();
  }

  function renderPaymentVoucherTable() {
    var vouchers = getVouchers();
    registerTableRows("pv-table-body", vouchers.map(function (voucher) {
      return {
        markup: '<tr><td>' + escapeHtml(voucher.voucherNumber || "-") + '</td><td>' + escapeHtml(voucher.voucherDate || "-") + '</td><td>' + escapeHtml(paymentMethodLabel(voucher.paymentMethod)) + '</td><td>' + escapeHtml((voucher.payToEntries[0] || {}).name || "-") + '</td><td>' + voucher.classifications.length + '</td><td>' + digits(voucher.totalAmount) + '</td><td>' + statusPill(voucher.status) + '</td><td><div class="table-inline-actions"><button class="button slim" type="button" data-pv-view="' + escapeHtml(voucher.id) + '">View</button><a class="button slim" href="payments-voucher.html?edit=' + escapeHtml(voucher.id) + '&tab=manage">Open</a></div></td></tr>',
        searchText: [voucher.voucherNumber, voucher.voucherDate, paymentMethodLabel(voucher.paymentMethod), (voucher.payToEntries[0] || {}).name || "", voucher.status].join(" ")
      };
    }), '<tr><td colspan="8">No payment vouchers saved yet.</td></tr>', { pageSize: 5, countId: "pv-record-count" });

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
    if ($("pv-payment-method")) {
      $("pv-payment-method").innerHTML = renderPaymentMethodOptions(existing ? existing.paymentMethod : "cash");
      setFieldValue("pv-payment-method", existing ? (existing.paymentMethod || "cash") : "cash");
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

  function getCheckingTabStatuses(tab) {
    if (tab === "checked") {
      return ["Checked"];
    }
    if (tab === "rejected") {
      return ["Rejected"];
    }
    return ["Checking"];
  }

  function getCheckingTabLabel(tab) {
    if (tab === "checked") {
      return "Checked Vouchers";
    }
    if (tab === "rejected") {
      return "Rejected Vouchers";
    }
    return "Pending Checks";
  }

  function getCheckingTabCopy(tab) {
    if (tab === "checked") {
      return "Checked vouchers are read-only until they are submitted for passing.";
    }
    if (tab === "rejected") {
      return "Rejected vouchers are read-only until they are resubmitted to pending checks.";
    }
    return "Only vouchers in the pending checks state appear here for review.";
  }

  function getCheckingSelection(tab) {
    return checkingPageState.selected[tab] || "";
  }

  function setCheckingSelection(tab, voucherId) {
    checkingPageState.selected[tab] = voucherId || "";
  }

  function setCheckingView(view, voucherId) {
    checkingPageState.view = view === "detail" ? "detail" : "table";
    checkingPageState.detailVoucherId = checkingPageState.view === "detail" ? (voucherId || "") : "";
  }

  function getCheckingFilteredVouchers(tab) {
    var statuses = getCheckingTabStatuses(tab);
    var filterDate = checkingPageState.date;
    return getVouchers().filter(function (voucher) {
      return statuses.indexOf(voucher.status) !== -1 && (!filterDate || voucher.voucherDate === filterDate);
    });
  }

  function setCheckingActionState(tab, voucher) {
    var selectedStatus = voucher ? voucher.status : "";
    var isPending = selectedStatus === "Checking";
    var isChecked = selectedStatus === "Checked";
    var isRejected = selectedStatus === "Rejected";

    if ($("reject-checking-btn")) {
      $("reject-checking-btn").style.display = isPending ? "inline-flex" : "none";
      $("reject-checking-btn").disabled = !isPending;
    }
    if ($("accept-checking-btn")) {
      $("accept-checking-btn").style.display = isPending ? "inline-flex" : "none";
      $("accept-checking-btn").disabled = !isPending;
    }
    if ($("resubmit-checking-btn")) {
      $("resubmit-checking-btn").style.display = isRejected ? "inline-flex" : "none";
      $("resubmit-checking-btn").disabled = !isRejected;
    }

    if ($("pv-checking-note")) {
      $("pv-checking-note").disabled = !isPending;
      if (!isPending) {
        $("pv-checking-note").value = "";
      }
    }

    if ($("pv-checking-feedback")) {
      if (!voucher) {
        $("pv-checking-feedback").textContent = "No voucher selected.";
      } else if (isPending) {
        $("pv-checking-feedback").textContent = "Reviewing " + voucher.voucherNumber + " in pending checks. Payment method: " + paymentMethodLabel(voucher.paymentMethod) + ".";
      } else if (isChecked) {
        $("pv-checking-feedback").textContent = "Viewing checked voucher " + voucher.voucherNumber + ". Payment method: " + paymentMethodLabel(voucher.paymentMethod) + ".";
      } else if (isRejected) {
        $("pv-checking-feedback").textContent = "Viewing rejected voucher " + voucher.voucherNumber + ". Payment method: " + paymentMethodLabel(voucher.paymentMethod) + ".";
      }
    }

    if ($("pv-checking-detail-status")) {
      $("pv-checking-detail-status").className = "status-pill " + (isPending ? "warn" : isChecked ? "ok" : isRejected ? "danger" : "info");
      $("pv-checking-detail-status").textContent = isPending ? "Pending checks" : isChecked ? "Checked" : isRejected ? "Rejected" : "Review mode";
    }
    if ($("pv-checking-detail-title")) {
      $("pv-checking-detail-title").textContent = voucher ? "Review " + (voucher.voucherNumber || "voucher") : "Review voucher";
    }
    if ($("pv-checking-detail-copy")) {
      if (!voucher) {
        $("pv-checking-detail-copy").textContent = "Inspect the selected voucher, then use the back button to return to the queue.";
      } else if (isPending) {
        $("pv-checking-detail-copy").textContent = "This voucher is awaiting checking. Payment method: " + paymentMethodLabel(voucher.paymentMethod) + ". You can approve it or return it to draft.";
      } else if (isChecked) {
        $("pv-checking-detail-copy").textContent = "This voucher is already checked and has moved forward for passing. Payment method: " + paymentMethodLabel(voucher.paymentMethod) + ".";
      } else if (isRejected) {
        $("pv-checking-detail-copy").textContent = "This voucher was rejected. Payment method: " + paymentMethodLabel(voucher.paymentMethod) + ". Review the note before resubmitting it.";
      }
    }
    if ($("pv-checking-actions-shell")) {
      $("pv-checking-actions-shell").hidden = !voucher || isChecked;
    }
    if ($("pv-checking-detail-layout")) {
      $("pv-checking-detail-layout").classList.toggle("is-readonly", !voucher || isChecked);
    }
  }

  function renderCheckingDetail(tab) {
    var selectedId = checkingPageState.detailVoucherId || getCheckingSelection(tab);
    var vouchers = getCheckingFilteredVouchers(tab);
    var selected = byId(vouchers, selectedId) || vouchers[0];

    if (!selected) {
      if ($("pv-checking-preview")) {
        $("pv-checking-preview").innerHTML = '<div class="voucher-empty-state"><strong>No voucher in ' + escapeHtml(getCheckingTabLabel(tab)) + '</strong><span>Matching vouchers will appear here for review.</span></div>';
      }
      setCheckingActionState(tab, null);
      return;
    }

    setCheckingSelection(tab, selected.id);
    setCheckingView("detail", selected.id);
    if ($("pv-checking-preview")) {
      $("pv-checking-preview").innerHTML = renderVoucherPreview(selected);
    }
    setCheckingActionState(tab, selected);
  }

  function renderCheckingTable(tab) {
    var vouchers = getCheckingFilteredVouchers(tab);
    var selectedId = getCheckingSelection(tab);
    var selected = byId(vouchers, selectedId) || vouchers[0];

    registerTableRows("pv-checking-body", vouchers.map(function (voucher) {
      return {
        markup: '<tr class="' + (voucher.id === (selected && selected.id) ? "voucher-selected-row" : "") + '"><td>' + escapeHtml(voucher.voucherNumber || "-") + '</td><td>' + escapeHtml(voucher.voucherDate || "-") + '</td><td>' + escapeHtml(paymentMethodLabel(voucher.paymentMethod)) + '</td><td>' + escapeHtml((voucher.payToEntries[0] || {}).name || "-") + '</td><td>' + voucher.classifications.length + '</td><td>' + digits(voucher.totalAmount) + '</td><td>' + statusPill(voucher.status) + '</td><td>' + escapeHtml(voucher.createdBy || "-") + '</td><td><button class="button slim" type="button" data-checking-review="' + escapeHtml(voucher.id) + '">Review</button></td></tr>',
        searchText: [voucher.voucherNumber, voucher.voucherDate, paymentMethodLabel(voucher.paymentMethod), (voucher.payToEntries[0] || {}).name || "", voucher.createdBy, voucher.status].join(" ")
      };
    }), '<tr><td colspan="9">No vouchers in this tab for the selected date.</td></tr>', { pageSize: 5, countId: "pv-checking-count" });

    document.querySelectorAll("[data-checking-review]").forEach(function (button) {
      button.addEventListener("click", function () {
        setCheckingSelection(tab, button.getAttribute("data-checking-review"));
        setCheckingView("detail", button.getAttribute("data-checking-review"));
        checkingRefreshPage();
      });
    });
  }

  function renderCheckingPage() {
    var query = new URLSearchParams(window.location.search);
    var initialVoucher = query.get("voucher") || "";
    var initialTab = query.get("tab") || "pending";
    var initialRecord = initialVoucher ? byId(getVouchers(), initialVoucher) : null;

    checkingPageState.tab = ["pending", "checked", "rejected"].indexOf(initialTab) !== -1 ? initialTab : "pending";
    if (initialRecord) {
      if (initialRecord.status === "Checked") {
        checkingPageState.tab = "checked";
      } else if (initialRecord.status === "Rejected") {
        checkingPageState.tab = "rejected";
      } else if (initialRecord.status === "Checking") {
        checkingPageState.tab = "pending";
      }
    }
    checkingPageState.selected[checkingPageState.tab] = initialVoucher;
    setCheckingView(initialRecord ? "detail" : "table", initialRecord ? initialVoucher : "");

    function refreshCheckingPage() {
      var tab = checkingPageState.tab;
      var selected = byId(getCheckingFilteredVouchers(tab), getCheckingSelection(tab)) || null;
      var tableShell = $("pv-checking-table-shell");
      var detailShell = $("pv-checking-detail-shell");
      document.querySelectorAll("[data-checking-tab]").forEach(function (button) {
        button.classList.toggle("active", button.getAttribute("data-checking-tab") === tab);
      });
      if ($("pv-checking-copy")) {
        $("pv-checking-copy").textContent = getCheckingTabCopy(tab);
      }
      if (tableShell) {
        tableShell.hidden = checkingPageState.view === "detail";
        tableShell.classList.toggle("table-view-layout", checkingPageState.view !== "detail");
      }
      if (detailShell) {
        detailShell.hidden = checkingPageState.view !== "detail";
      }
      if (checkingPageState.view === "detail") {
        renderCheckingDetail(tab);
      } else {
        renderCheckingTable(tab);
        setCheckingActionState(tab, selected);
      }
    }
    checkingRefreshPage = refreshCheckingPage;

    document.querySelectorAll("[data-checking-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        checkingPageState.tab = button.getAttribute("data-checking-tab");
        setCheckingView("table", "");
        refreshCheckingPage();
      });
    });

    if ($("pv-checking-back")) {
      $("pv-checking-back").addEventListener("click", function () {
        setCheckingView("table", "");
        refreshCheckingPage();
      });
    }

    if ($("pv-checking-date-filter")) {
      $("pv-checking-date-filter").value = checkingPageState.date;
      $("pv-checking-date-filter").addEventListener("change", function () {
        checkingPageState.date = $("pv-checking-date-filter").value;
        refreshCheckingPage();
      });
    }

    if ($("pv-checking-clear-filter")) {
      $("pv-checking-clear-filter").addEventListener("click", function () {
        checkingPageState.date = "";
        $("pv-checking-date-filter").value = "";
        refreshCheckingPage();
      });
    }

    if ($("accept-checking-btn")) {
      $("accept-checking-btn").addEventListener("click", function () {
        var vouchers = getVouchers();
        var voucher = byId(vouchers, checkingPageState.detailVoucherId || getCheckingSelection("pending"));
        if (!voucher) {
          feedback("pv-checking-feedback", "Select a pending voucher first.", "error");
          return;
        }

        voucher.status = "Checked";
        voucher.checkedAt = new Date().toISOString();
        voucher.checkedByWorkflow = CURRENT_NAME;
        voucher.rejectionNote = "";
        write(STORE.vouchers, vouchers);
        logVoucherChange("Checking", "Accepted and checked payment voucher " + voucher.voucherNumber + ".");
        checkingPageState.selected.checked = voucher.id;
        checkingPageState.selected.pending = "";
        checkingPageState.tab = "checked";
        setCheckingView("table", "");
        refreshCheckingPage();
      });
    }

    if ($("reject-checking-btn")) {
      $("reject-checking-btn").addEventListener("click", function () {
        var note = getFieldValue("pv-checking-note");
        if (!note) {
          feedback("pv-checking-feedback", "Enter a rejection note before rejecting the voucher.", "error");
          return;
        }
        var vouchers = getVouchers();
        var voucher = byId(vouchers, checkingPageState.detailVoucherId || getCheckingSelection("pending"));
        if (!voucher) {
          feedback("pv-checking-feedback", "Select a pending voucher first.", "error");
          return;
        }
        voucher.status = "Rejected";
        voucher.rejectedAt = new Date().toISOString();
        voucher.rejectionNote = note;
        voucher.checkedAt = "";
        voucher.checkedByWorkflow = "";
        voucher.passedAt = "";
        voucher.passedByWorkflow = "";
        write(STORE.vouchers, vouchers);
        logVoucherChange("Checking", "Rejected payment voucher " + voucher.voucherNumber + " with note.");
        checkingPageState.selected.rejected = voucher.id;
        checkingPageState.selected.pending = "";
        checkingPageState.tab = "rejected";
        $("pv-checking-note").value = "";
        setCheckingView("table", "");
        refreshCheckingPage();
      });
    }

    if ($("resubmit-checking-btn")) {
      $("resubmit-checking-btn").addEventListener("click", function () {
        var vouchers = getVouchers();
        var voucher = byId(vouchers, checkingPageState.detailVoucherId || getCheckingSelection("rejected"));
        if (!voucher) {
          feedback("pv-checking-feedback", "Select a rejected voucher first.", "error");
          return;
        }
        voucher.status = "Checking";
        voucher.rejectedAt = "";
        voucher.rejectionNote = "";
        write(STORE.vouchers, vouchers);
        logVoucherChange("Checking", "Resubmitted rejected voucher " + voucher.voucherNumber + " back to pending checks.");
        checkingPageState.selected.pending = voucher.id;
        checkingPageState.selected.rejected = "";
        checkingPageState.tab = "pending";
        setCheckingView("table", "");
        refreshCheckingPage();
      });
    }

    refreshCheckingPage();
  }

  function setPassingView(view, voucherId) {
    passingPageState.view = view === "detail" ? "detail" : "table";
    passingPageState.detailVoucherId = passingPageState.view === "detail" ? (voucherId || "") : "";
    passingVoucherId = passingPageState.detailVoucherId;
  }

  function setPassingActionState(voucher) {
    var isPassing = voucher && voucher.status === "Passing";

    if ($("mark-pv-passed-btn")) {
      $("mark-pv-passed-btn").disabled = !isPassing;
    }
    if ($("reject-passing-btn")) {
      $("reject-passing-btn").disabled = !isPassing;
    }
    if ($("pv-passing-note")) {
      $("pv-passing-note").disabled = !isPassing;
      if (!isPassing) {
        $("pv-passing-note").value = "";
      }
    }
    if ($("pv-passing-feedback")) {
      if (!voucher) {
        $("pv-passing-feedback").textContent = "No voucher selected.";
      } else {
        $("pv-passing-feedback").textContent = "Reviewing " + voucher.voucherNumber + " for passing action. Payment method: " + paymentMethodLabel(voucher.paymentMethod) + ".";
      }
    }
    if ($("pv-passing-detail-status")) {
      $("pv-passing-detail-status").className = "status-pill " + (isPassing ? "warn" : "info");
      $("pv-passing-detail-status").textContent = isPassing ? "Passing queue" : "Review mode";
    }
    if ($("pv-passing-detail-title")) {
      $("pv-passing-detail-title").textContent = voucher ? "Review " + (voucher.voucherNumber || "voucher") : "Review voucher";
    }
    if ($("pv-passing-detail-copy")) {
      $("pv-passing-detail-copy").textContent = voucher
        ? "Inspect the voucher, then mark it as passed or return it to draft. Payment method: " + paymentMethodLabel(voucher.paymentMethod) + "."
        : "Inspect the selected voucher, then use the back button to return to the queue.";
    }
  }

  function renderPassingDetail() {
    var vouchers = getVouchers().filter(function (voucher) { return voucher.status === "Passing"; });
    var selected = byId(vouchers, passingPageState.detailVoucherId || passingVoucherId) || vouchers[0];

    if (!selected) {
      if ($("pv-passing-preview")) {
        $("pv-passing-preview").innerHTML = '<div class="voucher-empty-state"><strong>No voucher in Passing queue</strong><span>Matching vouchers will appear here for review.</span></div>';
      }
      setPassingActionState(null);
      return;
    }

    setPassingView("detail", selected.id);
    if ($("pv-passing-preview")) {
      $("pv-passing-preview").innerHTML = renderVoucherPreview(selected);
    }
    setPassingActionState(selected);
  }

  function renderPassingTable() {
    var vouchers = getVouchers().filter(function (voucher) { return voucher.status === "Passing"; });
    var selected = byId(vouchers, passingPageState.detailVoucherId || passingVoucherId) || vouchers[0];

    registerTableRows("pv-passing-body", vouchers.map(function (voucher) {
      return {
        markup: '<tr class="' + (voucher.id === (selected && selected.id) ? "voucher-selected-row" : "") + '"><td>' + escapeHtml(voucher.voucherNumber || "-") + '</td><td>' + escapeHtml(voucher.voucherDate || "-") + '</td><td>' + escapeHtml(paymentMethodLabel(voucher.paymentMethod)) + '</td><td>' + escapeHtml((voucher.payToEntries[0] || {}).name || "-") + '</td><td>' + voucher.classifications.length + '</td><td>' + digits(voucher.totalAmount) + '</td><td>' + statusPill(voucher.status) + '</td><td>' + escapeHtml(voucher.createdBy || "-") + '</td><td><button class="button slim" type="button" data-passing-review="' + escapeHtml(voucher.id) + '">Review</button></td></tr>',
        searchText: [voucher.voucherNumber, voucher.voucherDate, paymentMethodLabel(voucher.paymentMethod), (voucher.payToEntries[0] || {}).name || "", voucher.createdBy].join(" ")
      };
    }), '<tr><td colspan="9">No vouchers in this queue.</td></tr>', { pageSize: 5, countId: "pv-passing-count" });

    document.querySelectorAll("[data-passing-review]").forEach(function (button) {
      button.addEventListener("click", function () {
        setPassingView("detail", button.getAttribute("data-passing-review"));
        passingRefreshPage();
      });
    });
  }

  function renderPassingPage() {
    var query = new URLSearchParams(window.location.search);
    passingVoucherId = query.get("voucher") || "";
    setPassingView(query.get("voucher") ? "detail" : "table", passingVoucherId);

    function refreshPassingPage() {
      var tableShell = $("pv-passing-table-shell");
      var detailShell = $("pv-passing-detail-shell");
      if (tableShell) {
        tableShell.hidden = passingPageState.view === "detail";
        tableShell.classList.toggle("table-view-layout", passingPageState.view !== "detail");
      }
      if (detailShell) {
        detailShell.hidden = passingPageState.view !== "detail";
      }
      if (passingPageState.view === "detail") {
        renderPassingDetail();
      } else {
        renderPassingTable();
      }
    }
    passingRefreshPage = refreshPassingPage;

    if ($("pv-passing-back")) {
      $("pv-passing-back").addEventListener("click", function () {
        setPassingView("table", "");
        refreshPassingPage();
      });
    }

    $("mark-pv-passed-btn").addEventListener("click", function () {
      var vouchers = getVouchers();
      var voucher = byId(vouchers, passingPageState.detailVoucherId || passingVoucherId);
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
      setPassingView("table", "");
      $("pv-passing-note").value = "";
      refreshPassingPage();
    });

    $("reject-passing-btn").addEventListener("click", function () {
      var note = getFieldValue("pv-passing-note");
      if (!note) {
        feedback("pv-passing-feedback", "Enter a rejection note before returning the voucher to draft.", "error");
        return;
      }
      var voucher = rejectVoucherToDraft(passingPageState.detailVoucherId || passingVoucherId, note, "Passing");
      if (!voucher) {
        feedback("pv-passing-feedback", "Select a voucher first.", "error");
        return;
      }
      feedback("pv-passing-feedback", voucher.voucherNumber + " returned to draft.", "success");
      setPassingView("table", "");
      $("pv-passing-note").value = "";
      refreshPassingPage();
    });

    refreshPassingPage();
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
    if ($("rov-form-shell")) {
      renderReceiptsPage();
    }
    if ($("receipt-approval-body")) {
      renderReceiptApprovalPage();
    }
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

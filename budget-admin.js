(function () {
  var STORE = {
    departments: "budget-admin-departments",
    banks: "budget-admin-banks",
    categories: "budget-admin-categories",
    items: "budget-admin-items",
    funding: "budget-admin-funding",
    years: "budget-admin-years",
    logs: "budget-admin-logs"
  };
  var PAGINATION = {};
  var CURRENT_ACTOR = "Super Admin";
  var CURRENT_NAME = "Tamuno Briggs";

  var seedDepartments = [
    { id: "dept-health", code: "HLT", name: "Health", status: "Active" },
    { id: "dept-works", code: "WRK", name: "Works", status: "Active" },
    { id: "dept-education", code: "EDU", name: "Education", status: "Active" },
    { id: "dept-finance", code: "FIN", name: "Finance", status: "Active" }
  ];
  var seedBanks = [
    { id: "bank-zenith-main", name: "Zenith Bank", description: "Primary operations account for statutory collections and daily treasury postings.", accountName: "PHALGA Main Treasury" },
    { id: "bank-first-projects", name: "First Bank", description: "Capital projects account used for infrastructure and intervention disbursements.", accountName: "PHALGA Capital Projects" },
    { id: "bank-uba-salary", name: "UBA", description: "Salary and payroll settlement account for approved staff payments.", accountName: "PHALGA Payroll Services" }
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
  var seedFunding = [
    { id: "fund-health-centres-2026", year: "2026", departmentId: "dept-health", categoryId: "cat-health-capital", itemId: "item-health-centres", amount: 42000000 },
    { id: "fund-health-centres-2027", year: "2027", departmentId: "dept-health", categoryId: "cat-health-capital", itemId: "item-health-centres", amount: 46000000 },
    { id: "fund-road-repairs-2026", year: "2026", departmentId: "dept-works", categoryId: "cat-works-roads", itemId: "item-road-repairs", amount: 78000000 },
    { id: "fund-drainage-desilt-2026", year: "2026", departmentId: "dept-works", categoryId: "cat-works-roads", itemId: "item-drainage-desilt", amount: 24000000 },
    { id: "fund-school-support-2026", year: "2026", departmentId: "dept-education", categoryId: "cat-education-grants", itemId: "item-school-support", amount: 35000000 }
  ];
  var seedYears = [
    { id: "year-2023", year: "2023" },
    { id: "year-2024", year: "2024" },
    { id: "year-2025", year: "2025" },
    { id: "year-2026", year: "2026" },
    { id: "year-2027", year: "2027" },
    { id: "year-2028", year: "2028" },
    { id: "year-2029", year: "2029" }
  ];
  var seedLogs = [
    { id: "log-seed-1", change: "Created department Health (HLT).", module: "Departments", actor: "Super Admin", name: "Tamuno Briggs", changedAt: "2026-06-12T08:15:00Z" },
    { id: "log-seed-2", change: "Created category Road Maintenance with code 2301.", module: "Categories", actor: "Super Admin", name: "Tamuno Briggs", changedAt: "2026-06-12T08:28:00Z" },
    { id: "log-seed-3", change: "Updated budget items for Road Maintenance with 3 saved rows.", module: "Budget Items", actor: "Budget Officer", name: "Amaka George", changedAt: "2026-06-12T09:02:00Z" },
    { id: "log-seed-4", change: "Created budget year 2027.", module: "Budget Year", actor: "Super Admin", name: "Tamuno Briggs", changedAt: "2026-06-12T09:26:00Z" },
    { id: "log-seed-5", change: "Staged import file capital-budget-review.xlsx for review.", module: "Imports", actor: "Planning Desk", name: "Ebiere Lawson", changedAt: "2026-06-12T10:11:00Z" },
    { id: "log-seed-6", change: "Saved funding entries for Works across 6 funding cells.", module: "Budget Funding", actor: "Budget Officer", name: "Amaka George", changedAt: "2026-06-12T11:48:00Z" },
    { id: "log-seed-7", change: "Created payment voucher draft PV-2026-041.", module: "Payments (PV)", actor: "Super Admin", name: "Tamuno Briggs", changedAt: "2026-06-13T08:10:00Z" },
    { id: "log-seed-8", change: "Submitted payment voucher PV-2026-041 for checking.", module: "Payments (PV)", actor: "Budget Officer", name: "Amaka George", changedAt: "2026-06-13T09:24:00Z" },
    { id: "log-seed-9", change: "Passed payment voucher PV-2026-040.", module: "Passing", actor: "Super Admin", name: "Tamuno Briggs", changedAt: "2026-06-13T10:42:00Z" }
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
      banks: read(STORE.banks, seedBanks),
      categories: read(STORE.categories, seedCategories),
      items: read(STORE.items, seedItems),
      funding: read(STORE.funding, seedFunding),
      years: read(STORE.years, seedYears),
      logs: read(STORE.logs, seedLogs)
    };
  }

  function money(value) {
    return "N" + Number(value || 0).toLocaleString();
  }

  function digits(value) {
    return Number(value || 0).toLocaleString();
  }

  function parseFundingAmount(value) {
    return Number(String(value || "").replace(/,/g, ""));
  }

  function stamp(value) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date(value)).replace(" AM", " am").replace(" PM", " pm");
  }

  function formatFundingInputValue(value) {
    var cleaned = String(value || "").replace(/[^0-9.]/g, "");
    var parts = cleaned.split(".");
    var whole = parts.shift() || "";
    var decimal = parts.length ? "." + parts.join("") : "";

    if (!whole && !decimal) {
      return "";
    }

    return (whole ? Number(whole).toLocaleString() : "0") + decimal;
  }

  function optionList(items, selectedValue, label) {
    return '<option value="">' + label + "</option>" + items.map(function (item) {
      var selected = item.id === selectedValue ? " selected" : "";
      return '<option value="' + item.id + '"' + selected + ">" + item.name + "</option>";
    }).join("");
  }

  function byId(list, id) {
    return list.find(function (item) { return item.id === id; });
  }

  function slug(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || String(Date.now());
  }

  function logBudgetChange(moduleName, changeText) {
    var logs = read(STORE.logs, seedLogs).slice();
    logs.unshift({
      id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      change: changeText,
      module: moduleName,
      actor: CURRENT_ACTOR,
      name: CURRENT_NAME,
      changedAt: new Date().toISOString()
    });
    write(STORE.logs, logs);
  }

  function feedback(id, message, type) {
    var element = $(id);
    if (!element && id === "department-feedback") {
      element = $("department-feedback-message");
    }
    if (!element) return;
    if (id === "department-feedback") {
      element.textContent = message;
    } else {
      element.textContent = message;
      if (element.classList.contains("save-feedback")) {
        element.className = "save-feedback" + (type ? " " + type : "");
      }
    }
    if (type === "success" || type === "error") {
      toast(message, type);
    }
  }

  function ensurePaginationState(id, pageSize) {
    if (!PAGINATION[id]) {
      PAGINATION[id] = { page: 1, pageSize: pageSize || 5, query: "" };
    }
    if (pageSize) {
      PAGINATION[id].pageSize = pageSize;
    }
    return PAGINATION[id];
  }

  function rowSearchText(markup) {
    var scratch = document.createElement("div");
    scratch.innerHTML = markup;
    return (scratch.textContent || scratch.innerText || "").toLowerCase();
  }

  function normalizeRows(rows) {
    return rows.map(function (row) {
      if (typeof row === "string") {
        return { markup: row, searchText: rowSearchText(row) };
      }

      return {
        markup: row.markup,
        searchText: String(row.searchText || rowSearchText(row.markup)).toLowerCase()
      };
    });
  }

  function renderTableSet(bodyId) {
    var body = $(bodyId);
    if (!body) {
      return;
    }

    var state = ensurePaginationState(bodyId);
    var totalRows = state.allRows.length;
    var filteredRows = state.query
      ? state.allRows.filter(function (row) { return row.searchText.indexOf(state.query) !== -1; })
      : state.allRows.slice();
    state.filteredRows = filteredRows.slice();
    var filteredCount = filteredRows.length;
    var totalPages = Math.max(1, Math.ceil(filteredCount / state.pageSize));

    if (state.page > totalPages) {
      state.page = totalPages;
    }
    if (state.page < 1) {
      state.page = 1;
    }

    var start = (state.page - 1) * state.pageSize;
    var end = start + state.pageSize;
    var visibleRows = filteredRows.slice(start, end);

    body.innerHTML = filteredCount
      ? visibleRows.map(function (row) { return row.markup; }).join("")
      : state.emptyMarkup;

    if (state.countId && $(state.countId)) {
      $(state.countId).textContent = filteredCount + " records";
    }

    renderTableTools(body, state, totalRows, filteredCount, totalPages);
    renderTablePagination(body, state, filteredCount, totalPages, start, end);
  }

  function renderTableTools(body, state, totalRows, filteredCount, totalPages) {
    var shell = body.closest(".table-shell");
    if (!shell) {
      return;
    }

    var tools = shell.querySelector(".table-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "table-tools";
      var anchor = shell.querySelector(".table-content");
      shell.insertBefore(tools, anchor);
    }

    tools.innerHTML =
      '<div class="table-export-actions" aria-label="Table actions">' +
      '<button class="table-icon-tool" type="button" data-table-action="excel" title="Export to Excel" aria-label="Export to Excel">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0v5h5" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.7"/><path d="m9 10 4 6M13 10l-4 6M16 14h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7"/></svg>' +
      '<span class="sr-only">Export to Excel</span>' +
      '</button>' +
      '<button class="table-icon-tool" type="button" data-table-action="pdf" title="Export to PDF" aria-label="Export to PDF">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0v5h5" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.7"/><path d="M8.5 16v-4h1.7a1.2 1.2 0 1 1 0 2.4H8.5m4.2 1.6v-4h1.1a1.7 1.7 0 0 1 0 3.4h-1.1m4.5-3.4h-2.1v4m0-2h1.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>' +
      '<span class="sr-only">Export to PDF</span>' +
      '</button>' +
      '<button class="table-icon-tool" type="button" data-table-action="print" title="Print table" aria-label="Print table">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V4h10v5M7 17h10v3H7Zm12-3H5a2 2 0 0 1-2-2v-1.5A2.5 2.5 0 0 1 5.5 8H18.5A2.5 2.5 0 0 1 21 10.5V12a2 2 0 0 1-2 2Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.7"/><path d="M17 11h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>' +
      '<span class="sr-only">Print table</span>' +
      '</button>' +
      "</div>" +
      '<label class="table-search">' +
      '<span>Search</span>' +
      '<input type="search" value="' + state.query.replace(/"/g, "&quot;") + '" placeholder="Type to filter this table">' +
      "</label>";

    tools.querySelectorAll("[data-table-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        handleTableAction(body, state, button.getAttribute("data-table-action"));
      });
    });

    tools.querySelector("input").addEventListener("input", function (event) {
      state.query = event.target.value.trim().toLowerCase();
      state.page = 1;
      renderTableSet(body.id);
    });
  }

  function getTableTitle(body) {
    var panel = body.closest(".ops-panel");
    var titleNode = panel ? panel.querySelector(".table-toolbar-copy h2, .form-panel-head h2, h2") : null;
    return titleNode ? titleNode.textContent.trim() : "Budget table";
  }

  function collectTableHeaders(body) {
    var table = body.closest("table");
    return table
      ? Array.from(table.querySelectorAll("thead th")).map(function (cell) {
          return cell.textContent.trim();
        })
      : [];
  }

  function collectTableRows(state) {
    return (state.filteredRows || state.allRows || []).map(function (row) {
      var scratch = document.createElement("tbody");
      scratch.innerHTML = row.markup;
      return Array.from(scratch.querySelectorAll("td")).map(function (cell) {
        return cell.textContent.replace(/\s+/g, " ").trim();
      });
    });
  }

  function makeTableExportMatrix(body, state) {
    return {
      title: getTableTitle(body),
      headers: collectTableHeaders(body),
      rows: collectTableRows(state)
    };
  }

  function downloadTextFile(filename, content, type) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function exportTableToExcel(body, state) {
    var matrix = makeTableExportMatrix(body, state);
    var lines = [];

    if (matrix.headers.length) {
      lines.push(matrix.headers.join("\t"));
    }

    matrix.rows.forEach(function (row) {
      lines.push(row.join("\t"));
    });

    downloadTextFile(slug(matrix.title) + ".xls", lines.join("\n"), "application/vnd.ms-excel;charset=utf-8");
    toast(matrix.title + " exported to Excel.", "success");
  }

  function openTablePrintView(body, state, mode) {
    var matrix = makeTableExportMatrix(body, state);
    var printWindow = window.open("", "_blank", "width=1080,height=760");
    if (!printWindow) {
      toast("Allow pop-ups to continue with this action.", "error");
      return;
    }

    var headerMarkup = matrix.headers.map(function (header) {
      return "<th>" + header + "</th>";
    }).join("");
    var rowMarkup = matrix.rows.map(function (row) {
      return "<tr>" + row.map(function (cell) { return "<td>" + cell + "</td>"; }).join("") + "</tr>";
    }).join("");

    printWindow.document.write(
      "<!DOCTYPE html><html><head><title>" + matrix.title + "</title><style>" +
      "body{font-family:Arial,sans-serif;padding:28px;color:#172019;}h1{font-size:20px;margin:0 0 8px;}p{margin:0 0 18px;color:#5f6e63;font-size:12px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #d6ddd7;padding:10px 12px;text-align:left;font-size:12px;vertical-align:top;}th{background:#143326;color:#fff;}tr:nth-child(even) td{background:#f7faf8;}" +
      "</style></head><body><h1>" + matrix.title + "</h1><p>Generated from the prototype table view.</p><table><thead><tr>" + headerMarkup + "</tr></thead><tbody>" + rowMarkup + "</tbody></table></body></html>"
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    if (mode === "pdf") {
      toast("Print dialog opened. Use Save as PDF to export.", "success");
    }
  }

  function handleTableAction(body, state, action) {
    if (action === "excel") {
      exportTableToExcel(body, state);
      return;
    }

    if (action === "pdf") {
      openTablePrintView(body, state, "pdf");
      return;
    }

    if (action === "print") {
      openTablePrintView(body, state, "print");
    }
  }

  function renderTablePagination(body, state, totalRows, totalPages, start, end) {
    var shell = body.closest(".table-shell");
    if (!shell) {
      return;
    }

    var footer = shell.querySelector(".table-pagination");
    if (!footer) {
      footer = document.createElement("div");
      footer.className = "table-pagination";
      shell.appendChild(footer);
    }

    var first = totalRows ? start + 1 : 0;
    var last = totalRows ? Math.min(end, totalRows) : 0;
    var pageButtons = buildPageButtons(state.page, totalPages);

    footer.innerHTML =
      '<div class="table-pagination-summary">' +
      '<label class="table-tools-select">' +
      '<span>Rows</span>' +
      '<select data-table-size>' +
      '<option value="5"' + (state.pageSize === 5 ? " selected" : "") + '>5</option>' +
      '<option value="10"' + (state.pageSize === 10 ? " selected" : "") + '>10</option>' +
      '<option value="20"' + (state.pageSize === 20 ? " selected" : "") + '>20</option>' +
      "</select>" +
      "</label>" +
      '<span class="table-range-copy">Showing <strong>' + first + "-" + last + '</strong> of <strong>' + totalRows + "</strong></span>" +
      "</div>" +
      '<div class="table-pagination-controls">' +
      '<button class="pagination-button" type="button" data-pagination-move="prev"' + (state.page === 1 ? " disabled" : "") + '>Prev</button>' +
      '<div class="pagination-pages">' + pageButtons + "</div>" +
      '<span class="pagination-total">of ' + totalPages + " pages</span>" +
      '<button class="pagination-button" type="button" data-pagination-move="next"' + (state.page === totalPages ? " disabled" : "") + '>Next</button>' +
      "</div>";

    footer.querySelector("[data-table-size]").addEventListener("change", function (event) {
      state.pageSize = Number(event.target.value);
      state.page = 1;
      renderTableSet(body.id);
    });

    footer.querySelectorAll("[data-pagination-move]").forEach(function (button) {
      button.addEventListener("click", function () {
        var direction = button.getAttribute("data-pagination-move");
        state.page += direction === "next" ? 1 : -1;
        renderTableSet(body.id);
      });
    });

    footer.querySelectorAll("[data-page-target]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.page = Number(button.getAttribute("data-page-target"));
        renderTableSet(body.id);
      });
    });
  }

  function buildPageButtons(currentPage, totalPages) {
    var pages = [];
    var page;

    if (totalPages <= 5) {
      for (page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }
    } else {
      pages = [1];
      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }
      for (page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page += 1) {
        pages.push(page);
      }
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }
      pages.push(totalPages);
    }

    return pages.map(function (entry) {
      if (String(entry).indexOf("ellipsis") === 0) {
        return '<span class="pagination-ellipsis">...</span>';
      }

      return '<button class="pagination-button pagination-number' + (entry === currentPage ? " active" : "") + '" type="button" data-page-target="' + entry + '">' + entry + "</button>";
    }).join("");
  }

  function registerTableRows(bodyId, rows, emptyMarkup, options) {
    var settings = options || {};
    var state = ensurePaginationState(bodyId, settings.pageSize || 5);
    state.allRows = normalizeRows(rows);
    state.emptyMarkup = emptyMarkup;
    state.countId = settings.countId || "";
    renderTableSet(bodyId);
  }

  function initStaticPagination(bodyId, options) {
    var body = $(bodyId);
    if (!body) {
      return;
    }

    var columnCount = body.parentNode && body.parentNode.tHead && body.parentNode.tHead.rows[0]
      ? body.parentNode.tHead.rows[0].cells.length
      : 1;
    var rows = Array.from(body.querySelectorAll("tr")).map(function (row) {
      return row.outerHTML;
    });
    registerTableRows(bodyId, rows, '<tr><td colspan="' + columnCount + '">No records available.</td></tr>', options || {});
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

  function ensureModalRoot() {
    var root = document.querySelector(".record-modal");
    if (root) {
      return root;
    }

    root = document.createElement("div");
    root.className = "record-modal";
    root.innerHTML =
      '<div class="record-modal-backdrop" data-modal-close></div>' +
      '<div class="record-modal-dialog">' +
      '<div class="record-modal-head">' +
      '<div><h2 id="record-modal-title">Record view</h2><p id="record-modal-copy">Full details</p></div>' +
      '<button class="record-modal-close" type="button" data-modal-close aria-label="Close modal">x</button>' +
      "</div>" +
      '<div class="record-modal-body" id="record-modal-body"></div>' +
      "</div>";
    document.body.appendChild(root);

    root.querySelectorAll("[data-modal-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        root.classList.remove("active");
      });
    });
    return root;
  }

  function openRecordModal(title, copy, bodyMarkup) {
    var root = ensureModalRoot();
    $("record-modal-title").textContent = title;
    $("record-modal-copy").textContent = copy;
    $("record-modal-body").innerHTML = bodyMarkup;
    root.classList.add("active");
  }

  function toast(message, type) {
    var root = ensureToastRoot();
    var item = document.createElement("div");
    item.className = "toast toast-" + (type || "info");
    item.innerHTML = '<strong>' + (type === "error" ? "Action needed" : "Successful") + '</strong><span>' + message + "</span>";
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

  function setDepartmentMode(editing) {
    var manageTab = $("department-manage-tab");
    var contextTitle = $("department-context-title");
    var formTitle = $("department-form-title");
    var formCopy = $("department-form-copy");
    var currentViewLabel = $("department-current-view-label");
    var inspectorCopy = $("department-inspector-copy");
    var button = $("save-department");
    var cancel = $("cancel-department-edit");

    if (!contextTitle || !formTitle || !formCopy || !currentViewLabel || !inspectorCopy || !button || !cancel) {
      return;
    }

    if (editing) {
      if (manageTab) {
        manageTab.textContent = "Update Department";
      }
      contextTitle.textContent = "Update department context";
      formTitle.textContent = "Update department";
      formCopy.textContent = "Review the record, update the details, then save the changes below.";
      currentViewLabel.textContent = "Edit view";
      inspectorCopy.textContent = "You are updating an existing department record. Save the changes below or cancel to return to create mode.";
      button.textContent = "Save changes";
      cancel.style.display = "inline-flex";
      return;
    }

    if (manageTab) {
      manageTab.textContent = "Manage Department";
    }
    contextTitle.textContent = "Create department context";
    formTitle.textContent = "Manage department";
    formCopy.textContent = "Create a department or continue editing a selected one.";
    currentViewLabel.textContent = "Departments view";
    inspectorCopy.textContent = "Department records must be stable because downstream budget records depend on them.";
    button.textContent = "Save department";
    cancel.style.display = "none";
  }

  function renderDepartmentManage() {
    var d = data();
    var editId = new URLSearchParams(window.location.search).get("edit");
    var editing = editId ? byId(d.departments, editId) : null;

    setDepartmentMode(Boolean(editing));

    if (editing) {
      activateDepartmentTab("department-manage-panel");
      $("department-name").value = editing.name;
      $("department-code").value = editing.code;
      $("department-status").value = editing.status;
      $("department-feedback-message").textContent = "You are editing " + editing.name + ". Cancel edit mode to return to create mode.";
    }

    $("save-department").addEventListener("click", function () {
      var name = $("department-name").value.trim();
      var code = $("department-code").value.trim().toUpperCase();
      var status = $("department-status").value;

      if (!name || !code) {
        feedback("department-feedback", "Enter department name and code.", "error");
        return;
      }

      if (editing) {
        editing.name = name;
        editing.code = code;
        editing.status = status;
      } else {
        d.departments.push({ id: "dept-" + slug(name), code: code, name: name, status: status });
      }

      write(STORE.departments, d.departments);
      logBudgetChange("Departments", editing ? "Updated department " + name + " (" + code + ")." : "Created department " + name + " (" + code + ").");
      feedback("department-feedback", editing ? "Department updated successfully." : "Department saved successfully.", "success");
    });
  }

  function renderDepartmentView() {
    var departments = data().departments;
    registerTableRows("department-table-body", departments.map(function (department) {
      return "<tr><td>" + department.code + "</td><td>" + department.name + "</td><td><span class=\"status-pill ok\">" + department.status + "</span></td><td><a class=\"button slim\" href=\"departments-manage.html?edit=" + department.id + "\">Edit</a></td></tr>";
    }), '<tr><td colspan="4">No departments available.</td></tr>', { pageSize: 5, countId: "department-record-count" });
  }

  function setBankMode(editing) {
    var manageTab = $("bank-manage-tab");
    var contextTitle = $("bank-context-title");
    var formTitle = $("bank-form-title");
    var formCopy = $("bank-form-copy");
    var currentViewLabel = $("bank-current-view-label");
    var inspectorCopy = $("bank-inspector-copy");
    var button = $("save-bank");
    var cancel = $("cancel-bank-edit");

    if (!contextTitle || !formTitle || !formCopy || !currentViewLabel || !inspectorCopy || !button || !cancel) {
      return;
    }

    if (editing) {
      if (manageTab) {
        manageTab.textContent = "Update Bank";
      }
      contextTitle.textContent = "Update bank context";
      formTitle.textContent = "Update bank";
      formCopy.textContent = "Review the bank record, update the details, then save the changes below.";
      currentViewLabel.textContent = "Edit view";
      inspectorCopy.textContent = "You are updating an existing bank setup record. Save the changes below or cancel to return to create mode.";
      button.textContent = "Save changes";
      cancel.style.display = "inline-flex";
      return;
    }

    if (manageTab) {
      manageTab.textContent = "Manage Bank";
    }
    contextTitle.textContent = "Create bank context";
    formTitle.textContent = "Manage bank";
    formCopy.textContent = "Create a bank record for the instance or continue editing a selected one.";
    currentViewLabel.textContent = "Banks view";
    inspectorCopy.textContent = "Bank records define the treasury accounts that the team can work with during later accounting flows.";
    button.textContent = "Save bank";
    cancel.style.display = "none";
  }

  function activateBankTab(targetId) {
    activateModuleTab(document.querySelector(".main-view"), targetId);
  }

  function renderBanksManage() {
    var d = data();
    var editId = new URLSearchParams(window.location.search).get("edit");
    var editing = editId ? byId(d.banks, editId) : null;

    setBankMode(Boolean(editing));

    if (editing) {
      activateBankTab("bank-manage-panel");
      $("bank-name").value = editing.name;
      $("bank-account-name").value = editing.accountName;
      $("bank-description").value = editing.description;
      $("bank-feedback-message").textContent = "You are editing " + editing.name + ". Cancel edit mode to return to create mode.";
    }

    $("save-bank").addEventListener("click", function () {
      var name = $("bank-name").value.trim();
      var accountName = $("bank-account-name").value.trim();
      var description = $("bank-description").value.trim();

      if (!name || !accountName || !description) {
        feedback("bank-feedback-message", "Enter bank name, account name, and description.", "error");
        return;
      }

      var duplicate = d.banks.find(function (bank) {
        return bank.id !== (editing ? editing.id : "") &&
          bank.name.toLowerCase() === name.toLowerCase() &&
          bank.accountName.toLowerCase() === accountName.toLowerCase();
      });

      if (duplicate) {
        feedback("bank-feedback-message", "That bank and account name combination already exists.", "error");
        return;
      }

      if (editing) {
        editing.name = name;
        editing.accountName = accountName;
        editing.description = description;
      } else {
        d.banks.push({
          id: "bank-" + slug(name + "-" + accountName),
          name: name,
          accountName: accountName,
          description: description
        });
      }

      write(STORE.banks, d.banks);
      logBudgetChange("Banks", editing ? "Updated bank " + name + " for account " + accountName + "." : "Created bank " + name + " for account " + accountName + ".");
      feedback("bank-feedback-message", editing ? "Bank updated successfully." : "Bank saved successfully.", "success");
    });
  }

  function renderBanksView() {
    var banks = data().banks;
    registerTableRows("bank-table-body", banks.map(function (bank) {
      return "<tr><td>" + bank.name + "</td><td>" + bank.accountName + "</td><td>" + bank.description + "</td><td><a class=\"button slim\" href=\"banks.html?edit=" + bank.id + "\">Edit</a></td></tr>";
    }), '<tr><td colspan="4">No banks available.</td></tr>', { pageSize: 5, countId: "bank-record-count" });
  }

  function activateModuleTab(scope, targetId) {
    if (!scope) {
      return;
    }

    scope.querySelectorAll(".module-tab").forEach(function (tab) {
      tab.classList.toggle("active", tab.getAttribute("data-tab-target") === targetId);
    });
    scope.querySelectorAll(".tab-panel").forEach(function (panel) {
      panel.classList.toggle("active", panel.id === targetId);
    });
  }

  function activateDepartmentTab(targetId) {
    activateModuleTab(document.querySelector(".main-view"), targetId);
  }

  function initModuleTabs(defaultTarget) {
    var scope = document.querySelector(".main-view");
    var tabs = scope ? scope.querySelectorAll(".module-tab") : [];
    if (!tabs.length) {
      return;
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateModuleTab(scope, tab.getAttribute("data-tab-target"));
      });
    });

    if (defaultTarget) {
      activateModuleTab(scope, defaultTarget);
      return;
    }

    var viewTab = Array.from(tabs).find(function (tab) {
      return (tab.getAttribute("data-tab-target") || "").toLowerCase().indexOf("view") !== -1;
    });

    if (viewTab) {
      activateModuleTab(scope, viewTab.getAttribute("data-tab-target"));
    }
  }

  function renderCategories() {
    var d = data();
    renderCategoryTable();

    $("save-category").addEventListener("click", function () {
      var name = $("category-name").value.trim();
      var code = $("category-code").value.trim().toUpperCase();

      if (!name || !code) {
        feedback("category-feedback", "Enter category name and economic code.", "error");
        return;
      }

      if (d.categories.some(function (category) { return category.code === code; })) {
        feedback("category-feedback", "That economic code already exists and cannot be reused.", "error");
        return;
      }

      d.categories.push({ id: "cat-" + slug(name + "-" + code), code: code, name: name });
      write(STORE.categories, d.categories);
      logBudgetChange("Categories", "Created category " + name + " with code " + code + ".");
      $("category-name").value = "";
      $("category-code").value = "";
      renderCategoryTable();
      feedback("category-feedback", "Category saved successfully. Economic codes remain fixed after setup.", "success");
    });
  }

  function renderCategoryTable() {
    var d = data();
    registerTableRows("category-table-body", d.categories.map(function (category) {
      return {
        markup: '<tr><td>' + category.name + '</td><td>' + category.code + '</td></tr>',
        searchText: category.name + " " + category.code
      };
    }), '<tr><td colspan="2">No categories in the shared library yet.</td></tr>', { pageSize: 5, countId: "category-record-count" });
  }

  function renderBudgetItems() {
    var d = data();
    var selectedCategory = new URLSearchParams(window.location.search).get("category") || "";
    $("item-category").innerHTML = optionList(d.categories, selectedCategory, "Select category");
    if (selectedCategory) {
      populateItemDraftRows(selectedCategory);
    }
    renderItemTable();

    $("item-category").addEventListener("change", function () {
      populateItemDraftRows($("item-category").value);
      renderItemTable();
    });
    $("add-budget-item").addEventListener("click", function () {
      addItemDraftRow();
    });
    $("save-budget-items").addEventListener("click", function () {
      var categoryId = $("item-category").value;
      var rows = Array.from(document.querySelectorAll(".item-draft-row"));
      var nextItems;
      var created = 0;

      if (!categoryId || !rows.length) {
        feedback("item-feedback", "Select a category and add at least one budget item row.", "error");
        return;
      }

      nextItems = d.items.filter(function (item) { return item.categoryId !== categoryId; });
      rows.forEach(function (row) {
        var name = row.querySelector("[data-item-name]").value.trim();
        var code = row.querySelector("[data-item-code]").value.trim().toUpperCase();
        var existingId = row.getAttribute("data-item-id");
        if (name && code) {
          nextItems.push({ id: existingId || "item-" + slug(name + "-" + code), categoryId: categoryId, code: code, name: name });
          created += 1;
        }
      });

      if (!created) {
        feedback("item-feedback", "Enter at least one budget item and economic code.", "error");
        return;
      }

      write(STORE.items, nextItems);
      logBudgetChange("Budget Items", "Updated budget items for " + (byId(d.categories, categoryId) ? byId(d.categories, categoryId).name : "selected category") + " with " + created + " saved row" + (created === 1 ? "" : "s") + ".");
      populateItemDraftRows(categoryId);
      renderItemTable();
      feedback("item-feedback", "Budget items updated for the selected category.", "success");
    });
  }

  function addItemDraftRow(item) {
    var wrapper = document.createElement("tr");
    wrapper.className = "item-draft-row";
    if (item && item.id) {
      wrapper.setAttribute("data-item-id", item.id);
    }
    wrapper.innerHTML =
      '<td><input data-item-name type="text" placeholder="Budget item name" value="' + (item ? item.name : "") + '"></td>' +
      '<td><input data-item-code type="text" placeholder="Economic code" value="' + (item ? item.code : "") + '"' + (item ? " disabled" : "") + "></td>";
    $("item-draft-body").appendChild(wrapper);
  }

  function populateItemDraftRows(categoryId) {
    var d = data();
    var rows = d.items.filter(function (item) { return item.categoryId === categoryId; });
    $("item-draft-body").innerHTML = "";
    rows.forEach(function (item) {
      addItemDraftRow(item);
    });
    addItemDraftRow();
  }

  function renderItemTable() {
    var d = data();
    var grouped = d.categories.map(function (category) {
      return {
        category: category,
        items: d.items.filter(function (item) { return item.categoryId === category.id; })
      };
    }).filter(function (entry) {
      return entry.items.length > 0;
    });

    registerTableRows("item-table-body", grouped.map(function (entry) {
      var preview = entry.items.slice(0, 3).map(function (item) {
        return '<span class="category-preview-pill">' + item.name + ' <strong>' + item.code + "</strong></span>";
      }).join("");
      return {
        markup: '<tr><td>' + entry.category.name + "</td><td><div class=\"category-preview-stack\">" + preview + '</div></td><td>' + entry.items.length + '</td><td><div class="table-inline-actions"><button class="button slim" type="button" data-item-action="view" data-category-id="' + entry.category.id + '">View</button><a class="button slim" href="budget-items.html?category=' + entry.category.id + '&tab=manage">Edit</a></div></td></tr>',
        searchText: entry.category.name + " " + entry.items.map(function (item) { return item.name + " " + item.code; }).join(" ")
      };
    }), '<tr><td colspan="4">No budget items created yet.</td></tr>', { pageSize: 5, countId: "item-record-count" });

    document.querySelectorAll("[data-item-action='view']").forEach(function (button) {
      button.addEventListener("click", function () {
        var categoryId = button.getAttribute("data-category-id");
        var category = byId(d.categories, categoryId);
        var items = d.items.filter(function (item) { return item.categoryId === categoryId; });
        openRecordModal(
          category ? category.name + " items" : "Budget items",
          "All budget items with their economic codes under the selected category.",
          '<div class="record-modal-list">' + items.map(function (item) {
            return '<div class="record-modal-row"><strong>' + item.name + '</strong><span>' + item.code + "</span></div>";
          }).join("") + "</div>"
        );
      });
    });
  }

  function renderImports() {
    $("download-template").addEventListener("click", function () {
      logBudgetChange("Imports", "Downloaded the budget import template.");
      feedback("import-feedback", "Template download simulated: Department, Category, Item Code, Item Name, Amount.", "success");
    });
    $("upload-template").addEventListener("click", function () {
      var fileName = $("import-file").value.split("\\").pop();
      if (fileName) {
        logBudgetChange("Imports", "Staged import file " + fileName + " for review.");
      }
      feedback("import-feedback", fileName ? fileName + " staged for import review." : "Choose an Excel file before uploading.", fileName ? "success" : "error");
    });
  }

  function setBudgetYearMode(editing) {
    var formTitle = $("budget-year-form-title");
    var formCopy = $("budget-year-form-copy");
    var currentViewLabel = $("budget-year-current-view-label");
    var button = $("save-budget-year");
    var cancel = $("cancel-budget-year-edit");

    if (!formTitle || !formCopy || !currentViewLabel || !button || !cancel) {
      return;
    }

    if (editing) {
      formTitle.textContent = "Update budget year";
      formCopy.textContent = "Review the selected year, update it, then save the change.";
      currentViewLabel.textContent = "Edit view";
      button.textContent = "Save changes";
      cancel.style.display = "inline-flex";
      return;
    }

    formTitle.textContent = "Manage budget year";
    formCopy.textContent = "Enter a financial year and save it into the instance setup.";
    currentViewLabel.textContent = "Manage view";
    button.textContent = "Save year";
    cancel.style.display = "none";
  }

  function renderBudgetYears() {
    var d = data();
    var editId = new URLSearchParams(window.location.search).get("edit");
    var editing = editId ? byId(d.years, editId) : null;
    renderBudgetYearTable();
    setBudgetYearMode(Boolean(editing));

    if (editing) {
      activateModuleTab(document.querySelector(".main-view"), "budget-year-manage-panel");
      $("budget-year-input").value = editing.year;
      $("budget-year-feedback").textContent = "You are editing budget year " + editing.year + ". Save changes or cancel to return to create mode.";
    }

    $("save-budget-year").addEventListener("click", function () {
      var year = $("budget-year-input").value.trim();

      if (!/^\d{4}$/.test(year)) {
        feedback("budget-year-feedback", "Enter a valid 4-digit budget year.", "error");
        return;
      }

      if (d.years.some(function (entry) { return entry.year === year && (!editing || entry.id !== editing.id); })) {
        feedback("budget-year-feedback", "That budget year already exists.", "error");
        return;
      }

      if (editing) {
        editing.year = year;
        editing.id = "year-" + year;
      } else {
        d.years.push({ id: "year-" + year, year: year });
      }
      d.years.sort(function (left, right) { return Number(left.year) - Number(right.year); });
      write(STORE.years, d.years);
      logBudgetChange("Budget Year", editing ? "Updated budget year to " + year + "." : "Created budget year " + year + ".");
      if (editing) {
        window.location.href = "budget-year.html?tab=view";
        return;
      }

      $("budget-year-input").value = "";
      renderBudgetYearTable();
      feedback("budget-year-feedback", "Budget year saved successfully.", "success");
    });
  }

  function renderBudgetYearTable() {
    var rows = data().years.slice().sort(function (left, right) {
      return Number(left.year) - Number(right.year);
    });

    registerTableRows("budget-year-table-body", rows.map(function (entry) {
      return {
        markup: '<tr><td>' + entry.year + '</td><td><a class="button slim" href="budget-year.html?edit=' + entry.id + '">Edit</a></td></tr>',
        searchText: entry.year
      };
    }), '<tr><td colspan="2">No budget years saved yet.</td></tr>', { pageSize: 5, countId: "budget-year-record-count" });
  }

  function renderFunding() {
    var d = data();
    $("funding-department").innerHTML = optionList(d.departments, "", "Select department");
    if ($("funding-view-department")) {
      $("funding-view-department").innerHTML = optionList(d.departments, "", "All departments");
    }
    renderFundingSheet("manage");
    renderFundingSheet("view");

    $("funding-department").addEventListener("change", function () {
      renderFundingSheet("manage");
    });
    if ($("funding-view-department")) {
      $("funding-view-department").addEventListener("change", function () {
        renderFundingSheet("view");
      });
    }
    $("save-funding").addEventListener("click", function () {
      var departmentId = $("funding-department").value;
      var cells = Array.from(document.querySelectorAll("[data-funding-cell]"));
      var existingFunding = d.funding.slice();
      var updated = 0;

      if (!departmentId) {
        feedback("funding-feedback", "Select a department before saving funding.", "error");
        return;
      }

      cells.forEach(function (cell) {
        var rawValue = cell.value.trim();
        var categoryId = cell.getAttribute("data-category-id");
        var itemId = cell.getAttribute("data-item-id");
        var year = cell.getAttribute("data-year");
        var existing = existingFunding.find(function (entry) {
          return entry.departmentId === departmentId && entry.categoryId === categoryId && entry.itemId === itemId && entry.year === year;
        });

        if (!rawValue) {
          return;
        }

        rawValue = parseFundingAmount(rawValue);

        if (!rawValue) {
          return;
        }

        if (existing) {
          existing.amount = rawValue;
        } else {
          existingFunding.push({
            id: "fund-" + departmentId + "-" + itemId + "-" + year,
            departmentId: departmentId,
            categoryId: categoryId,
            itemId: itemId,
            year: year,
            amount: rawValue
          });
        }
        updated += 1;
      });

      if (!updated) {
        feedback("funding-feedback", "Enter at least one funding amount to save.", "error");
        return;
      }

      write(STORE.funding, existingFunding);
      logBudgetChange("Budget Funding", "Saved funding entries for " + ((byId(d.departments, departmentId) || {}).name || "selected department") + " across " + updated + " funding cell" + (updated === 1 ? "" : "s") + ".");
      renderFundingSheet("manage");
      renderFundingSheet("view");
      feedback("funding-feedback", "Funding saved for the selected department.", "success");
    });
  }

  function renderBudgetLog() {
    var logs = data().logs;
    registerTableRows("budget-log-body", logs.map(function (entry) {
      return {
        markup: "<tr><td>" + stamp(entry.changedAt) + "</td><td>" + entry.change + "</td><td>" + entry.module + "</td><td>" + (entry.name || "-") + "</td><td>" + entry.actor + "</td></tr>",
        searchText: [entry.change, entry.module, entry.name || "", entry.actor, stamp(entry.changedAt)].join(" ")
      };
    }), '<tr><td colspan="5">No budget log entries recorded yet.</td></tr>', { pageSize: 10, countId: "budget-log-record-count" });
  }

  function renderFundingSheet(mode) {
    var d = data();
    var prefix = mode === "view" ? "funding-view" : "funding";
    var departmentField = $(prefix + "-department");
    var departmentId = departmentField ? departmentField.value : "";
    var years = d.years.slice().sort(function (left, right) {
      return Number(left.year) - Number(right.year);
    });
    var grouped = d.categories.map(function (category) {
      return {
        category: category,
        items: d.items.filter(function (item) { return item.categoryId === category.id; })
      };
    }).filter(function (entry) {
      return entry.items.length > 0;
    });
    var empty = $(prefix + (mode === "view" ? "-empty" : "-sheet-empty"));
    var tableWrap = $(prefix + (mode === "view" ? "-table-wrap" : "-sheet-table-wrap"));
    var head = $(prefix + (mode === "view" ? "-head" : "-sheet-head"));
    var body = $(prefix + (mode === "view" ? "-body" : "-sheet-body"));
    var feedbackId = mode === "view" ? "funding-view-feedback" : "funding-feedback";

    if (!empty || !tableWrap || !head || !body) {
      return;
    }

    if (mode !== "view" && !departmentId) {
      empty.hidden = false;
      tableWrap.hidden = true;
      head.innerHTML = "";
      body.innerHTML = "";
      return;
    }

    empty.hidden = true;
    tableWrap.hidden = false;
    head.innerHTML = '<tr><th>Category / Budget item</th>' + years.map(function (entry) {
      return "<th>" + entry.year + "</th>";
    }).join("") + "</tr>";

    var departmentIds = mode === "view" && !departmentId
      ? d.departments.map(function (department) { return department.id; })
      : [departmentId];

    body.innerHTML = departmentIds.map(function (currentDepartmentId) {
      var department = byId(d.departments, currentDepartmentId);
      var departmentBlock = mode === "view" && departmentIds.length > 1
        ? '<tr class="funding-department-row"><td colspan="' + (years.length + 1) + '">' + (department ? department.name : "Department") + "</td></tr>"
        : "";

      var groupedRows = grouped.map(function (entry) {
        var categoryRow = '<tr class="funding-category-row"><td colspan="' + (years.length + 1) + '">' + entry.category.name + "</td></tr>";
        var itemRows = entry.items.map(function (item) {
          var cells = years.map(function (yearEntry) {
            var saved = d.funding.find(function (fund) {
              return fund.departmentId === currentDepartmentId && fund.categoryId === entry.category.id && fund.itemId === item.id && fund.year === yearEntry.year;
            });
            if (mode === "view") {
              return '<td><span class="funding-cell-value">' + (saved ? digits(saved.amount) : "-") + "</span></td>";
            }
            var value = saved ? String(saved.amount) : "";
            return '<td><input class="funding-cell-input" data-funding-cell type="text" inputmode="decimal" data-category-id="' + entry.category.id + '" data-item-id="' + item.id + '" data-year="' + yearEntry.year + '" value="' + formatFundingInputValue(value) + '" placeholder="-"></td>';
          }).join("");
          return '<tr><td class="funding-item-cell"><strong>' + item.name + '</strong><span>' + item.code + "</span></td>" + cells + "</tr>";
        }).join("");
        return categoryRow + itemRows;
      }).join("");

      return departmentBlock + groupedRows;
    }).join("");

    if (mode !== "view") {
      body.querySelectorAll("[data-funding-cell]").forEach(function (input) {
        input.addEventListener("input", function () {
          input.value = formatFundingInputValue(input.value);
        });
      });
    }

    feedback(
      feedbackId,
      mode === "view"
        ? (departmentId
          ? "Funding view loaded for the selected department. Empty values display as dashes."
          : "Funding view loaded for all departments. Empty values display as dashes.")
        : "Funding sheet loaded for the selected department. Blank cells will not overwrite saved values."
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var query = new URLSearchParams(window.location.search);
    if ($("department-manage-tab") || $("bank-manage-tab")) {
      initModuleTabs(
        query.get("edit")
          ? ($("department-manage-tab") ? "department-manage-panel" : "bank-manage-panel")
          : ($("department-manage-tab") ? "department-view-panel" : "bank-view-panel")
      );
    } else if (query.get("tab") === "manage") {
      var manageTab = document.querySelector('.module-tab[data-tab-target*="manage"]');
      initModuleTabs(manageTab ? manageTab.getAttribute("data-tab-target") : undefined);
    } else {
      initModuleTabs();
    }
    if ($("save-department")) renderDepartmentManage();
    if ($("department-table-body")) renderDepartmentView();
    if ($("save-bank")) renderBanksManage();
    if ($("bank-table-body")) renderBanksView();
    if ($("save-category")) renderCategories();
    if ($("save-budget-year")) renderBudgetYears();
    if ($("save-budget-items")) renderBudgetItems();
    if ($("download-template")) renderImports();
    if ($("save-funding")) renderFunding();
    if ($("budget-log-body")) renderBudgetLog();
    if ($("import-template-body")) initStaticPagination("import-template-body", { pageSize: 4 });
    if ($("dashboard-queue-body")) initStaticPagination("dashboard-queue-body", { pageSize: 3 });
  });
})();

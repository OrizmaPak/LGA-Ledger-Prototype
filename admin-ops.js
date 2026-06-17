(function () {
  var PERSONNEL_STORE = "personnel-records";
  var LOG_STORE = "budget-admin-logs";
  var ORG_SETTINGS_STORE = "organization-settings";
  var CURRENT_USER_KEY = "lga-current-user-profile";
  var BUDGET_DEPARTMENTS_STORE = "budget-admin-departments";
  var LGA_INSTANCE_KEY = "lga-instance-selection";
  var STATE_INSTANCE_KEY = "lga-state-instance";

  var fallbackDepartments = [
    { id: "dept-health", name: "Health", code: "HLT" },
    { id: "dept-works", name: "Works", code: "WRK" },
    { id: "dept-education", name: "Education", code: "EDU" },
    { id: "dept-finance", name: "Finance", code: "FIN" }
  ];

  var seedPersonnel = [
    {
      id: "staff-001",
      staffId: "PHLGA-STAFF-001",
      name: "Tamuno Briggs",
      email: "tamuno.briggs@phalga.gov.ng",
      phone: "+234 803 000 4412",
      departmentId: "dept-finance",
      position: "Head of Treasury Operations",
      role: "Super Admin",
      status: "Active",
      gradeLevel: "GL 16",
      employmentType: "Permanent",
      bankName: "UBA",
      accountNumber: "1023345567",
      payrollCode: "PAY-2026-001",
      monthlyNet: 985000
    },
    {
      id: "staff-002",
      staffId: "PHLGA-STAFF-014",
      name: "Amaka George",
      email: "amaka.george@phalga.gov.ng",
      phone: "+234 803 111 2048",
      departmentId: "dept-finance",
      position: "Budget Officer",
      role: "Budget Officer",
      status: "Active",
      gradeLevel: "GL 14",
      employmentType: "Permanent",
      bankName: "Zenith Bank",
      accountNumber: "2206789943",
      payrollCode: "PAY-2026-014",
      monthlyNet: 612000
    },
    {
      id: "staff-003",
      staffId: "PHLGA-STAFF-023",
      name: "Ebiere Lawson",
      email: "ebiere.lawson@phalga.gov.ng",
      phone: "+234 806 222 1039",
      departmentId: "dept-works",
      position: "Works Accounts Liaison",
      role: "Department Desk",
      status: "Active",
      gradeLevel: "GL 12",
      employmentType: "Permanent",
      bankName: "First Bank",
      accountNumber: "3055560031",
      payrollCode: "PAY-2026-023",
      monthlyNet: 438000
    },
    {
      id: "staff-004",
      staffId: "PHLGA-STAFF-041",
      name: "Ngozi Nwosu",
      email: "ngozi.nwosu@phalga.gov.ng",
      phone: "+234 809 114 0022",
      departmentId: "dept-education",
      position: "Payroll Review Officer",
      role: "Payroll Officer",
      status: "Review",
      gradeLevel: "GL 13",
      employmentType: "Permanent",
      bankName: "Polaris Bank",
      accountNumber: "4012230065",
      payrollCode: "PAY-2026-041",
      monthlyNet: 502000
    }
  ];

  var seedSettings = {
    organizationName: "Ukwuani Local Government Council",
    stateName: "Delta State",
    treasuryEmail: "treasury@ukwani.gov.ng",
    fiscalYear: "2026",
    defaultCurrency: "Naira (NGN)",
    approvalModel: "Checking to Passing",
    payrollCutoff: "25th of every month",
    notificationMode: "In-app only"
  };

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

  function slug(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || String(Date.now());
  }

  function activeInstance() {
    var lga = read(LGA_INSTANCE_KEY, null);
    var state = read(STATE_INSTANCE_KEY, null);
    return {
      lga: lga && lga.lga ? lga.lga : "Ukwuani Local Government Council",
      state: lga && lga.state ? lga.state : (state && state.state ? state.state : "Delta State"),
      headquarters: state && state.headquarters ? state.headquarters : "Obiaruku"
    };
  }

  function currentUser() {
    var stored = read(CURRENT_USER_KEY, null);
    if (stored && stored.name) {
      return stored;
    }
    var instance = activeInstance();
    return {
      name: "Tamuno Briggs",
      role: "Super Admin",
      position: "Head of Treasury Operations",
      department: "Finance",
      email: "tamuno.briggs@ukwani.gov.ng",
      phone: "+234 803 000 4412",
      employeeId: "UKW-ADM-001",
      scope: instance.lga + ", " + instance.state
    };
  }

  function departments() {
    var stored = read(BUDGET_DEPARTMENTS_STORE, []);
    return Array.isArray(stored) && stored.length ? stored : fallbackDepartments;
  }

  function departmentName(id) {
    var department = departments().find(function (entry) { return entry.id === id; });
    return department ? department.name : "Unassigned";
  }

  function money(value) {
    return "N" + Number(value || 0).toLocaleString();
  }

  function seedPersonnelData() {
    var stored = read(PERSONNEL_STORE, []);
    if (Array.isArray(stored) && stored.length) {
      return stored;
    }
    write(PERSONNEL_STORE, seedPersonnel);
    return seedPersonnel.slice();
  }

  function personnelRecords() {
    return seedPersonnelData().slice();
  }

  function settingsData() {
    var stored = read(ORG_SETTINGS_STORE, null);
    if (stored && stored.organizationName) {
      return stored;
    }
    write(ORG_SETTINGS_STORE, seedSettings);
    return seedSettings;
  }

  function logItems() {
    return read(LOG_STORE, []).slice(0, 6);
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

  function page() {
    return document.body ? document.body.getAttribute("data-page") || "" : "";
  }

  function optionMarkup(items, valueKey, labelKey, selectedValue, placeholder) {
    return '<option value="">' + placeholder + "</option>" + items.map(function (item) {
      var value = item[valueKey];
      var label = item[labelKey];
      var selected = value === selectedValue ? " selected" : "";
      return '<option value="' + value + '"' + selected + ">" + label + "</option>";
    }).join("");
  }

  function workQueueItems() {
    var items = [
      {
        id: "queue-setup-1",
        reference: "SET-2026-004",
        module: "Settings",
        department: "Administration",
        summary: "Complete organization approval thresholds before go-live.",
        owner: "Super Admin",
        due: "2026-06-19",
        stage: "Setup",
        priority: "High",
        status: "Action Needed",
        href: "settings-permissions.html"
      },
      {
        id: "queue-payroll-1",
        reference: "PAY-2026-041",
        module: "Personnels",
        department: "Education",
        summary: "Map Ngozi Nwosu to final payroll group and confirm grade level.",
        owner: "Payroll Officer",
        due: "2026-06-20",
        stage: "Payroll",
        priority: "Medium",
        status: "Action Needed",
        href: "personnels-payroll.html"
      },
      {
        id: "queue-report-1",
        reference: "REP-2026-002",
        module: "Other Reports",
        department: "Finance",
        summary: "Review statutory report values before export to Excel.",
        owner: "Head of Treasury Operations",
        due: "2026-06-22",
        stage: "Review",
        priority: "Medium",
        status: "Awaiting",
        href: "scfpr.html"
      },
      {
        id: "queue-ledger-1",
        reference: "LED-2026-006",
        module: "Salary Ledger",
        department: "Finance",
        summary: "Upload July salary extract once the payroll month closes.",
        owner: "Payroll Officer",
        due: "2026-07-01",
        stage: "Import",
        priority: "Low",
        status: "Awaiting",
        href: "salary-ledger.html"
      }
    ];

    var voucherRecords = read("voucher-payment-records", []);
    voucherRecords.slice(0, 6).forEach(function (voucher) {
      var status = String(voucher.status || "").toLowerCase();
      if (status === "checking" || status === "passing" || status === "passed" || status === "rejected") {
        items.push({
          id: "queue-" + slug(voucher.id),
          reference: voucher.voucherNumber || "PV",
          module: status === "passing" ? "Passing" : "Checking",
          department: departmentName((((voucher.classifications || [])[0] || {}).departmentId)),
          summary: "Voucher requires action in the " + (status === "passing" ? "passing" : "checking") + " desk.",
          owner: voucher.createdBy || "Finance desk",
          due: voucher.voucherDate || "2026-06-17",
          stage: status === "passing" ? "Passing" : "Checking",
          priority: status === "passing" ? "High" : "Medium",
          status: status === "passed" ? "Cleared" : (status === "rejected" ? "Action Needed" : "Action Needed"),
          href: status === "passing" ? "passing-voucher.html" : "approve-voucher.html"
        });
      }
    });

    return items;
  }

  function renderWorkQueuePage() {
    var items = workQueueItems();
    var statusFilter = $("queue-status-filter");
    var moduleFilter = $("queue-module-filter");
    var priorityFilter = $("queue-priority-filter");
    var searchField = $("queue-search");
    var detail = $("queue-detail");

    function filtered() {
      return items.filter(function (item) {
        var query = String(searchField && searchField.value || "").toLowerCase().trim();
        if (statusFilter && statusFilter.value && item.status !== statusFilter.value) return false;
        if (moduleFilter && moduleFilter.value && item.module !== moduleFilter.value) return false;
        if (priorityFilter && priorityFilter.value && item.priority !== priorityFilter.value) return false;
        if (query) {
          var haystack = [item.reference, item.module, item.department, item.summary, item.owner, item.stage].join(" ").toLowerCase();
          if (haystack.indexOf(query) === -1) return false;
        }
        return true;
      });
    }

    function renderRows() {
      var rows = filtered();
      $("queue-body").innerHTML = rows.length ? rows.map(function (item) {
        return '<tr data-queue-row="' + item.id + '">' +
          '<td>' + item.reference + '</td>' +
          '<td>' + item.module + '</td>' +
          '<td>' + item.department + '</td>' +
          '<td>' + item.summary + '</td>' +
          '<td>' + item.owner + '</td>' +
          '<td>' + item.due + '</td>' +
          '<td><span class="status-pill ' + (item.priority === "High" ? "danger" : item.priority === "Medium" ? "warn" : "info") + '">' + item.priority + '</span></td>' +
          '<td><span class="status-pill ' + (item.status === "Cleared" ? "ok" : item.status === "Awaiting" ? "info" : "warn") + '">' + item.stage + '</span></td>' +
          '<td><a class="button slim queue-link" href="' + item.href + '">Open</a></td>' +
          '</tr>';
      }).join("") : '<tr><td colspan="9">No queue items match the active filter.</td></tr>';

      $("queue-count-pill").textContent = rows.length + " items";

      document.querySelectorAll("[data-queue-row]").forEach(function (row) {
        row.addEventListener("click", function () {
          var item = items.find(function (entry) { return entry.id === row.getAttribute("data-queue-row"); });
          if (!item) return;
          detail.innerHTML = '' +
            '<div class="rich-detail-card">' +
              '<span class="queue-highlight">' + item.module + "</span>" +
              '<h3>' + item.reference + '</h3>' +
              '<p>' + item.summary + '</p>' +
              '<div class="rich-detail-grid">' +
                '<div><span class="detail-label">Department</span><span class="detail-value">' + item.department + '</span></div>' +
                '<div><span class="detail-label">Owner</span><span class="detail-value">' + item.owner + '</span></div>' +
                '<div><span class="detail-label">Due date</span><span class="detail-value">' + item.due + '</span></div>' +
                '<div><span class="detail-label">Priority</span><span class="detail-value">' + item.priority + '</span></div>' +
                '<div><span class="detail-label">Stage</span><span class="detail-value">' + item.stage + '</span></div>' +
                '<div><span class="detail-label">Operational status</span><span class="detail-value">' + item.status + '</span></div>' +
              '</div>' +
              '<div class="settings-pill-row"><a class="button slim" href="' + item.href + '">Open source interface</a></div>' +
            '</div>';
        });
      });
    }

    moduleFilter.innerHTML = optionMarkup(
      [{ value: "Checking", label: "Checking" }, { value: "Passing", label: "Passing" }, { value: "Settings", label: "Settings" }, { value: "Personnels", label: "Personnels" }, { value: "Salary Ledger", label: "Salary Ledger" }, { value: "Other Reports", label: "Other Reports" }],
      "value",
      "label",
      "",
      "All modules"
    );

    [statusFilter, moduleFilter, priorityFilter, searchField].forEach(function (field) {
      field.addEventListener("input", renderRows);
      field.addEventListener("change", renderRows);
    });

    detail.innerHTML = '<div class="rich-detail-card"><h3>Operational inbox</h3><p>The work queue keeps cross-module action in one place so finance does not have to enter each module to know what needs attention.</p><div class="queue-focus-list"><div class="focus-row"><strong>Checking and passing</strong><span>Voucher approvals</span></div><div class="focus-row"><strong>Setup items</strong><span>Rules, organization, and workflow readiness</span></div><div class="focus-row"><strong>Staff administration</strong><span>Personnel and payroll completeness</span></div></div></div>';
    renderRows();
  }

  function renderProfilePage() {
    var user = currentUser();
    var instance = activeInstance();
    var logs = logItems();
    $("profile-name").textContent = user.name;
    $("profile-role").textContent = user.role;
    $("profile-position").textContent = user.position;
    $("profile-scope").textContent = user.scope;
    $("profile-email").textContent = user.email;
    $("profile-phone").textContent = user.phone;
    $("profile-department").textContent = user.department;
    $("profile-employee").textContent = user.employeeId;
    $("profile-instance").textContent = instance.lga + ", " + instance.state;
    $("profile-activity").innerHTML = logs.map(function (item) {
      return '<div class="timeline-card"><strong>' + item.change + '</strong><span>' + (item.module || "Operations") + '</span><em>' + stamp(item.changedAt) + '</em></div>';
    }).join("");
  }

  function renderSettingsOrganization() {
    var settings = settingsData();
    var instance = activeInstance();
    $("settings-org-name").textContent = settings.organizationName || instance.lga;
    $("settings-org-state").textContent = settings.stateName || instance.state;
    $("settings-org-email").textContent = settings.treasuryEmail;
    $("settings-org-year").textContent = settings.fiscalYear;
    $("settings-org-model").textContent = settings.approvalModel;
    $("settings-org-payroll").textContent = settings.payrollCutoff;
    $("settings-org-mode").textContent = settings.notificationMode;
    $("settings-team-body").innerHTML = personnelRecords().slice(0, 5).map(function (person) {
      return '<tr><td>' + person.name + '</td><td>' + person.position + '</td><td>' + departmentName(person.departmentId) + '</td><td>' + person.role + '</td><td><span class="status-pill ' + (person.status === "Active" ? "ok" : "warn") + '">' + person.status + '</span></td></tr>';
    }).join("");
  }

  function renderSettingsPermissions() {
    var roles = [
      { role: "Super Admin", span: "Full configuration scope", description: "Owns organization setup, workflow rules, staff creation, and final administrative control." },
      { role: "Budget Officer", span: "Budget and funding scope", description: "Can manage budgets, submit vouchers, and monitor execution reports." },
      { role: "Checking Officer", span: "Workflow review scope", description: "Can check submitted vouchers, reject with reason, and forward for passing." },
      { role: "Payroll Officer", span: "Salary and staff scope", description: "Can manage salary uploads, payroll grouping, and personnel payroll readiness." }
    ];

    $("role-card-grid").innerHTML = roles.map(function (role) {
      return '<article class="role-card"><span>' + role.span + '</span><strong>' + role.role + '</strong><p>' + role.description + '</p></article>';
    }).join("");

    $("permission-matrix-body").innerHTML = [
      ["Budget", "Full", "Full", "Limited", "None"],
      ["Payments (PV)", "Full", "Limited", "Full", "None"],
      ["Checking / Passing", "Full", "None", "Full", "None"],
      ["Cashbook", "Full", "Limited", "None", "Limited"],
      ["Ledgers", "Full", "Limited", "None", "Full"],
      ["Other Reports", "Full", "Limited", "Limited", "Limited"],
      ["Personnels", "Full", "None", "None", "Full"],
      ["Settings", "Full", "None", "None", "Limited"]
    ].map(function (row) {
      return '<tr><td>' + row[0] + '</td>' +
        row.slice(1).map(function (value) {
          var tone = value === "Full" ? "full" : value === "Limited" ? "limited" : "none";
          return '<td class="matrix-cell"><span class="grant-pill ' + tone + '">' + value + '</span></td>';
        }).join("") +
      '</tr>';
    }).join("");
  }

  function renderSettingsTheme() {
    var instance = activeInstance();
    $("theme-instance-copy").textContent = instance.lga + ", " + instance.state;
  }

  function populatePersonnelFormOptions() {
    ["personnel-department", "personnel-status", "personnel-role", "personnel-employment", "personnel-bank"].forEach(function (id) {
      if (!$(id)) return;
    });
    $("personnel-department").innerHTML = optionMarkup(departments(), "id", "name", "", "Select department");
    $("personnel-status").innerHTML = '<option value="Active">Active</option><option value="Review">Review</option><option value="Inactive">Inactive</option>';
    $("personnel-role").innerHTML = '<option value="Super Admin">Super Admin</option><option value="Budget Officer">Budget Officer</option><option value="Checking Officer">Checking Officer</option><option value="Payroll Officer">Payroll Officer</option><option value="Department Desk">Department Desk</option>';
    $("personnel-employment").innerHTML = '<option value="Permanent">Permanent</option><option value="Contract">Contract</option><option value="Adhoc">Adhoc</option>';
    $("personnel-bank").innerHTML = '<option value="UBA">UBA</option><option value="Zenith Bank">Zenith Bank</option><option value="First Bank">First Bank</option><option value="Polaris Bank">Polaris Bank</option>';
  }

  function previewPersonnelForm() {
    var preview = $("personnel-preview");
    if (!preview) return;
    preview.innerHTML = '' +
      '<strong>' + (($("personnel-name").value || "New staff record")) + '</strong>' +
      '<span class="personnel-code">' + (($("personnel-staff-id").value || "Staff ID pending")) + '</span>' +
      '<div class="staff-summary-list">' +
        '<div class="staff-summary-row"><strong>Department</strong><span>' + (departmentName($("personnel-department").value) || "Select department") + '</span></div>' +
        '<div class="staff-summary-row"><strong>Position</strong><span>' + (($("personnel-position").value || "Pending")) + '</span></div>' +
        '<div class="staff-summary-row"><strong>Role</strong><span>' + (($("personnel-role").value || "Pending")) + '</span></div>' +
        '<div class="staff-summary-row"><strong>Payroll bank</strong><span>' + (($("personnel-bank").value || "Pending")) + '</span></div>' +
      '</div>';
  }

  function bindAddPersonnelPage() {
    populatePersonnelFormOptions();
    document.querySelectorAll("#personnel-form input, #personnel-form select").forEach(function (field) {
      field.addEventListener("input", previewPersonnelForm);
      field.addEventListener("change", previewPersonnelForm);
    });
    previewPersonnelForm();

    $("personnel-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var records = personnelRecords();
      records.unshift({
        id: "staff-" + Date.now(),
        staffId: $("personnel-staff-id").value || ("PHLGA-STAFF-" + String(records.length + 1).padStart(3, "0")),
        name: $("personnel-name").value,
        email: $("personnel-email").value,
        phone: $("personnel-phone").value,
        departmentId: $("personnel-department").value,
        position: $("personnel-position").value,
        role: $("personnel-role").value,
        status: $("personnel-status").value,
        gradeLevel: $("personnel-grade").value,
        employmentType: $("personnel-employment").value,
        bankName: $("personnel-bank").value,
        accountNumber: $("personnel-account").value,
        payrollCode: $("personnel-payroll-code").value || ("PAY-2026-" + String(records.length + 1).padStart(3, "0")),
        monthlyNet: Number($("personnel-salary").value || 0)
      });
      write(PERSONNEL_STORE, records);
      $("personnel-feedback").textContent = "Personnel record saved to the prototype directory.";
      $("personnel-form").reset();
      populatePersonnelFormOptions();
      previewPersonnelForm();
    });
  }

  function renderPersonnelDirectory() {
    var data = personnelRecords();
    var body = $("personnel-directory-body");
    var detail = $("personnel-directory-detail");
    var search = $("personnel-search");
    var department = $("personnel-filter-department");
    var status = $("personnel-filter-status");

    department.innerHTML = optionMarkup(departments(), "id", "name", "", "All departments");

    function filtered() {
      return data.filter(function (person) {
        var query = String(search.value || "").toLowerCase().trim();
        if (department.value && person.departmentId !== department.value) return false;
        if (status.value && person.status !== status.value) return false;
        if (query) {
          var haystack = [person.name, person.email, person.position, person.role, person.staffId].join(" ").toLowerCase();
          if (haystack.indexOf(query) === -1) return false;
        }
        return true;
      });
    }

    function render() {
      var rows = filtered();
      body.innerHTML = rows.length ? rows.map(function (person) {
        return '<tr data-person="' + person.id + '">' +
          '<td>' + person.staffId + '</td>' +
          '<td>' + person.name + '</td>' +
          '<td>' + person.position + '</td>' +
          '<td>' + departmentName(person.departmentId) + '</td>' +
          '<td>' + person.role + '</td>' +
          '<td><span class="status-pill ' + (person.status === "Active" ? "ok" : person.status === "Review" ? "warn" : "danger") + '">' + person.status + '</span></td>' +
          '<td><button class="button slim" type="button" data-person-view="' + person.id + '">View</button></td>' +
        '</tr>';
      }).join("") : '<tr><td colspan="7">No personnel records match the active filter.</td></tr>';

      document.querySelectorAll("[data-person-view]").forEach(function (button) {
        button.addEventListener("click", function () {
          var person = data.find(function (item) { return item.id === button.getAttribute("data-person-view"); });
          if (!person) return;
          detail.innerHTML = '' +
            '<div class="profile-card"><div class="profile-card-head"><span class="directory-avatar">' + initials(person.name) + '</span><div><h2>' + person.name + '</h2><span class="profile-role">' + person.role + '</span></div></div>' +
            '<div class="profile-card-grid"><div><span class="profile-label">Staff ID</span><span class="profile-value">' + person.staffId + '</span></div><div><span class="profile-label">Department</span><span class="profile-value">' + departmentName(person.departmentId) + '</span></div><div><span class="profile-label">Position</span><span class="profile-value">' + person.position + '</span></div><div><span class="profile-label">Grade level</span><span class="profile-value">' + person.gradeLevel + '</span></div><div><span class="profile-label">Email</span><span class="profile-value">' + person.email + '</span></div><div><span class="profile-label">Phone</span><span class="profile-value">' + person.phone + '</span></div></div></div>';
        });
      });
    }

    [search, department, status].forEach(function (field) {
      field.addEventListener("input", render);
      field.addEventListener("change", render);
    });

    detail.innerHTML = '<div class="profile-card"><h3>Staff directory</h3><p>Select a staff record to inspect the personnel profile, department ownership, and payroll mapping.</p></div>';
    render();
  }

  function initials(name) {
    return String(name || "").split(" ").filter(Boolean).slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join("") || "ST";
  }

  function renderPersonnelPayroll() {
    $("personnel-payroll-body").innerHTML = personnelRecords().map(function (person) {
      return '<tr><td>' + person.payrollCode + '</td><td>' + person.name + '</td><td>' + departmentName(person.departmentId) + '</td><td>' + person.bankName + '</td><td>' + person.accountNumber + '</td><td>' + money(person.monthlyNet) + '</td><td><span class="status-pill ' + (person.status === "Active" ? "ok" : "warn") + '">' + (person.status === "Active" ? "Ready" : person.status) + '</span></td></tr>';
    }).join("");
  }

  function init() {
    seedPersonnelData();
    if (page() === "work-queue") renderWorkQueuePage();
    if (page() === "profile") renderProfilePage();
    if (page() === "settings-organization") renderSettingsOrganization();
    if (page() === "settings-permissions") renderSettingsPermissions();
    if (page() === "settings-theme") renderSettingsTheme();
    if (page() === "personnels-add") bindAddPersonnelPage();
    if (page() === "personnels-directory") renderPersonnelDirectory();
    if (page() === "personnels-payroll") renderPersonnelPayroll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

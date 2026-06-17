(function () {
  var STORE = {
    banks: "budget-admin-banks"
  };

  var workbookBankNames = ["Cash", "Wetland Bank", "Polaris Bank", "Globus Bank", "UBA"];
  var defaultPrototypeBanks = ["Cash", "Zenith Bank", "First Bank", "UBA"];
  var searchState = "";
  var rangeState = {
    start: "",
    end: ""
  };

  var revenueRows = [];

  var revenueLedgerSections = [
    {
      month: "JANUARY 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening balance brought forward from December 2025",
        banks: { Cash: 5400000, "Wetland Bank": 28000000, "Polaris Bank": 92000000, "Globus Bank": 36000000, UBA: 11000000 }
      },
      rows: [
        entry("06/1/2026", "Mikpoyibo Fredrick", "Market levy collection", "12020400", "Fees General", "RV-001", "", "RC-001", { "Polaris Bank": 60000 }, { revenue: 60000 }),
        entry("09/1/2026", "Treasury Desk", "Bank to cash contra", "12020500", "Contra Receipts", "RV-002", "", "RC-002", { Cash: 250000 }, { revenue: 250000, contra: 250000 }),
        entry("14/1/2026", "Revenue Office", "Cash to bank contra", "12020400", "Cashbook transfer", "RV-003", "", "RC-003", { "Polaris Bank": 1500000 }, { revenue: 1500000, contra: 1500000 }),
        entry("18/1/2026", "Township Market Union", "Monthly market collections", "12020400", "Fees General", "RV-004", "", "RC-004", { Cash: 180000, "Polaris Bank": 90000 }, { revenue: 270000 }),
        entry("24/1/2026", "Admin Desk", "Deposit recorded in treasury", "12020400", "Deposits", "RV-005", "", "RC-005", { "Globus Bank": 450000 }, { deposit: 450000 })
      ]
    },
    {
      month: "FEBRUARY 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening balance carried from January 2026",
        banks: { Cash: 4900000, "Wetland Bank": 28250000, "Polaris Bank": 94100000, "Globus Bank": 36500000, UBA: 11100000 }
      },
      rows: [
        entry("03/2/2026", "Ese Solomon", "Motor park collection", "12020700", "Earning General", "RV-006", "", "RC-006", { "Polaris Bank": 395000 }, { revenue: 395000 }),
        entry("08/2/2026", "Health Services Desk", "Clinic registration receipts", "12020100", "Health fees", "RV-007", "", "RC-007", { "Wetland Bank": 160000 }, { revenue: 160000 }),
        entry("12/2/2026", "Project Desk", "Bank to cash contra", "12020500", "Contra Receipts", "RV-008", "", "RC-008", { Cash: 300000 }, { revenue: 300000, contra: 300000 }),
        entry("19/2/2026", "Pension Desk", "Retired advance repayments", "12020400", "Recoveries", "RV-009", "", "RC-009", { UBA: 75000 }, { advancedRetired: 75000 }),
        entry("25/2/2026", "Treasury Desk", "Cash to bank contra", "12020400", "Cashbook transfer", "RV-010", "", "RC-010", { "Globus Bank": 1100000 }, { revenue: 1100000, contra: 1100000 })
      ]
    },
    {
      month: "MARCH 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening balance carried from February 2026",
        banks: { Cash: 4700000, "Wetland Bank": 28500000, "Polaris Bank": 95550000, "Globus Bank": 36950000, UBA: 11175000 }
      },
      rows: [
        entry("04/3/2026", "Street Naming Unit", "Street naming receipts", "12020400", "Fees General", "RV-011", "", "RC-011", { "Wetland Bank": 130000, "Polaris Bank": 70000 }, { revenue: 200000 }),
        entry("10/3/2026", "Treasury Desk", "Bank to cash contra", "12020500", "Contra Receipts", "RV-012", "", "RC-012", { Cash: 420000 }, { revenue: 420000, contra: 420000 }),
        entry("16/3/2026", "Revenue Office", "Expenditure recovery posted back", "12020600", "Recoveries", "RV-013", "", "RC-013", { "Globus Bank": 120000 }, { expenditureRecovery: 120000 }),
        entry("22/3/2026", "Ojiopia Kingsley", "Squatting fee collections", "12020400", "Fees General", "RV-014", "", "RC-014", { "Polaris Bank": 10000 }, { revenue: 10000 }),
        entry("28/3/2026", "Admin Desk", "Deposit recorded in treasury", "12020400", "Deposits", "RV-015", "", "RC-015", { "Globus Bank": 500000 }, { deposit: 500000 })
      ]
    },
    {
      month: "APRIL 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening balance carried from March 2026",
        banks: { Cash: 5220000, "Wetland Bank": 28630000, "Polaris Bank": 95610000, "Globus Bank": 37450000, UBA: 11175000 }
      },
      rows: [
        entry("02/4/2026", "Mikpoyibo Fredrick", "Market levy collection", "12020400", "Fees General", "RV-016", "", "RC-016", { "Polaris Bank": 72000 }, { revenue: 72000 }),
        entry("09/4/2026", "Project Desk", "Bank to cash contra", "12020500", "Contra Receipts", "RV-017", "", "RC-017", { Cash: 310000 }, { revenue: 310000, contra: 310000 }),
        entry("15/4/2026", "Revenue Office", "Cash to bank contra", "12020400", "Cashbook transfer", "RV-018", "", "RC-018", { "Polaris Bank": 900000 }, { revenue: 900000, contra: 900000 }),
        entry("20/4/2026", "Health Services Desk", "Clinic registration receipts", "12020100", "Health fees", "RV-019", "", "RC-019", { "Wetland Bank": 180000 }, { revenue: 180000 }),
        entry("26/4/2026", "Admin Desk", "Deposit recorded in treasury", "12020400", "Deposits", "RV-020", "", "RC-020", { "Globus Bank": 300000 }, { deposit: 300000 })
      ]
    },
    {
      month: "MAY 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening balance carried from April 2026",
        banks: { Cash: 4530000, "Wetland Bank": 28810000, "Polaris Bank": 95682000, "Globus Bank": 37750000, UBA: 11175000 }
      },
      rows: [
        entry("05/5/2026", "Township Market Union", "Monthly market collections", "12020400", "Fees General", "RV-021", "", "RC-021", { Cash: 190000, "Polaris Bank": 105000 }, { revenue: 295000 }),
        entry("11/5/2026", "Project Desk", "Bank to cash contra", "12020500", "Contra Receipts", "RV-022", "", "RC-022", { Cash: 280000 }, { revenue: 280000, contra: 280000 }),
        entry("17/5/2026", "Revenue Office", "Expenditure recovery posted back", "12020600", "Recoveries", "RV-023", "", "RC-023", { "Globus Bank": 145000 }, { expenditureRecovery: 145000 }),
        entry("23/5/2026", "Pension Desk", "Retired advance repayments", "12020400", "Recoveries", "RV-024", "", "RC-024", { UBA: 90000 }, { advancedRetired: 90000 }),
        entry("30/5/2026", "Treasury Desk", "Cash to bank contra", "12020400", "Cashbook transfer", "RV-025", "", "RC-025", { "Globus Bank": 1200000 }, { revenue: 1200000, contra: 1200000 })
      ]
    },
    {
      month: "JUNE 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening balance carried from May 2026",
        banks: { Cash: 4800000, "Wetland Bank": 28900000, "Polaris Bank": 95792000, "Globus Bank": 37995000, UBA: 11265000 }
      },
      rows: [
        entry("03/6/2026", "Mikpoyibo Fredrick", "Market levy collection", "12020400", "Fees General", "RV-026", "", "RC-026", { "Polaris Bank": 60000 }, { revenue: 60000 }),
        entry("07/6/2026", "Ese Solomon", "Motor park collection", "12020700", "Earning General", "RV-027", "", "RC-027", { "Polaris Bank": 395000 }, { revenue: 395000 }),
        entry("10/6/2026", "Treasury Desk", "Bank to cash contra", "12020500", "Contra Receipts", "RV-028", "", "RC-028", { Cash: 450000 }, { revenue: 450000, contra: 450000 }),
        entry("12/6/2026", "Revenue Office", "Expenditure recovery posted back", "12020600", "Recoveries", "RV-029", "", "RC-029", { "Globus Bank": 120000 }, { expenditureRecovery: 120000 }),
        entry("16/6/2026", "Pension Desk", "Retired advance repayments", "12020400", "Recoveries", "RV-030", "", "RC-030", { UBA: 75000 }, { advancedRetired: 75000 }),
        entry("18/6/2026", "Township Market Union", "Monthly market collections", "12020400", "Fees General", "RV-031", "", "RC-031", { Cash: 180000, "Polaris Bank": 90000 }, { revenue: 270000 }),
        entry("21/6/2026", "Admin Desk", "Deposit recorded in treasury", "12020400", "Deposits", "RV-032", "", "RC-032", { "Globus Bank": 450000 }, { deposit: 450000 }),
        entry("24/6/2026", "Health Services Desk", "Clinic registration receipts", "12020100", "Health fees", "RV-033", "", "RC-033", { "Polaris Bank": 250000 }, { revenue: 250000 }),
        entry("27/6/2026", "Street Naming Unit", "Street naming receipts", "12020400", "Fees General", "RV-034", "", "RC-034", { "Wetland Bank": 130000, "Polaris Bank": 70000 }, { revenue: 200000 }),
        entry("29/6/2026", "Ojiopia Kingsley", "Squatting fee collections", "12020400", "Fees General", "RV-035", "", "RC-035", { "Polaris Bank": 10000 }, { revenue: 10000 })
      ]
    }
  ];

  revenueRows = flattenRevenueRows(revenueLedgerSections);

  var expenditureLedgerSections = [
    {
      month: "JANUARY 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening expenditure balance brought forward from December 2025",
        banks: { Cash: 2500000, "Wetland Bank": 13000000, "Polaris Bank": 48000000, "Globus Bank": 21000000, UBA: 8500000 }
      },
      rows: [
        entry("06/1/2026", "Okirika Frank", "Advance granted", "22020100", "Administrative advances", "", "", "PV-001", { "Globus Bank": 1500000 }, { advancedGranted: 1500000 }),
        entry("12/1/2026", "Treasury Desk", "Bank to cash contra", "22020500", "Cashbook transfer", "", "", "PV-001A", { "Polaris Bank": 350000 }, { contra: 350000 }),
        entry("19/1/2026", "Atuma Ambrose", "Expenditure payment", "21010100", "Personnel and operations", "", "", "PV-002", { Cash: 60000 }, { expenditure: 60000 })
      ]
    },
    {
      month: "FEBRUARY 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening expenditure balance carried from January 2026",
        banks: { Cash: 2440000, "Wetland Bank": 13000000, "Polaris Bank": 48000000, "Globus Bank": 19500000, UBA: 8500000 }
      },
      rows: [
        entry("04/2/2026", "Animam Solomon", "Advance granted", "22020100", "Administrative advances", "", "", "PV-003", { "Globus Bank": 17000000 }, { advancedGranted: 17000000 }),
        entry("15/2/2026", "Treasury Desk", "Cash to bank contra", "22020500", "Cashbook transfer", "", "", "PV-003A", { Cash: 420000 }, { contra: 420000 }),
        entry("20/2/2026", "Ozoma Rachael", "Expenditure payment", "21010100", "Personnel and operations", "", "", "PV-004", { Cash: 40000 }, { expenditure: 40000 })
      ]
    },
    {
      month: "MARCH 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening expenditure balance carried from February 2026",
        banks: { Cash: 2400000, "Wetland Bank": 13000000, "Polaris Bank": 48000000, "Globus Bank": 2500000, UBA: 8500000 }
      },
      rows: [
        entry("05/3/2026", "Iyamah Heenrietta", "Advance granted", "22020100", "Administrative advances", "", "", "PV-005", { "Globus Bank": 2500000 }, { advancedGranted: 2500000 }),
        entry("18/3/2026", "Nwanze Judith", "Expenditure payment", "21010100", "Personnel and operations", "", "", "PV-006", { Cash: 130000 }, { expenditure: 130000 })
      ]
    },
    {
      month: "APRIL 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening expenditure balance carried from March 2026",
        banks: { Cash: 2270000, "Wetland Bank": 13000000, "Polaris Bank": 48000000, "Globus Bank": 0, UBA: 8500000 }
      },
      rows: [
        entry("07/4/2026", "Hon Ajede Solomon", "Expenditure payment", "21010100", "Personnel and operations", "", "", "PV-007", { "Globus Bank": 5000000 }, { expenditure: 5000000 }),
        entry("21/4/2026", "Okpor Elias", "Advance granted", "22020100", "Administrative advances", "", "", "PV-008", { "Globus Bank": 1000000 }, { advancedGranted: 1000000 })
      ]
    },
    {
      month: "MAY 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening expenditure balance carried from April 2026",
        banks: { Cash: 2270000, "Wetland Bank": 13000000, "Polaris Bank": 48000000, "Globus Bank": -6000000, UBA: 8500000 }
      },
      rows: [
        entry("06/5/2026", "Egbikwadje James", "Expenditure payment", "21010100", "Personnel and operations", "", "", "PV-009", { Cash: 130000 }, { expenditure: 130000 }),
        entry("23/5/2026", "Emetem Philomena", "Expenditure payment", "21010100", "Personnel and operations", "", "", "PV-010", { Cash: 60000 }, { expenditure: 60000 })
      ]
    },
    {
      month: "JUNE 2026",
      opening: {
        date: "B/F",
        name: "Balance brought forward",
        particulars: "Opening expenditure balance carried from May 2026",
        banks: { Cash: 2080000, "Wetland Bank": 13000000, "Polaris Bank": 48000000, "Globus Bank": -6000000, UBA: 8500000 }
      },
      rows: [
        entry("11/6/2026", "Egbikwadje James", "Expenditure payment", "21010100", "Personnel and operations", "", "", "PV-011", { Cash: 130000 }, { expenditure: 130000 }),
        entry("26/6/2026", "Nwadike Stella", "Advance granted", "22020100", "Administrative advances", "", "", "PV-012", { "Globus Bank": 2500000 }, { advancedGranted: 2500000 })
      ]
    }
  ];

  var expenditureRows = flattenRevenueRows(expenditureLedgerSections);

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

  function entry(date, name, particulars, head, subHead, revenueNumber, chequeNumber, documentNumber, banks, accounts) {
    return {
      date: date,
      name: name,
      particulars: particulars,
      head: head,
      subHead: subHead,
      revenueNumber: revenueNumber,
      chequeNumber: chequeNumber,
      receiptNumber: revenueNumber ? documentNumber : "",
      paymentVoucherNumber: revenueNumber ? "" : documentNumber,
      banks: banks || {},
      contra: accounts.contra || 0,
      refundOfAdvance: accounts.refundOfAdvance || accounts.advancedRetired || 0,
      revenueRefund: accounts.revenueRefund || 0,
      expenditureRecovery: accounts.expenditureRecovery || 0,
      advancedRetired: accounts.advancedRetired || 0,
      deposit: accounts.deposit || 0,
      revenue: accounts.revenue || 0,
      expenditure: accounts.expenditure || 0,
      advancedGranted: accounts.advancedGranted || 0,
      deposits: accounts.deposits || 0,
      otherAccounts: accounts.otherAccounts || 0
    };
  }

  function flattenRevenueRows(sections) {
    return sections.reduce(function (acc, section) {
      return acc.concat(section.rows || []);
    }, []);
  }

  function normalizeBankName(name) {
    return String(name || "").replace(/\s+/g, " ").trim();
  }

  function getBankNames() {
    var banks = read(STORE.banks, []);
    var names = banks.map(function (bank) { return normalizeBankName(bank.name); }).filter(Boolean);
    var signature = names.join("|");

    if (!names.length || signature === defaultPrototypeBanks.join("|")) {
      return workbookBankNames.slice();
    }

    if (!names.some(function (name) { return name.toLowerCase() === "cash"; })) {
      names.unshift("Cash");
    }

    return names.filter(function (name, index) {
      return names.indexOf(name) === index;
    });
  }

  function getRevenueBankNames(bankNames) {
    return bankNames.filter(function (name) {
      return String(name).toLowerCase() !== "cash";
    });
  }

  function bankAmounts(row, bankNames) {
    return sum(bankNames.map(function (name) {
      return Number((row.banks || {})[name] || 0);
    }));
  }

  function rowGrandTotal(row, bankNames) {
    return Number((row.banks || {}).Cash || 0) + bankAmounts(row, bankNames);
  }

  function amount(value) {
    var number = Number(value || 0);
    return number ? number.toLocaleString() : "-";
  }

  function sampleDepartmentCode(row) {
    return row.departmentCode || row.economicCode || "1-43-sdf-234-df-44-1";
  }

  function sampleCategoryCode(row) {
    return row.categoryCode || "23748";
  }

  function sampleParticularsCode(row) {
    return row.particularsCode || "3289479";
  }

  function displayParticulars(row) {
    return String(row.itemList || row.particulars || "-");
  }

  function ordinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    if (day % 10 === 1) {
      return "st";
    }
    if (day % 10 === 2) {
      return "nd";
    }
    if (day % 10 === 3) {
      return "rd";
    }
    return "th";
  }

  function formatCashbookDate(value) {
    var text = String(value || "").trim();
    if (!text || /^(B\/F|GRAND TOTAL|JANUARY 2025 TOTAL|FEBRUARY 2025 TOTAL|MARCH 2025 TOTAL)$/i.test(text)) {
      return text;
    }

    var parts = text.split(/[\/-]/);
    if (parts.length !== 3) {
      return text;
    }

    var day = Number(parts[0]);
    var month = Number(parts[1]);
    var year = Number(parts[2]);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (!day || !month || !year || month < 1 || month > 12) {
      return text;
    }

    return day + ordinalSuffix(day) + " " + months[month - 1] + " " + year;
  }

  function formatInputDateLabel(value) {
    var parsed = new Date(String(value || "") + "T00:00:00");
    if (isNaN(parsed.getTime())) {
      return value;
    }
    return formatCashbookDate(parsed.getDate() + "/" + (parsed.getMonth() + 1) + "/" + parsed.getFullYear());
  }

  function parseCashbookDate(value) {
    var text = String(value || "").trim();
    var parts = text.split(/[\/-]/);
    if (parts.length !== 3) {
      return null;
    }

    var day = Number(parts[0]);
    var month = Number(parts[1]);
    var year = Number(parts[2]);
    if (!day || !month || !year) {
      return null;
    }

    var date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  function toInputDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function dateRangeFromRows(rows) {
    var dates = rows.map(function (row) {
      return parseCashbookDate(row.date);
    }).filter(Boolean);
    if (!dates.length) {
      return currentMonthRange();
    }
    dates.sort(function (a, b) {
      return a.getTime() - b.getTime();
    });
    return {
      start: dates[0],
      end: dates[dates.length - 1]
    };
  }

  function currentMonthRange() {
    var now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    };
  }

  function setDefaultRange(startDate, endDate) {
    var range = startDate && endDate ? { start: startDate, end: endDate } : currentMonthRange();
    rangeState.start = toInputDate(range.start);
    rangeState.end = toInputDate(range.end);
    if ($("cashbook-start-date")) {
      $("cashbook-start-date").value = rangeState.start;
    }
    if ($("cashbook-end-date")) {
      $("cashbook-end-date").value = rangeState.end;
    }
    if ($("cashbook-range-chip")) {
      $("cashbook-range-chip").textContent = formatInputDateLabel(rangeState.start) + " to " + formatInputDateLabel(rangeState.end);
    }
  }

  function syncRangeChip() {
    if ($("cashbook-range-chip")) {
      if (rangeState.start && rangeState.end) {
        $("cashbook-range-chip").textContent = formatInputDateLabel(rangeState.start) + " to " + formatInputDateLabel(rangeState.end);
      } else if (rangeState.start) {
        $("cashbook-range-chip").textContent = "From " + formatInputDateLabel(rangeState.start);
      } else if (rangeState.end) {
        $("cashbook-range-chip").textContent = "Up to " + formatInputDateLabel(rangeState.end);
      } else {
        $("cashbook-range-chip").textContent = "All dates";
      }
    }
  }

  function withinRange(value) {
    if (!rangeState.start && !rangeState.end) {
      return true;
    }

    var parsed = parseCashbookDate(value);
    if (!parsed) {
      return false;
    }

    var start = rangeState.start ? new Date(rangeState.start + "T00:00:00") : null;
    var end = rangeState.end ? new Date(rangeState.end + "T23:59:59") : null;
    if (start && parsed < start) {
      return false;
    }
    if (end && parsed > end) {
      return false;
    }
    return true;
  }

  function sum(values) {
    return values.reduce(function (total, value) {
      return total + Number(value || 0);
    }, 0);
  }

  function bankTotal(row, bankNames) {
    return sum(bankNames.map(function (name) { return row.banks[name] || 0; }));
  }

  function totalRevenue(row, bankNames) {
    return bankTotal(row, bankNames);
  }

  function totalExpenditure(row, bankNames) {
    return bankTotal(row, bankNames);
  }

  function analysisTotal(row) {
    return sum([row.expenditure, row.advancedGranted, row.deposits, row.revenueRefund, row.otherAccounts]);
  }

  function rowSearchText(row) {
    return [
      formatCashbookDate(row.date),
      row.name,
      row.particulars,
      row.departmentLabel,
      row.categoryLabel,
      row.itemList,
      row.economicCode,
      row.analysis,
      row.head,
      row.subHead,
      row.revenueNumber,
      row.chequeNumber,
      row.receiptNumber,
      row.paymentVoucherNumber,
      row.recon,
      row.kind,
      row.month,
      row.revenue,
      row.refundOfAdvance,
      row.deposit,
      row.contra
    ].join(" ").toLowerCase();
  }

  function rowMatchesFilters(row) {
    return withinRange(row.date) && rowSearchText(row).indexOf(searchState) !== -1;
  }

  function isTransferRow(row) {
    return !row.kind && /(cash to bank|bank to cash)/i.test(String(row.particulars || ""));
  }

  function sumRowBanks(row, bankNames) {
    return sum(bankNames.map(function (name) { return Number((row.banks || {})[name] || 0); }));
  }

  function revenueMonthlyTotals(section, bankNames) {
    var rows = section.rows;
    return {
      cash: sum(rows.map(function (row) { return Number((row.banks || {}).Cash || 0); })),
      banks: bankNames.reduce(function (acc, name) {
        acc[name] = sum(rows.map(function (row) { return Number((row.banks || {})[name] || 0); }));
        return acc;
      }, {}),
      revenue: sum(rows.map(function (row) { return isTransferRow(row) ? 0 : (row.revenue || 0); })),
      refundOfAdvance: sum(rows.map(function (row) { return row.refundOfAdvance || row.advancedRetired || 0; })),
      contra: sum(rows.map(function (row) { return row.contra || 0; })),
      revenueRefund: sum(rows.map(function (row) { return row.revenueRefund || 0; })),
      expenditureRecovery: sum(rows.map(function (row) { return row.expenditureRecovery || 0; })),
      advancedRetired: sum(rows.map(function (row) { return row.advancedRetired || 0; })),
      deposit: sum(rows.map(function (row) { return row.deposit || 0; })),
      otherAccounts: sum(rows.map(function (row) { return row.otherAccounts || 0; }))
    };
  }

  function expenditureMonthlyTotals(section, bankNames) {
    var rows = section.rows;
    return {
      cash: sum(rows.map(function (row) { return Number((row.banks || {}).Cash || 0); })),
      banks: bankNames.reduce(function (acc, name) {
        acc[name] = sum(rows.map(function (row) { return Number((row.banks || {})[name] || 0); }));
        return acc;
      }, {}),
      expenditure: sum(rows.map(function (row) { return isTransferRow(row) ? 0 : (row.expenditure || 0); })),
      advancedGranted: sum(rows.map(function (row) { return row.advancedGranted || 0; })),
      deposits: sum(rows.map(function (row) { return row.deposits || 0; })),
      revenueRefund: sum(rows.map(function (row) { return row.revenueRefund || 0; })),
      otherAccounts: sum(rows.map(function (row) { return row.otherAccounts || 0; })),
      contra: sum(rows.map(function (row) { return row.contra || 0; }))
    };
  }

  function buildRevenueLedgerRows(bankNames) {
    var rows = [];
    var grand = {
      banks: {},
      revenue: 0,
      refundOfAdvance: 0,
      contra: 0,
      revenueRefund: 0,
      expenditureRecovery: 0,
      advancedRetired: 0,
      deposit: 0,
      otherAccounts: 0
    };

    revenueLedgerSections.forEach(function (section, sectionIndex) {
      var totals = revenueMonthlyTotals(section, bankNames);
      if (sectionIndex === 0) {
        rows.push({
          kind: "opening",
          month: section.month,
          date: section.opening.date,
          name: section.opening.name,
          particulars: section.opening.particulars,
          head: "",
          subHead: "",
          revenueNumber: "",
          chequeNumber: "",
          receiptNumber: "",
          banks: section.opening.banks
        });
      }

      section.rows.forEach(function (row) {
        rows.push(row);
      });

      rows.push({
        kind: "month-total",
        month: section.month,
        date: section.month + " TOTAL",
        name: section.month + " total",
        particulars: "Monthly total demarcation",
        head: "",
        subHead: "",
        revenueNumber: "",
        chequeNumber: "",
        receiptNumber: "",
        banks: Object.assign({ Cash: totals.cash }, totals.banks),
        revenue: totals.revenue,
        refundOfAdvance: totals.refundOfAdvance,
        contra: totals.contra,
        revenueRefund: totals.revenueRefund,
        expenditureRecovery: totals.expenditureRecovery,
        advancedRetired: totals.advancedRetired,
        deposit: totals.deposit,
        otherAccounts: totals.otherAccounts
      });

      bankNames.forEach(function (name) {
      grand.banks[name] = (grand.banks[name] || 0) + (totals.banks[name] || 0);
      });
      grand.banks.Cash = (grand.banks.Cash || 0) + totals.cash;
      grand.revenue += totals.revenue;
      grand.refundOfAdvance += totals.refundOfAdvance;
      grand.contra += totals.contra;
      grand.revenueRefund += totals.revenueRefund;
      grand.expenditureRecovery += totals.expenditureRecovery;
      grand.advancedRetired += totals.advancedRetired;
      grand.deposit += totals.deposit;
      grand.otherAccounts += totals.otherAccounts;
    });

    rows.push({
      kind: "grand-total",
      month: "GRAND TOTAL",
      date: "GRAND TOTAL",
      name: "Revenue grand total",
      particulars: "All monthly revenue totals combined",
      head: "",
      subHead: "",
      revenueNumber: "",
      chequeNumber: "",
      receiptNumber: "",
      banks: grand.banks,
      revenue: grand.revenue,
      refundOfAdvance: grand.refundOfAdvance,
      contra: grand.contra,
      revenueRefund: grand.revenueRefund,
      expenditureRecovery: grand.expenditureRecovery,
      advancedRetired: grand.advancedRetired,
      deposit: grand.deposit,
      otherAccounts: grand.otherAccounts
    });

    return rows;
  }

  function buildExpenditureLedgerRows(bankNames) {
    var rows = [];
    var grand = {
      banks: {},
      expenditure: 0,
      advancedGranted: 0,
      deposits: 0,
      revenueRefund: 0,
      otherAccounts: 0,
      contra: 0
    };

    expenditureLedgerSections.forEach(function (section) {
      var totals = expenditureMonthlyTotals(section, bankNames);
      section.rows.forEach(function (row) {
        rows.push(row);
      });

      rows.push({
        kind: "month-total",
        month: section.month,
        date: section.month + " TOTAL",
        name: section.month + " total",
        particulars: "Monthly total demarcation",
        head: "",
        subHead: "",
        paymentVoucherNumber: "",
        banks: Object.assign({ Cash: totals.cash }, totals.banks),
        expenditure: totals.expenditure,
        advancedGranted: totals.advancedGranted,
        deposits: totals.deposits,
        revenueRefund: totals.revenueRefund,
        otherAccounts: totals.otherAccounts,
        contra: totals.contra
      });

      bankNames.forEach(function (name) {
        grand.banks[name] = (grand.banks[name] || 0) + (totals.banks[name] || 0);
      });
      grand.banks.Cash = (grand.banks.Cash || 0) + totals.cash;
      grand.expenditure += totals.expenditure;
      grand.advancedGranted += totals.advancedGranted;
      grand.deposits += totals.deposits;
      grand.revenueRefund += totals.revenueRefund;
      grand.otherAccounts += totals.otherAccounts;
      grand.contra += totals.contra;
    });

    rows.push({
      kind: "grand-total",
      month: "GRAND TOTAL",
      date: "GRAND TOTAL",
      name: "Expenditure grand total",
      particulars: "All monthly expenditure totals combined",
      head: "",
      subHead: "",
      paymentVoucherNumber: "",
      banks: grand.banks,
      expenditure: grand.expenditure,
      advancedGranted: grand.advancedGranted,
      deposits: grand.deposits,
      revenueRefund: grand.revenueRefund,
      otherAccounts: grand.otherAccounts,
      contra: grand.contra
    });

    return rows;
  }

  function cell(value, className) {
    return '<td class="' + (className || "") + '">' + (value === undefined || value === null || value === "" ? "-" : value) + "</td>";
  }

  function codeCell(title, code, className) {
    return '<td class="' + (className || "") + '"><div class="cashbook-department-cell"><strong>' + (title || "-") + '</strong><span>' + (code || "-") + '</span></div></td>';
  }

  function amountCell(value, extraClass) {
    return cell(amount(value), "amount-col " + (extraClass || ""));
  }

  function header(label, className) {
    return '<th class="' + (className || "") + '">' + label + "</th>";
  }

  function rowClass(row) {
    var classes = ["cashbook-ledger-row"];
    if (row.kind === "opening") {
      classes.push("cashbook-row-opening");
    } else if (row.kind === "month-total" || row.kind === "grand-total") {
      classes.push("cashbook-row-total");
    } else if (/(cash to bank|bank to cash)/i.test(String(row.particulars || ""))) {
      classes.push("cashbook-row-transfer");
    }
    return classes.join(" ");
  }

  function renderRevenueLedgerRow(row, bankNames) {
    var displayTotal = rowGrandTotal(row, bankNames);
    var totalClass = row.kind === "month-total" || row.kind === "grand-total" ? "ledger-total-col" : "";
    var revenueValue = isTransferRow(row) ? "-" : amount(row.revenue);
    return "<tr class=\"" + rowClass(row) + "\">" +
      cell(formatCashbookDate(row.date), "sticky-col") +
      codeCell(displayParticulars(row), sampleParticularsCode(row), "particulars-col") +
      codeCell(row.departmentLabel || row.name || "-", sampleDepartmentCode(row), "department-col") +
      codeCell(row.categoryLabel || row.name || "-", sampleCategoryCode(row), "category-col") +
      amountCell((row.banks || {}).Cash) +
      bankNames.map(function (name, index) {
        return amountCell((row.banks || {})[name], index === 0 ? "group-separator" : "");
      }).join("") +
      amountCell(displayTotal, totalClass) +
      cell(row.recon || "") +
      amountCell(row.expenditureRecovery, totalClass) +
      cell(revenueValue, "amount-col " + totalClass) +
      amountCell(row.refundOfAdvance || row.advancedRetired, totalClass) +
      amountCell(row.deposit, totalClass) +
      amountCell(row.otherAccounts, totalClass) +
      amountCell(row.contra, totalClass) +
      "</tr>";
  }

  function renderExpenditureLedgerRow(row, bankNames) {
    var displayTotal = rowGrandTotal(row, bankNames);
    var totalClass = row.kind === "month-total" || row.kind === "grand-total" ? "ledger-total-col" : "";
    var expenditureValue = isTransferRow(row) ? "-" : amount(row.expenditure);
    return "<tr class=\"" + rowClass(row) + "\">" +
      cell(formatCashbookDate(row.date), "sticky-col") +
      cell(row.name, "name-col") +
      codeCell(displayParticulars(row), sampleParticularsCode(row), "particulars-col") +
      codeCell(row.departmentLabel || row.head || row.name || "-", sampleDepartmentCode(row), "department-col") +
      codeCell(row.categoryLabel || row.subHead || row.name || "-", sampleCategoryCode(row), "category-col") +
      amountCell((row.banks || {}).Cash) +
      bankNames.map(function (name, index) {
        return amountCell((row.banks || {})[name], index === 0 ? "group-separator" : "");
      }).join("") +
      amountCell(displayTotal, totalClass) +
      cell(expenditureValue, "amount-col " + totalClass) +
      amountCell(row.advancedGranted, totalClass) +
      amountCell(row.deposits, totalClass) +
      amountCell(row.revenueRefund, totalClass) +
      amountCell(row.otherAccounts, totalClass) +
      amountCell(row.contra, totalClass) +
      amountCell(analysisTotal(row), totalClass) +
      "</tr>";
  }

  function filterRows(rows) {
    var query = searchState.toLowerCase();
    if (!query) {
      return rows.filter(function (row) {
        return withinRange(row.date);
      });
    }
    return rows.filter(function (row) {
      if (!withinRange(row.date)) {
        return false;
      }
      return [row.date, row.name, row.particulars, row.head, row.subHead, row.revenueNumber, row.receiptNumber, row.paymentVoucherNumber]
        .join(" ")
        .toLowerCase()
        .indexOf(query) !== -1;
    });
  }

  function filterLedgerRows(rows) {
    var query = searchState.toLowerCase();
    if (!query) {
      return rows.filter(function (row) {
        return row.kind ? true : withinRange(row.date);
      });
    }
    return rows.filter(function (row) {
      return rowSearchText(row).indexOf(query) !== -1 && (row.kind ? true : withinRange(row.date));
    });
  }

  function filterCombinedRows(pairs) {
    var query = searchState.toLowerCase();
    return pairs.filter(function (pair) {
      var revenue = pair.revenue || {};
      var expenditure = pair.expenditure || {};
      var revenueText = rowSearchText(revenue);
      var expenditureText = rowSearchText(expenditure);
      var textOk = !query || revenueText.indexOf(query) !== -1 || expenditureText.indexOf(query) !== -1;
      var dateOk = (!revenue.date || withinRange(revenue.date)) || (!expenditure.date || withinRange(expenditure.date));
      return textOk && dateOk;
    });
  }

  function renderSummary(rows, type, bankNames) {
    var total = sum(rows.map(function (row) { return type === "revenue" ? totalRevenue(row, bankNames) : totalExpenditure(row, bankNames); }));
    var cash = sum(rows.map(function (row) { return row.banks.Cash || 0; }));
    var bank = total - cash;

    $("cashbook-summary").innerHTML = [
      ["Entries", rows.length.toLocaleString()],
      [type === "revenue" ? "Revenue total" : "Expenditure total", amount(total)],
      ["Cash", amount(cash)],
      [type === "revenue" ? "Bank receipts" : "Bank payments", amount(bank)]
    ].map(function (item) {
      return '<div class="cashbook-summary-card"><span>' + item[0] + '</span><strong>' + item[1] + "</strong></div>";
    }).join("");
  }

  function collectCashbookTableMatrix() {
    var table = $("cashbook-table");
    var title = document.title.replace(/\s*\|\s*LGA Finance Operations$/i, "");
    var headers = [];
    var rows = [];

    if (!table) {
      return { title: title, headers: headers, rows: rows };
    }

    table.querySelectorAll("thead th").forEach(function (cell) {
      headers.push((cell.textContent || "").trim());
    });

    table.querySelectorAll("tbody tr").forEach(function (row) {
      var cells = [];
      row.querySelectorAll("td").forEach(function (cell) {
        cells.push((cell.textContent || "").trim());
      });
      if (cells.length) {
        rows.push(cells);
      }
    });

    return { title: title, headers: headers, rows: rows };
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

  function exportCashbookToExcel() {
    var matrix = collectCashbookTableMatrix();
    var lines = [];

    if (matrix.headers.length) {
      lines.push(matrix.headers.join("\t"));
    }
    matrix.rows.forEach(function (row) {
      lines.push(row.join("\t"));
    });

    downloadTextFile(matrix.title.toLowerCase().replace(/\s+/g, "-") + ".xls", lines.join("\n"), "application/vnd.ms-excel;charset=utf-8");
    if (typeof toast === "function") {
      toast(matrix.title + " exported to Excel.", "success");
    }
  }

  function openCashbookPrintView(mode) {
    var matrix = collectCashbookTableMatrix();
    var printWindow = window.open("", "_blank", "width=1080,height=760");
    if (!printWindow) {
      if (typeof toast === "function") {
        toast("Allow pop-ups to continue with this action.", "error");
      }
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

    if (mode === "pdf" && typeof toast === "function") {
      toast("Print dialog opened. Use Save as PDF to export.", "success");
    }
  }

  function bindCashbookExports() {
    document.querySelectorAll("[data-cashbook-export]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-cashbook-export");
        if (action === "excel") {
          exportCashbookToExcel();
          return;
        }
        if (action === "pdf") {
          openCashbookPrintView("pdf");
          return;
        }
        if (action === "print") {
          openCashbookPrintView("print");
        }
      });
    });
  }

  function renderRevenueTable() {
    var bankNames = getRevenueBankNames(getBankNames());
    var ledgerRows = buildRevenueLedgerRows(bankNames);
    var rows = filterLedgerRows(ledgerRows);
    var grandRow = ledgerRows[ledgerRows.length - 1];
    var openingBalance = revenueLedgerSections.length ? rowGrandTotal({ banks: revenueLedgerSections[0].opening.banks }, bankNames) : 0;
    var revenueTotal = sum(revenueLedgerSections.map(function (section) {
      return sum(section.rows.map(function (row) { return isTransferRow(row) ? 0 : (row.revenue || 0); }));
    }));
    $("cashbook-summary").innerHTML = [
      ["Months", revenueLedgerSections.length.toLocaleString()],
      ["Opening balance", amount(openingBalance)],
      ["Revenue total", amount(revenueTotal)],
      ["B+C total", amount(rowGrandTotal(grandRow, bankNames))]
    ].map(function (item) {
      return '<div class="cashbook-summary-card"><span>' + item[0] + '</span><strong>' + item[1] + "</strong></div>";
    }).join("");
    var headers = [
      header("Date", "sticky-col"),
      header("Particulars", "particulars-col"),
      header("Department", "department-col"),
      header("Category", "category-col"),
      header("Cash")
    ]
      .concat(bankNames.map(function (name, index) {
        return header(name, "bank-col " + (index === 0 ? "group-separator" : ""));
      }))
      .concat([
        header("Cash+BANK=TOTAL"),
        header("Recon"),
        header("Expenditure Recovery"),
        header("Revenue"),
        header("Refund of Advance"),
        header("Deposits"),
        header("Other Accts"),
        header("Contra")
      ]);
    var revenueColspan = headers.length;

    $("cashbook-head").innerHTML = "<tr>" + headers.join("") + "</tr>";
    $("cashbook-body").innerHTML = rows.map(function (row) {
      return renderRevenueLedgerRow(row, bankNames);
    }).join("") || '<tr><td colspan="' + revenueColspan + '">No revenue rows match this search.</td></tr>';
    updateCount(rows.length, ledgerRows.length, bankNames);
    if ($("cashbook-table")) {
      $("cashbook-table").classList.remove("wide");
    }
  }

  function renderExpenditureTable() {
    var bankNames = getRevenueBankNames(getBankNames());
    var ledgerRows = buildExpenditureLedgerRows(bankNames);
    var rows = filterLedgerRows(ledgerRows);
    var grandRow = ledgerRows[ledgerRows.length - 1];
    var expenditureTotal = sum(expenditureLedgerSections.map(function (section) {
      return sum(section.rows.map(function (row) { return isTransferRow(row) ? 0 : (row.expenditure || 0); }));
    }));
    $("cashbook-summary").innerHTML = [
      ["Months", expenditureLedgerSections.length.toLocaleString()],
      ["Entries", expenditureRows.length.toLocaleString()],
      ["Expenditure total", amount(expenditureTotal)],
      ["B+C total", amount(rowGrandTotal(grandRow, bankNames))]
    ].map(function (item) {
      return '<div class="cashbook-summary-card"><span>' + item[0] + '</span><strong>' + item[1] + "</strong></div>";
    }).join("");
    var headers = [
      header("Date", "sticky-col"),
      header("Paid To", "name-col"),
      header("Particulars", "particulars-col"),
      header("Department", "department-col"),
      header("Category", "category-col"),
      header("Cash")
    ]
      .concat(bankNames.map(function (name, index) { return header(name, "bank-col " + (index === 0 ? "group-separator" : "")); }))
      .concat(["B+C total", "Expenditure", "Advanced Granted", "Deposits", "Revenue Refund", "Other Accounts", "Contra", "Analysis Total"].map(function (label) { return header(label); }));

    $("cashbook-table").classList.remove("wide");
    $("cashbook-head").innerHTML = "<tr>" + headers.join("") + "</tr>";
    $("cashbook-body").innerHTML = rows.map(function (row) {
      return renderExpenditureLedgerRow(row, bankNames);
    }).join("") || '<tr><td colspan="' + headers.length + '">No expenditure rows match this search.</td></tr>';
    updateCount(rows.length, ledgerRows.length, bankNames);
  }

  function renderCombinedTable() {
    var bankNames = getRevenueBankNames(getBankNames());
    var revenueLedgerRows = filterLedgerRows(buildRevenueLedgerRows(bankNames));
    var expenditureLedgerRows = filterLedgerRows(buildExpenditureLedgerRows(bankNames));
    var rowCount = Math.max(revenueLedgerRows.length, expenditureLedgerRows.length);

    var revenueTotal = sum(revenueLedgerSections.map(function (section) {
      return sum(section.rows.map(function (row) { return isTransferRow(row) ? 0 : (row.revenue || 0); }));
    }));
    var expenditureTotal = sum(expenditureLedgerSections.map(function (section) {
      return sum(section.rows.map(function (row) { return isTransferRow(row) ? 0 : (row.expenditure || 0); }));
    }));
    $("cashbook-summary").innerHTML = [
      ["Revenue rows", revenueLedgerRows.length.toLocaleString()],
      ["Expenditure rows", expenditureLedgerRows.length.toLocaleString()],
      ["Revenue total", amount(revenueTotal)],
      ["Expenditure total", amount(expenditureTotal)]
    ].map(function (item) {
      return '<div class="cashbook-summary-card"><span>' + item[0] + '</span><strong>' + item[1] + "</strong></div>";
    }).join("");

    var revenueHeaders = [
      header("Date"),
      header("Particulars", "particulars-col"),
      header("Department", "department-col"),
      header("Category", "category-col"),
      header("Cash")
    ]
      .concat(bankNames.map(function (name, index) { return header(name, "bank-col " + (index === 0 ? "group-separator" : "")); }))
      .concat([
        header("B+C Total"),
        header("Recon"),
        header("Expenditure Recovery"),
        header("Revenue"),
        header("Refund of Advance"),
        header("Deposits"),
        header("Other Accts"),
        header("Contra")
      ]);

    var expenditureHeaders = [
      header("Date", "group-separator"),
      header("Paid To", "name-col"),
      header("Particulars", "particulars-col"),
      header("Department", "department-col"),
      header("Category", "category-col"),
      header("Cash")
    ]
      .concat(bankNames.map(function (name) { return header(name, "bank-col"); }))
      .concat([
        header("B+C Total"),
        header("Expenditure"),
        header("Advanced Granted"),
        header("Deposits"),
        header("Revenue Refund"),
        header("Other Accounts"),
        header("Contra"),
        header("Analysis Total")
      ]);

    $("cashbook-table").classList.add("wide");
    $("cashbook-head").innerHTML =
      '<tr class="cashbook-section-row">' +
        '<th class="cashbook-section-title" colspan="' + revenueHeaders.length + '">REVENUE</th>' +
        '<th class="cashbook-section-title" colspan="' + expenditureHeaders.length + '">EXPENDITURE</th>' +
      '</tr>' +
      "<tr>" + revenueHeaders.concat(expenditureHeaders).join("") + "</tr>";
    $("cashbook-body").innerHTML = Array.from({ length: rowCount }).map(function (_, index) {
      var r = revenueLedgerRows[index] || {};
      var p = expenditureLedgerRows[index] || {};
      var hasRevenueRow = Boolean(r.date);
      var hasExpenditureRow = Boolean(p.date);
      var revenueValue = isTransferRow(r) ? "-" : amount(r.revenue);
      var expenditureValue = isTransferRow(p) ? "-" : amount(p.expenditure);
      return "<tr>" +
        cell(hasRevenueRow ? formatCashbookDate(r.date) : "") +
        (hasRevenueRow ? codeCell(displayParticulars(r), sampleParticularsCode(r), "particulars-col") : cell("", "particulars-col")) +
        (hasRevenueRow ? codeCell(r.departmentLabel || r.name || "-", sampleDepartmentCode(r), "department-col") : cell("", "department-col")) +
        (hasRevenueRow ? codeCell(r.categoryLabel || r.name || "-", sampleCategoryCode(r), "category-col") : cell("", "category-col")) +
        amountCell(hasRevenueRow ? (r.banks && r.banks.Cash) : "") +
        bankNames.map(function (name, bankIndex) { return amountCell(hasRevenueRow ? (r.banks && r.banks[name]) : "", bankIndex === 0 ? "group-separator" : ""); }).join("") +
        amountCell(hasRevenueRow ? rowGrandTotal(r, bankNames) : "") +
        cell(hasRevenueRow ? (r.recon || "") : "") +
        amountCell(hasRevenueRow ? r.expenditureRecovery : "") +
        cell(hasRevenueRow ? revenueValue : "", "amount-col") +
        amountCell(hasRevenueRow ? (r.refundOfAdvance || r.advancedRetired) : "") +
        amountCell(hasRevenueRow ? r.deposit : "") +
        amountCell(hasRevenueRow ? r.otherAccounts : "") +
        amountCell(hasRevenueRow ? r.contra : "") +
        cell(hasExpenditureRow ? formatCashbookDate(p.date) : "", "group-separator") +
        cell(hasExpenditureRow ? p.name : "", "name-col") +
        (hasExpenditureRow ? codeCell(displayParticulars(p), sampleParticularsCode(p), "particulars-col") : cell("", "particulars-col")) +
        (hasExpenditureRow ? codeCell(p.departmentLabel || p.head || p.name || "-", sampleDepartmentCode(p), "department-col") : cell("", "department-col")) +
        (hasExpenditureRow ? codeCell(p.categoryLabel || p.subHead || p.name || "-", sampleCategoryCode(p), "category-col") : cell("", "category-col")) +
        amountCell(hasExpenditureRow ? (p.banks && p.banks.Cash) : "") +
        bankNames.map(function (name) { return amountCell(hasExpenditureRow ? (p.banks && p.banks[name]) : ""); }).join("") +
        amountCell(hasExpenditureRow ? rowGrandTotal(p, bankNames) : "") +
        cell(hasExpenditureRow ? expenditureValue : "", "amount-col") +
        amountCell(hasExpenditureRow ? p.advancedGranted : "") +
        amountCell(hasExpenditureRow ? p.deposits : "") +
        amountCell(hasExpenditureRow ? p.revenueRefund : "") +
        amountCell(hasExpenditureRow ? p.otherAccounts : "") +
        amountCell(hasExpenditureRow ? p.contra : "") +
        amountCell(hasExpenditureRow ? analysisTotal(p) : "") +
        "</tr>";
    }).join("") || '<tr><td colspan="' + (25 + (bankNames.length * 2)) + '">No combined rows match this search.</td></tr>';
    updateCount(rowCount, rowCount, bankNames);
  }

  function updateCount(visible, total, bankNames) {
    if ($("cashbook-count")) {
      $("cashbook-count").textContent = visible.toLocaleString() + " of " + total.toLocaleString() + " records";
    }
    if ($("cashbook-bank-source")) {
      $("cashbook-bank-source").textContent = "Bank columns: " + bankNames.join(", ");
    }
  }

  function bindSearch(render) {
    var input = $("cashbook-search");
    if (input) {
      input.addEventListener("input", function () {
        searchState = input.value.trim();
        render();
      });
    }
    if ($("cashbook-start-date")) {
      $("cashbook-start-date").addEventListener("change", function () {
        rangeState.start = $("cashbook-start-date").value;
        syncRangeChip();
        render();
      });
    }
    if ($("cashbook-end-date")) {
      $("cashbook-end-date").addEventListener("change", function () {
        rangeState.end = $("cashbook-end-date").value;
        syncRangeChip();
        render();
      });
    }
  }

  function init() {
    var page = document.body.getAttribute("data-cashbook-page");
    var render = page === "expenditure" ? renderExpenditureTable : page === "combined" ? renderCombinedTable : renderRevenueTable;
    var defaultRange = page === "expenditure" ? dateRangeFromRows(expenditureRows) : page === "combined" ? dateRangeFromRows(revenueRows.concat(expenditureRows)) : dateRangeFromRows(revenueRows);
    setDefaultRange(defaultRange.start, defaultRange.end);
    bindSearch(render);
    bindCashbookExports();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

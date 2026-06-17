(function () {
  var BUDGET_YEARS_STORE = "budget-admin-years";
  var REPORT_YEARS = ["2023", "2024", "2025", "2026"];

  var reportMeta = {
    scfpr: {
      label: "SCFPR",
      title: "Statement of Consolidated Financial Performance",
      period: "For the year ended 31st December"
    },
    scfpo: {
      label: "SCFPO",
      title: "Statement of Consolidated Financial Position",
      period: "For the period ended 31st December"
    },
    scfc: {
      label: "SCFC",
      title: "Statement of Consolidated Cash Flow",
      period: "For the year ended 31st December"
    },
    sccn: {
      label: "SCCN",
      title: "Statement of Consolidated Changes in Net Assets",
      period: "For the year ended 31st December"
    }
  };

  var baseData = {
    revenue: [
      ["Statutory Allocation", "110101", "1", 1631745445.79, 4223187003.50],
      ["Share of VAT Allocation", "110102", "1", 2230535157.14, 400000000.00],
      ["Sure-P", "110103", "", 0, 0],
      ["Goods & Value Consideration", "", "1", 139566918.93, 0],
      ["Share of State IGR", "110104", "2", 309631030.71, 550000000.00],
      ["State Augmentation of Pry. Sch. Teachers Salary", "140100", "2", 20347524.96, 0],
      ["Non Tax Revenue", "120201-07", "3", 18310472.02, 102550000.00],
      ["Other Revenue", "14070102", "3", 3019381.84, 4794186290.37]
    ],
    expenditure: [
      ["Salaries & Wages", "210101", "4", 1694627679.65, 2188323294.22],
      ["Social Contributions", "210202", "6", 205934049.89, 400000000.00],
      ["Overhead Cost", "22020", "5", 1306275706.48, 1616600000.00],
      ["Transfer to other Govt. Entities", "", "7", 41786606.61, 0],
      ["Depreciation Charges", "230601", "Appendix B", 64936215.58, 0],
      ["Financial Cost", "220603", "9", 276415860.38, 0],
      ["Impairment Cost", "", "", 0, 0],
      ["Bad Debts (waiver on advances)", "", "", 0, 0]
    ],
    positionAssets: [
      ["Cash and its Equivalents", "310101", "10", 120244162.34],
      ["Receivable", "310601", "10", 615033047.26],
      ["Prepayments (Advances)", "310602", "10", 305151520.31],
      ["Inventories", "310502", "", 3953535.80]
    ],
    nonCurrentAssets: [
      ["Long term loans", "", "", 0],
      ["Investments", "310901", "", 3938655.84],
      ["Property, Plant & Equipment", "320101", "10", 13875348446.15]
    ],
    liabilities: [
      ["Deposit", "410101", "Appendix B", 2306162.82],
      ["Deposits (Unremitted Deductions)", "410101", "", 0],
      ["Accrued Expenses", "410401", "11", 470500.00]
    ],
    nonCurrentLiabilities: [
      ["Term Loan", "420301", "11", 1008804285.71],
      ["Long Term Borrowings", "", "", 0],
      ["Long Term Provisions", "", "", 0]
    ]
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

  function currentYear() {
    return String(new Date().getFullYear());
  }

  function yearFactor(year) {
    var diff = Number(year) - 2024;
    return Math.pow(1.072, diff);
  }

  function valueForYear(value, year) {
    return Number(value || 0) * yearFactor(year);
  }

  function priorYear(year) {
    return String(Number(year) - 1);
  }

  function fmt(value) {
    var number = Number(value || 0);
    var abs = Math.abs(number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return number < 0 ? "(" + abs + ")" : abs;
  }

  function pct(actual, budget) {
    if (!Number(budget || 0)) {
      return Number(actual || 0) ? "100.00%" : "0.00%";
    }
    return ((Number(actual || 0) / Number(budget || 0)) * 100).toFixed(2) + "%";
  }

  function sumRows(rows, year, index) {
    return rows.reduce(function (total, row) {
      return total + valueForYear(row[index], year);
    }, 0);
  }

  function getYears() {
    var stored = read(BUDGET_YEARS_STORE, []).map(function (item) {
      return String(item && item.year ? item.year : "");
    }).filter(Boolean);
    var map = {};
    REPORT_YEARS.concat(stored).forEach(function (year) {
      map[year] = true;
    });
    return Object.keys(map).sort();
  }

  function cell(value, className) {
    return '<td class="' + (className || "") + '">' + value + "</td>";
  }

  function numberCell(value) {
    return cell(fmt(value), "number-cell");
  }

  function textCell(value, className) {
    return cell(String(value || ""), className || "");
  }

  function sectionRow(label, colSpan) {
    return '<tr class="section-row"><td colspan="' + colSpan + '">' + label + "</td></tr>";
  }

  function totalRow(label, values) {
    return '<tr class="total-row">' + textCell(label, "label-cell") + values.map(numberCell).join("") + "</tr>";
  }

  function renderPerformance(year) {
    var previous = priorYear(year);
    var revenueRows = baseData.revenue.map(function (row) {
      var current = valueForYear(row[3], year);
      var budget = valueForYear(row[4], year);
      var previousActual = valueForYear(row[3], previous);
      return '<tr>' +
        numberCell(previousActual) +
        textCell(row[0], "label-cell") +
        textCell(row[1], "center-cell") +
        textCell(row[2], "center-cell") +
        numberCell(current) +
        numberCell(budget) +
        numberCell(current - budget) +
      "</tr>";
    }).join("");
    var expenseRows = baseData.expenditure.map(function (row) {
      var current = valueForYear(row[3], year);
      var budget = valueForYear(row[4], year);
      var previousActual = valueForYear(row[3], previous);
      return '<tr>' +
        numberCell(previousActual) +
        textCell(row[0], "label-cell") +
        textCell(row[1], "center-cell") +
        textCell(row[2], "center-cell") +
        numberCell(current) +
        numberCell(budget) +
        numberCell(budget - current) +
      "</tr>";
    }).join("");
    var revenue = sumRows(baseData.revenue, year, 3);
    var revenueBudget = sumRows(baseData.revenue, year, 4);
    var expenditure = sumRows(baseData.expenditure, year, 3);
    var expenditureBudget = sumRows(baseData.expenditure, year, 4);
    var priorRevenue = sumRows(baseData.revenue, previous, 3);
    var priorExpense = sumRows(baseData.expenditure, previous, 3);

    return '<thead><tr><th>Actual ' + previous + '</th><th>Classification</th><th>NCOA Code</th><th>Note</th><th>Actual ' + year + '</th><th>Final Budget ' + year + '</th><th>Variance on Final Budget ' + year + '</th></tr></thead>' +
      '<tbody>' +
        sectionRow("Revenue", 7) +
        revenueRows +
        '<tr class="total-row">' + numberCell(priorRevenue) + textCell("Total Revenue", "label-cell") + textCell("") + textCell("") + numberCell(revenue) + numberCell(revenueBudget) + numberCell(revenue - revenueBudget) + "</tr>" +
        sectionRow("Expenditure", 7) +
        expenseRows +
        '<tr class="total-row">' + numberCell(priorExpense) + textCell("Total Expenditure", "label-cell") + textCell("") + textCell("") + numberCell(expenditure) + numberCell(expenditureBudget) + numberCell(expenditureBudget - expenditure) + "</tr>" +
        '<tr class="grand-row">' + numberCell(priorRevenue - priorExpense) + textCell("Net Surplus/Deficit for the period", "label-cell") + textCell("") + textCell("") + numberCell(revenue - expenditure) + numberCell(revenueBudget - expenditureBudget) + numberCell((revenue - expenditure) - (revenueBudget - expenditureBudget)) + "</tr>" +
      "</tbody>";
  }

  function renderPosition(year) {
    var previous = priorYear(year);
    function rowMarkup(row) {
      return '<tr>' + textCell(row[0], "label-cell") + textCell(row[1], "center-cell") + textCell(row[2], "center-cell") + numberCell(valueForYear(row[3], year)) + numberCell(valueForYear(row[3], previous)) + "</tr>";
    }
    var currentAssets = sumRows(baseData.positionAssets, year, 3);
    var priorCurrentAssets = sumRows(baseData.positionAssets, previous, 3);
    var nonCurrentAssets = sumRows(baseData.nonCurrentAssets, year, 3);
    var priorNonCurrentAssets = sumRows(baseData.nonCurrentAssets, previous, 3);
    var liabilities = sumRows(baseData.liabilities, year, 3);
    var priorLiabilities = sumRows(baseData.liabilities, previous, 3);
    var nonCurrentLiabilities = sumRows(baseData.nonCurrentLiabilities, year, 3);
    var priorNonCurrentLiabilities = sumRows(baseData.nonCurrentLiabilities, previous, 3);
    var totalAssets = currentAssets + nonCurrentAssets;
    var priorAssets = priorCurrentAssets + priorNonCurrentAssets;
    var totalLiabilities = liabilities + nonCurrentLiabilities;
    var priorTotalLiabilities = priorLiabilities + priorNonCurrentLiabilities;
    var netAssets = totalAssets - totalLiabilities;
    var priorNetAssets = priorAssets - priorTotalLiabilities;
    var reserves = netAssets * 0.09;
    var priorReserves = priorNetAssets * 0.04;

    return '<thead><tr><th>Assets</th><th>NCOA Code</th><th>Notes</th><th>Actual ' + year + '</th><th>Actual ' + previous + '</th></tr></thead>' +
      '<tbody>' +
        sectionRow("Current Assets", 5) +
        baseData.positionAssets.map(rowMarkup).join("") +
        '<tr class="total-row">' + textCell("Total Current Asset (A)", "label-cell") + textCell("") + textCell("") + numberCell(currentAssets) + numberCell(priorCurrentAssets) + "</tr>" +
        sectionRow("Non-Current Assets", 5) +
        baseData.nonCurrentAssets.map(rowMarkup).join("") +
        '<tr class="total-row">' + textCell("Total Non-Current Assets (B)", "label-cell") + textCell("") + textCell("") + numberCell(nonCurrentAssets) + numberCell(priorNonCurrentAssets) + "</tr>" +
        '<tr class="grand-row">' + textCell("Total Assets", "label-cell") + textCell("") + textCell("") + numberCell(totalAssets) + numberCell(priorAssets) + "</tr>" +
        sectionRow("Liabilities", 5) +
        sectionRow("Current Liabilities", 5) +
        baseData.liabilities.map(rowMarkup).join("") +
        '<tr class="total-row">' + textCell("Total Current Liabilities (D)", "label-cell") + textCell("") + textCell("") + numberCell(liabilities) + numberCell(priorLiabilities) + "</tr>" +
        sectionRow("Non-Current Liabilities (E)", 5) +
        baseData.nonCurrentLiabilities.map(rowMarkup).join("") +
        '<tr class="total-row">' + textCell("Total Non-Current Liabilities (E)", "label-cell") + textCell("") + textCell("") + numberCell(nonCurrentLiabilities) + numberCell(priorNonCurrentLiabilities) + "</tr>" +
        '<tr class="total-row">' + textCell("Total Liabilities F=D+E", "label-cell") + textCell("") + textCell("") + numberCell(totalLiabilities) + numberCell(priorTotalLiabilities) + "</tr>" +
        '<tr class="grand-row">' + textCell("Net Assets G=C-F", "label-cell") + textCell("") + textCell("") + numberCell(netAssets) + numberCell(priorNetAssets) + "</tr>" +
        sectionRow("Net Assets/Equity", 5) +
        '<tr>' + textCell("Reserves", "label-cell") + textCell("") + textCell("12", "center-cell") + numberCell(reserves) + numberCell(priorReserves) + "</tr>" +
        '<tr>' + textCell("Accumulated surpluses/(deficits)", "label-cell") + textCell("") + textCell("12", "center-cell") + numberCell(netAssets - reserves) + numberCell(priorNetAssets - priorReserves) + "</tr>" +
        '<tr class="grand-row">' + textCell("Total Net Assets/Equity", "label-cell") + textCell("") + textCell("") + numberCell(netAssets) + numberCell(priorNetAssets) + "</tr>" +
      "</tbody>";
  }

  function renderCashFlow(year) {
    var previous = priorYear(year);
    var inflow = sumRows(baseData.revenue, year, 3);
    var priorInflow = sumRows(baseData.revenue, previous, 3);
    var outflow = sumRows(baseData.expenditure, year, 3);
    var priorOutflow = sumRows(baseData.expenditure, previous, 3);
    var investing = -valueForYear(327820138.41, year);
    var priorInvesting = -valueForYear(559095708.13, previous);
    var financing = -valueForYear(180224850.43, year);
    var priorFinancing = valueForYear(1185078923.42, previous);
    var opening = valueForYear(41811793.92, previous);
    var priorOpening = valueForYear(121297471.84, Number(previous) - 1);
    var net = inflow - outflow + investing + financing;
    var priorNet = priorInflow - priorOutflow + priorInvesting + priorFinancing;

    function flowRow(row) {
      return '<tr>' + textCell(row[1], "center-cell") + textCell(row[0], "label-cell") + textCell(row[2], "center-cell") + numberCell(valueForYear(row[3], year)) + numberCell(valueForYear(row[3], previous)) + "</tr>";
    }

    return '<thead><tr><th>NCOA</th><th>Description</th><th>Notes</th><th>Actual ' + year + '</th><th>Actual ' + previous + '</th></tr></thead>' +
      '<tbody>' +
        sectionRow("Cash Flow from Operating Activities", 5) +
        sectionRow("Inflows", 5) +
        baseData.revenue.map(flowRow).join("") +
        '<tr class="total-row">' + textCell("") + textCell("Total Inflow from Operating Activities", "label-cell") + textCell("") + numberCell(inflow) + numberCell(priorInflow) + "</tr>" +
        sectionRow("Outflow", 5) +
        baseData.expenditure.map(flowRow).join("") +
        '<tr class="total-row">' + textCell("") + textCell("Total Outflow", "label-cell") + textCell("") + numberCell(outflow) + numberCell(priorOutflow) + "</tr>" +
        '<tr class="grand-row">' + textCell("") + textCell("Net Cash Flow from Operating Activities", "label-cell") + textCell("") + numberCell(inflow - outflow) + numberCell(priorInflow - priorOutflow) + "</tr>" +
        sectionRow("Cash Flow from Investment Activities", 5) +
        '<tr>' + textCell("230101", "center-cell") + textCell("Purchase of PPE (Capital)", "label-cell") + textCell("8", "center-cell") + numberCell(investing) + numberCell(priorInvesting) + "</tr>" +
        '<tr class="grand-row">' + textCell("") + textCell("Net Cash Flow from Investing Activities", "label-cell") + textCell("") + numberCell(investing) + numberCell(priorInvesting) + "</tr>" +
        sectionRow("Cash Flow from Financing Activities", 5) +
        '<tr>' + textCell("410301", "center-cell") + textCell("Loan Repayment (Principal)", "label-cell") + textCell("9", "center-cell") + numberCell(financing) + numberCell(priorFinancing) + "</tr>" +
        '<tr class="grand-row">' + textCell("") + textCell("Net Cash Flow from Financing Activities", "label-cell") + textCell("") + numberCell(financing) + numberCell(priorFinancing) + "</tr>" +
        '<tr class="grand-row">' + textCell("") + textCell("Net Cash Flow from All Activities", "label-cell") + textCell("") + numberCell(net) + numberCell(priorNet) + "</tr>" +
        '<tr>' + textCell("") + textCell("Cash & Its Equivalent as @ 1/1/" + year, "label-cell") + textCell("") + numberCell(opening) + numberCell(priorOpening) + "</tr>" +
        '<tr class="grand-row">' + textCell("") + textCell("Closing Cash/Cash Equivalent @ 31/12/" + year, "label-cell") + textCell("10", "center-cell") + numberCell(opening + net) + numberCell(priorOpening + priorNet) + "</tr>" +
      "</tbody>";
  }

  function renderChanges(year) {
    var previous = priorYear(year);
    var opening = sumRows(baseData.positionAssets, previous, 3) - sumRows(baseData.liabilities, previous, 3) - sumRows(baseData.nonCurrentLiabilities, previous, 3);
    var surplus = sumRows(baseData.revenue, year, 3) - sumRows(baseData.expenditure, year, 3);
    var reserves = valueForYear(1244334592.14, year);
    var adjustments = valueForYear(186500000, year);
    var closing = opening + surplus + reserves + adjustments;

    return '<thead><tr><th>Description</th><th>Accumulated Surplus</th><th>Reserves</th><th>Adjustments</th><th>Total Net Assets ' + year + '</th></tr></thead>' +
      '<tbody>' +
        '<tr>' + textCell("Balance as at 1 January " + year, "label-cell") + numberCell(opening) + numberCell(valueForYear(481154779.34, previous)) + numberCell(0) + numberCell(opening + valueForYear(481154779.34, previous)) + "</tr>" +
        '<tr>' + textCell("Surplus/(deficit) for the period", "label-cell") + numberCell(surplus) + numberCell(0) + numberCell(0) + numberCell(surplus) + "</tr>" +
        '<tr>' + textCell("Transfers to reserves", "label-cell") + numberCell(-reserves) + numberCell(reserves) + numberCell(0) + numberCell(0) + "</tr>" +
        '<tr>' + textCell("Prior year adjustments", "label-cell") + numberCell(0) + numberCell(0) + numberCell(adjustments) + numberCell(adjustments) + "</tr>" +
        '<tr class="grand-row">' + textCell("Balance as at 31 December " + year, "label-cell") + numberCell(opening + surplus - reserves) + numberCell(reserves + valueForYear(481154779.34, previous)) + numberCell(adjustments) + numberCell(closing) + "</tr>" +
      "</tbody>";
  }

  function renderBudgetPerformance(year) {
    var rows = baseData.revenue.concat(baseData.expenditure).map(function (row) {
      var actual = valueForYear(row[3], year);
      var budget = valueForYear(row[4], year);
      return '<tr>' + textCell(row[0], "label-cell") + numberCell(budget) + numberCell(actual) + textCell(pct(actual, budget), "number-cell") + "</tr>";
    }).join("");
    var revenue = sumRows(baseData.revenue, year, 3);
    var revenueBudget = sumRows(baseData.revenue, year, 4);
    var expenditure = sumRows(baseData.expenditure, year, 3);
    var expenditureBudget = sumRows(baseData.expenditure, year, 4);
    return '<thead><tr><th>Description</th><th>Approved Estimates ' + year + '</th><th>Actual Revenue & Expenditure ' + year + '</th><th>Budget Performance ' + year + '</th></tr></thead>' +
      '<tbody>' +
        sectionRow("Revenue", 4) +
        rows +
        '<tr class="total-row">' + textCell("Aggregate Revenue (A)", "label-cell") + numberCell(revenueBudget) + numberCell(revenue) + textCell(pct(revenue, revenueBudget), "number-cell") + "</tr>" +
        '<tr class="total-row">' + textCell("Aggregate Recurrent Expenditure (B)", "label-cell") + numberCell(expenditureBudget) + numberCell(expenditure) + textCell(pct(expenditure, expenditureBudget), "number-cell") + "</tr>" +
        '<tr class="grand-row">' + textCell("Total Expenditure", "label-cell") + numberCell(expenditureBudget) + numberCell(expenditure) + textCell(pct(expenditure, expenditureBudget), "number-cell") + "</tr>" +
      "</tbody>";
  }

  function renderTable(type, year) {
    if (type === "scfpo") return renderPosition(year);
    if (type === "scfc") return renderCashFlow(year);
    if (type === "sccn") return renderChanges(year);
    return renderPerformance(year);
  }

  function downloadTextFile(filename, content) {
    var blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8" });
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

  function exportTable(type, year) {
    var table = $("report-table");
    if (!table) return;
    var lines = [];
    table.querySelectorAll("tr").forEach(function (row) {
      lines.push(Array.from(row.children).map(function (cellNode) {
        return (cellNode.textContent || "").trim();
      }).join("\t"));
    });
    downloadTextFile(type + "-" + year + ".xls", lines.join("\n"));
  }

  function renderReport() {
    var type = document.body.getAttribute("data-report-type") || "scfpr";
    var meta = reportMeta[type] || reportMeta.scfpr;
    var year = $("report-year") ? $("report-year").value : currentYear();
    var years = getYears();
    if (!year || years.indexOf(year) === -1) {
      year = years.indexOf(currentYear()) !== -1 ? currentYear() : years[years.length - 1];
    }

    if ($("report-year")) {
      $("report-year").innerHTML = years.map(function (item) {
        return '<option value="' + item + '"' + (item === year ? " selected" : "") + ">" + item + "</option>";
      }).join("");
      $("report-year").value = year;
    }
    if ($("report-title")) {
      $("report-title").textContent = meta.title;
    }
    if ($("report-period")) {
      $("report-period").textContent = meta.period + ", " + year;
    }
    if ($("report-code")) {
      $("report-code").textContent = meta.label;
    }
    if ($("report-table")) {
      $("report-table").innerHTML = renderTable(type, year);
    }
  }

  function init() {
    renderReport();
    if ($("report-year")) {
      $("report-year").addEventListener("change", renderReport);
    }
    document.querySelectorAll("[data-report-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-report-action");
        var type = document.body.getAttribute("data-report-type") || "scfpr";
        var year = $("report-year") ? $("report-year").value : currentYear();
        if (action === "print" || action === "pdf") {
          window.print();
          return;
        }
        exportTable(type, year);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

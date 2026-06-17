(function () {
  var LEDGER_STORE = "ledger-dvea-records";
  var REVENUE_LEDGER_STORE = "ledger-dvra-records";
  var ADVANCE_LEDGER_STORE = "ledger-advance-records";
  var BUDGET_DEPARTMENTS_STORE = "budget-admin-departments";
  var BUDGET_YEARS_STORE = "budget-admin-years";
  var LGA_INSTANCE_KEY = "lga-instance-selection";
  var STATE_INSTANCE_KEY = "lga-state-instance";
  var CURRENT_NAME = "Tamuno Briggs";

  var seedLedgerRecords = [
    {
      id: "ledger-health-capital",
      departmentId: "dept-health",
      departmentName: "Health",
      headCode: "HEAD:01-10-002-001-00",
      categoryName: "Primary Health Capital",
      estimate: 42000000,
      entries: [
        { date: "2025-02-28", pvNo: "PV 07/FEB/2025", particulars: "Primary health centre renovation", amount: 18500000 },
        { date: "2025-04-30", pvNo: "PV 19/APR/2025", particulars: "Rural clinic equipment", amount: 9600000 },
        { date: "2025-06-30", pvNo: "PV 11/JUN/2025", particulars: "Medical outreach and support services", amount: 7800000 },
        { date: "2025-08-31", pvNo: "PV 05/AUG/2025", particulars: "Essential medicines and consumables", amount: 4200000 }
      ]
    },
    {
      id: "ledger-health-community",
      departmentId: "dept-health",
      departmentName: "Health",
      headCode: "HEAD:01-10-002-002-00",
      categoryName: "Community Support",
      estimate: 8500000,
      entries: [
        { date: "2025-03-15", pvNo: "PV 14/MAR/2025", particulars: "Ward health outreach", amount: 1500000 },
        { date: "2025-05-18", pvNo: "PV 26/MAY/2025", particulars: "Maternal support clinic drive", amount: 2100000 },
        { date: "2025-07-21", pvNo: "PV 09/JUL/2025", particulars: "Community immunization support", amount: 2450000 }
      ]
    },
    {
      id: "ledger-health-outreach",
      departmentId: "dept-health",
      departmentName: "Health",
      headCode: "HEAD:01-10-002-003-00",
      categoryName: "Public Health Outreach",
      estimate: 12800000,
      entries: [
        { date: "2025-02-10", pvNo: "PV 03/FEB/2025", particulars: "Medical outreach campaign", amount: 3200000 },
        { date: "2025-04-12", pvNo: "PV 18/APR/2025", particulars: "Essential medicines and consumables", amount: 4100000 },
        { date: "2025-07-14", pvNo: "PV 27/JUL/2025", particulars: "Community sensitization and screening", amount: 2900000 }
      ]
    },
    {
      id: "ledger-works-roads",
      departmentId: "dept-works",
      departmentName: "Works",
      headCode: "HEAD:01-11-001-001-00",
      categoryName: "Road Maintenance",
      estimate: 78000000,
      entries: [
        { date: "2025-02-28", pvNo: "PV 15/FEB/2025", particulars: "Township road repairs", amount: 18500000 },
        { date: "2025-04-30", pvNo: "PV 31/APR/2025", particulars: "Drainage desilting works", amount: 12400000 },
        { date: "2025-06-30", pvNo: "PV 17/JUN/2025", particulars: "Road patching and resurfacing", amount: 21900000 },
        { date: "2025-09-30", pvNo: "PV 44/SEP/2025", particulars: "Bridge approach rehabilitation", amount: 15600000 }
      ]
    },
    {
      id: "ledger-works-support",
      departmentId: "dept-works",
      departmentName: "Works",
      headCode: "HEAD:01-11-001-002-00",
      categoryName: "Community Support",
      estimate: 12400000,
      entries: [
        { date: "2025-03-11", pvNo: "PV 21/MAR/2025", particulars: "Community engineering liaison", amount: 2400000 },
        { date: "2025-05-09", pvNo: "PV 08/MAY/2025", particulars: "Local contractor mobilization", amount: 3100000 },
        { date: "2025-08-16", pvNo: "PV 12/AUG/2025", particulars: "Ward infrastructure supervision", amount: 1800000 }
      ]
    },
    {
      id: "ledger-works-maintenance",
      departmentId: "dept-works",
      departmentName: "Works",
      headCode: "HEAD:01-11-001-003-00",
      categoryName: "Infrastructure Maintenance",
      estimate: 21400000,
      entries: [
        { date: "2025-02-22", pvNo: "PV 13/FEB/2025", particulars: "Street lighting maintenance", amount: 4100000 },
        { date: "2025-05-27", pvNo: "PV 34/MAY/2025", particulars: "Bridge inspection and repairs", amount: 6700000 },
        { date: "2025-09-18", pvNo: "PV 51/SEP/2025", particulars: "Drainage channel clearing", amount: 5300000 }
      ]
    },
    {
      id: "ledger-education-grants",
      departmentId: "dept-education",
      departmentName: "Education",
      headCode: "HEAD:01-12-004-001-00",
      categoryName: "Education Grants",
      estimate: 35000000,
      entries: [
        { date: "2025-01-29", pvNo: "PV 04/JAN/2025", particulars: "School support grants", amount: 8200000 },
        { date: "2025-03-31", pvNo: "PV 18/MAR/2025", particulars: "Learning materials distribution", amount: 7400000 },
        { date: "2025-06-28", pvNo: "PV 27/JUN/2025", particulars: "Teacher development support", amount: 9300000 },
        { date: "2025-08-30", pvNo: "PV 39/AUG/2025", particulars: "Examination logistics support", amount: 6100000 }
      ]
    },
    {
      id: "ledger-education-admin",
      departmentId: "dept-education",
      departmentName: "Education",
      headCode: "HEAD:01-12-004-002-00",
      categoryName: "Administrative Services",
      estimate: 6200000,
      entries: [
        { date: "2025-02-20", pvNo: "PV 09/FEB/2025", particulars: "Education office logistics", amount: 1250000 },
        { date: "2025-05-22", pvNo: "PV 29/MAY/2025", particulars: "Records and registry support", amount: 1800000 },
        { date: "2025-07-25", pvNo: "PV 41/JUL/2025", particulars: "Policy and monitoring support", amount: 1450000 }
      ]
    },
    {
      id: "ledger-education-training",
      departmentId: "dept-education",
      departmentName: "Education",
      headCode: "HEAD:01-12-004-003-00",
      categoryName: "Training and Capacity Building",
      estimate: 9600000,
      entries: [
        { date: "2025-03-08", pvNo: "PV 12/MAR/2025", particulars: "Teacher development workshop", amount: 2600000 },
        { date: "2025-06-15", pvNo: "PV 24/JUN/2025", particulars: "Examination logistics support", amount: 2100000 },
        { date: "2025-08-27", pvNo: "PV 38/AUG/2025", particulars: "School monitoring and training", amount: 2800000 }
      ]
    },
    {
      id: "ledger-finance-admin",
      departmentId: "dept-finance",
      departmentName: "Finance",
      headCode: "HEAD:01-13-003-001-00",
      categoryName: "Administrative Services",
      estimate: 6200000,
      entries: [
        { date: "2025-01-20", pvNo: "PV 6/JAN/2025", particulars: "Audit coordination", amount: 240000 },
        { date: "2025-02-17", pvNo: "PV 28/FEB/2025", particulars: "Bank reconciliation support", amount: 180000 },
        { date: "2025-03-25", pvNo: "PV 51/MAR/2025", particulars: "Treasury office logistics", amount: 275000 },
        { date: "2025-04-28", pvNo: "PV 14/APR/2025", particulars: "Revenue control support", amount: 195000 },
        { date: "2025-06-30", pvNo: "PV 23/JUN/2025", particulars: "Financial reporting support", amount: 310000 }
      ]
    },
    {
      id: "ledger-finance-control",
      departmentId: "dept-finance",
      departmentName: "Finance",
      headCode: "HEAD:01-13-003-002-00",
      categoryName: "Revenue Control and Treasury Services",
      estimate: 7400000,
      entries: [
        { date: "2025-02-12", pvNo: "PV 08/FEB/2025", particulars: "Revenue monitoring support", amount: 1200000 },
        { date: "2025-04-19", pvNo: "PV 22/APR/2025", particulars: "Audit and treasury coordination", amount: 1850000 },
        { date: "2025-07-29", pvNo: "PV 36/JUL/2025", particulars: "Bank reconciliation oversight", amount: 1400000 }
      ]
    }
  ];

  var seedRevenueLedgerRecords = [
    {
      id: "dvra-health-fees",
      departmentId: "dept-health",
      departmentName: "Health",
      headCode: "REV:01-10-002-001-00",
      categoryName: "Clinic Fees and Services",
      estimate: 18200000,
      entries: [
        { date: "2025-02-05", pvNo: "RV 02/FEB/2025", particulars: "Clinic registration fees", amount: 4200000 },
        { date: "2025-04-17", pvNo: "RV 16/APR/2025", particulars: "Medical report charges", amount: 3100000 },
        { date: "2025-07-08", pvNo: "RV 21/JUL/2025", particulars: "Outreach service charges", amount: 2800000 },
        { date: "2025-10-03", pvNo: "RV 44/OCT/2025", particulars: "Specialist consultation fees", amount: 2400000 }
      ]
    },
    {
      id: "dvra-health-grants",
      departmentId: "dept-health",
      departmentName: "Health",
      headCode: "REV:01-10-002-002-00",
      categoryName: "Health Grants and Donations",
      estimate: 24600000,
      entries: [
        { date: "2025-01-22", pvNo: "RV 01/JAN/2025", particulars: "Donor health intervention", amount: 5600000 },
        { date: "2025-03-29", pvNo: "RV 12/MAR/2025", particulars: "State support grant", amount: 6400000 },
        { date: "2025-06-12", pvNo: "RV 27/JUN/2025", particulars: "Partner outreach funds", amount: 5100000 },
        { date: "2025-09-18", pvNo: "RV 38/SEP/2025", particulars: "Community health sponsorship", amount: 3900000 }
      ]
    },
    {
      id: "dvra-works-levies",
      departmentId: "dept-works",
      departmentName: "Works",
      headCode: "REV:01-11-001-001-00",
      categoryName: "Inspection Levies",
      estimate: 31800000,
      entries: [
        { date: "2025-02-14", pvNo: "RV 04/FEB/2025", particulars: "Building inspection levy", amount: 7100000 },
        { date: "2025-05-10", pvNo: "RV 19/MAY/2025", particulars: "Construction permit levy", amount: 8900000 },
        { date: "2025-08-11", pvNo: "RV 33/AUG/2025", particulars: "Development compliance levy", amount: 7600000 },
        { date: "2025-11-06", pvNo: "RV 50/NOV/2025", particulars: "Road usage levy", amount: 5400000 }
      ]
    },
    {
      id: "dvra-works-rentals",
      departmentId: "dept-works",
      departmentName: "Works",
      headCode: "REV:01-11-001-002-00",
      categoryName: "Plant and Equipment Rentals",
      estimate: 14500000,
      entries: [
        { date: "2025-03-03", pvNo: "RV 07/MAR/2025", particulars: "Equipment rental income", amount: 2700000 },
        { date: "2025-06-21", pvNo: "RV 24/JUN/2025", particulars: "Grader hire charges", amount: 3600000 },
        { date: "2025-09-09", pvNo: "RV 41/SEP/2025", particulars: "Workshop facility rentals", amount: 2900000 }
      ]
    },
    {
      id: "dvra-education-fees",
      departmentId: "dept-education",
      departmentName: "Education",
      headCode: "REV:01-12-004-001-00",
      categoryName: "School Service Charges",
      estimate: 22700000,
      entries: [
        { date: "2025-02-18", pvNo: "RV 05/FEB/2025", particulars: "Certificate service charges", amount: 3600000 },
        { date: "2025-05-26", pvNo: "RV 18/MAY/2025", particulars: "Transcript and record charges", amount: 5400000 },
        { date: "2025-07-30", pvNo: "RV 29/JUL/2025", particulars: "Examination card sales", amount: 6100000 },
        { date: "2025-10-15", pvNo: "RV 46/OCT/2025", particulars: "School form processing", amount: 4200000 }
      ]
    },
    {
      id: "dvra-education-support",
      departmentId: "dept-education",
      departmentName: "Education",
      headCode: "REV:01-12-004-002-00",
      categoryName: "Education Support Reimbursements",
      estimate: 9800000,
      entries: [
        { date: "2025-01-30", pvNo: "RV 03/JAN/2025", particulars: "Support reimbursement", amount: 1800000 },
        { date: "2025-04-25", pvNo: "RV 15/APR/2025", particulars: "Training recovery fee", amount: 2200000 },
        { date: "2025-08-14", pvNo: "RV 35/AUG/2025", particulars: "Workshop reimbursement", amount: 2100000 }
      ]
    },
    {
      id: "dvra-finance-fees",
      departmentId: "dept-finance",
      departmentName: "Finance",
      headCode: "REV:01-13-003-001-00",
      categoryName: "Treasury Fees",
      estimate: 16800000,
      entries: [
        { date: "2025-02-09", pvNo: "RV 06/FEB/2025", particulars: "Transaction fees", amount: 2900000 },
        { date: "2025-05-14", pvNo: "RV 20/MAY/2025", particulars: "Account maintenance fees", amount: 3500000 },
        { date: "2025-07-22", pvNo: "RV 31/JUL/2025", particulars: "Documentation processing fees", amount: 2600000 },
        { date: "2025-11-19", pvNo: "RV 52/NOV/2025", particulars: "Treasury service charges", amount: 3100000 }
      ]
    },
    {
      id: "dvra-finance-revenue",
      departmentId: "dept-finance",
      departmentName: "Finance",
      headCode: "REV:01-13-003-002-00",
      categoryName: "Revenue Control Recoveries",
      estimate: 12100000,
      entries: [
        { date: "2025-03-07", pvNo: "RV 08/MAR/2025", particulars: "Revenue reconciliation recoveries", amount: 2400000 },
        { date: "2025-06-03", pvNo: "RV 23/JUN/2025", particulars: "Audit recovery income", amount: 3300000 },
        { date: "2025-09-26", pvNo: "RV 42/SEP/2025", particulars: "Control and compliance recoveries", amount: 2800000 }
      ]
    }
  ];

  var advanceMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var seedAdvanceLedgerRecords = [
    { id: "advance-abamun-chukuka", departmentId: "dept-finance", holderName: "ABAMUN CHUKUKA", openingBalance: 73813100, entries: { 0: { granted: 1200000, retired: 500000 }, 2: { granted: 0, retired: 1800000 }, 5: { granted: 850000, retired: 0 } } },
    { id: "advance-achi-obed", departmentId: "dept-finance", holderName: "ACHI OBED", openingBalance: 394300, entries: { 1: { granted: 250000, retired: 0 }, 4: { granted: 0, retired: 144300 } } },
    { id: "advance-amaka-livingstone", departmentId: "dept-works", holderName: "AMAKA LIVINGSTONE", openingBalance: 2530000, entries: { 0: { granted: 450000, retired: 0 }, 3: { granted: 0, retired: 700000 }, 6: { granted: 300000, retired: 250000 } } },
    { id: "advance-animam-solomon", departmentId: "dept-health", holderName: "ANIMAM SOLOMON", openingBalance: 150000, entries: { 2: { granted: 600000, retired: 150000 }, 7: { granted: 0, retired: 220000 } } },
    { id: "advance-agbabi-martins", departmentId: "dept-works", holderName: "AGBABI MARTINS", openingBalance: 4750000, entries: { 1: { granted: 1200000, retired: 500000 }, 5: { granted: 0, retired: 950000 } } },
    { id: "advance-akpone-henry", departmentId: "dept-education", holderName: "AKPONE HENRY", openingBalance: 24629500, entries: { 0: { granted: 3000000, retired: 0 }, 4: { granted: 0, retired: 2000000 }, 8: { granted: 1400000, retired: 0 } } },
    { id: "advance-akwakwa-john", departmentId: "dept-finance", holderName: "AKWAKWA JOHN", openingBalance: 700000, entries: { 3: { granted: 0, retired: 250000 } } },
    { id: "advance-aninze-oliver", departmentId: "dept-health", holderName: "ANINZE OLIVER", openingBalance: 3850000, entries: { 1: { granted: 900000, retired: 400000 }, 6: { granted: 0, retired: 1100000 } } },
    { id: "advance-chilou-onyeka-mercy", departmentId: "dept-education", holderName: "CHILOU ONYEKA MERCY", openingBalance: 1000000, entries: { 2: { granted: 400000, retired: 0 }, 5: { granted: 0, retired: 650000 } } },
    { id: "advance-delekpe-olori-sunday", departmentId: "dept-works", holderName: "DELEKPE OLORI SUNDAY", openingBalance: 24900000, entries: { 0: { granted: 2500000, retired: 1000000 }, 7: { granted: 0, retired: 3500000 } } },
    { id: "advance-eke-henry", departmentId: "dept-health", holderName: "EKULE HENRY", openingBalance: 500000, entries: { 4: { granted: 250000, retired: 0 } } },
    { id: "advance-enakpoya-ogochukwu", departmentId: "dept-finance", holderName: "ENAKPOYA OGOCHUKWU", openingBalance: 200000, entries: { 3: { granted: 180000, retired: 50000 } } },
    { id: "advance-eyefia-rosemary", departmentId: "dept-education", holderName: "EYEFIA ROSEMARY", openingBalance: 11365000, entries: { 1: { granted: 2000000, retired: 0 }, 8: { granted: 0, retired: 2500000 } } },
    { id: "advance-iweobodo-happy", departmentId: "dept-works", holderName: "IWEOBODO HAPPY", openingBalance: 10781425, entries: { 2: { granted: 1500000, retired: 425000 }, 5: { granted: 0, retired: 1600000 } } },
    { id: "advance-iyamah-henrietta", departmentId: "dept-health", holderName: "IYAMAH HENRIETTA", openingBalance: 12000000, entries: { 0: { granted: 2500000, retired: 0 }, 6: { granted: 0, retired: 3500000 } } },
    { id: "advance-odigiri-peter", departmentId: "dept-finance", holderName: "ODIGIRI PETER", openingBalance: 3000000, entries: { 4: { granted: 900000, retired: 0 }, 9: { granted: 0, retired: 1000000 } } },
    { id: "advance-ogashi-chinedu", departmentId: "dept-works", holderName: "OGASHI CHINEDU", openingBalance: 22440000, entries: { 1: { granted: 3000000, retired: 0 }, 5: { granted: 0, retired: 2500000 } } },
    { id: "advance-okpor-elias", departmentId: "dept-education", holderName: "OKPOR ELIAS", openingBalance: 10265000, entries: { 3: { granted: 1000000, retired: 500000 }, 7: { granted: 0, retired: 1500000 } } },
    { id: "advance-olokwu-pascal", departmentId: "dept-works", holderName: "OLOKWU PASCAL", openingBalance: 32910000, entries: { 0: { granted: 4500000, retired: 0 }, 10: { granted: 0, retired: 5000000 } } },
    { id: "advance-orogun-blessing", departmentId: "dept-health", holderName: "OROGUN BLESSING", openingBalance: 37850000, entries: { 2: { granted: 5000000, retired: 1000000 }, 8: { granted: 0, retired: 6500000 } } },
    { id: "advance-ukpolo-joel", departmentId: "dept-finance", holderName: "UKPOLO JOEL", openingBalance: 11000000, entries: { 1: { granted: 1200000, retired: 0 }, 6: { granted: 0, retired: 2000000 } } },
    { id: "advance-nwauzor-boniface", departmentId: "dept-education", holderName: "NWAUZOR BONIFACE", openingBalance: 8630000, entries: { 4: { granted: 750000, retired: 0 }, 11: { granted: 0, retired: 1250000 } } }
  ];

  var salaryTemplateHeaders = [
    "Bank", "PID", "Employee Name", "Inc Date", "Grade/Step", "Monthly Basic",
    "Rent", "Trans", "Meal", "Utility", "Ent.", "Domestic Servant", "Furn.",
    "Shift", "Journal", "LTG", "Personal Asst.", "Arrears", "Call Duty",
    "Other Pay", "Total Gross", "Tax", "NULGE", "Pension", "MICS", "DISHC",
    "Other Ded", "Total Ded", "Net Pay", "Row Type"
  ];

  var salarySampleRows = [
    ["Boji Boji Microfinance Bank Ltd", "DT0101901", "OJUGBELI Cyril", "JAN", "08CONPS06", 28204.97, 13607.49, 7892.34, 1073.59, 4082.25, 0, 0, 10885.9, 0, 0, 2721.5, 0, 0, 0, 0, 68468.04, 2781.8, 846.15, 3727.86, 43812, 1198.19, 500, 52866, 15602.04, "Employee"],
    ["Boji Boji Microfinance Bank Ltd", "DT0011965", "ABAHUN Ngozi", "JAN", "14CONPS05", 53282.82, 26155.41, 15170.14, 1225.02, 7846.62, 0, 0, 20924.33, 0, 0, 5231.08, 0, 0, 0, 0, 129835.42, 9015.91, 1598.48, 7095.63, 82688, 2272.12, 500, 103170.14, 26665.28, "Employee"],
    ["Boji Boji Microfinance Bank Ltd", "", "Bank Total", "", "", 81487.79, 39762.9, 23062.48, 2298.61, 11928.87, 0, 0, 31810.23, 0, 0, 7952.58, 0, 0, 0, 0, 198303.46, 11797.71, 2444.63, 10823.49, 126500, 3470.31, 1000, 156036.14, 42267.32, "Bank Total"],
    ["Ecobank Nigeria Plc", "DT0011575", "EMETEM Victor", "JULY", "14CONPS05", 53282.82, 26155.41, 15170.14, 1225.02, 7846.62, "", "", "", "", "", "", "", "", "", "", 129835.42, 9015.91, 1598.48, 7095.63, 10500, 2272.12, 500, 30982.14, 98853.28, "Employee"],
    ["Ecobank Nigeria Plc", "DT0011810", "EDECHINE Ifeanyi", "JULY", "12CONPS04", 42195.05, 20611.53, 11954.68, 1224.8, 6183.46, "", "", "", "", "", "", "", "", "", "", 102781.06, 5992.66, 1265.85, 5607.09, 50250, 1796.67, 500, 65414.27, 37366.79, "Employee"],
    ["Ecobank Nigeria Plc", "DT0011855", "NOR Samuel", "JAN", "14CONPS05", 53282.82, 26155.41, 15170.14, 1225.02, 7846.62, "", "", "", "", "", "", "", "", "", "", 157835.42, 9015.91, 1598.48, 7095.63, 48685, 2762.12, 1000, 70157.14, 87678.28, "Employee"]
  ];

  var salaryUploadedMonths = {
    0: "ukuwani_salary_january_2026.xlsx",
    1: "ukuwani_salary_february_2026.xlsx",
    2: "ukuwani_salary_march_2026.xlsx",
    3: "ukuwani_salary_april_2026.xlsx",
    4: "ukuwani_salary_may_2026.xlsx",
    5: "ukuwani_salary_june_2026.xlsx"
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
          : "Rivers State",
      headquarters: stateInstance && stateInstance.headquarters ? stateInstance.headquarters : ""
    };
  }

  var ACTIVE_INSTANCE = loadActiveInstance();
  var selectedDepartmentId = "";
  var selectedLedgerTab = "summary";
  var selectedLedgerYear = "";
  var selectedSalaryTab = "template";
  var selectedSalaryMonth = "";

  function ledgerModeLabel() {
    return (document.body && document.body.getAttribute("data-ledger-short-label")) || "DVEA";
  }

  function ledgerModeFullLabel() {
    return (document.body && document.body.getAttribute("data-ledger-full-label")) || "Departmental Vote Expenditure Account";
  }

  function isAdvanceLedgerPage() {
    return document.body && document.body.getAttribute("data-ledger-type") === "advance";
  }

  function isSalaryLedgerPage() {
    return document.body && document.body.getAttribute("data-ledger-type") === "salary";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function digits(value) {
    return Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function displayAmount(value) {
    return Number(value || 0) ? digits(value) : "-";
  }

  function formatDate(value) {
    if (!value) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(value));
  }

  function toInputDate(value) {
    if (!value) {
      return "";
    }

    return new Date(value).toISOString().slice(0, 10);
  }

  function parseInputDate(value) {
    return value ? new Date(value + "T00:00:00") : null;
  }

  function currentBudgetYear() {
    return String(new Date().getFullYear());
  }

  function formatTimeLabel(value) {
    if (!value) {
      return "";
    }

    return String(value).toUpperCase();
  }

  function slug(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || String(Date.now());
  }

  function normalizeLedgerDepartmentId(departmentId) {
    if (departmentId === "dept-chairman") {
      return "dept-works";
    }
    return departmentId || "";
  }

  function defaultDepartmentId(records) {
    if (!records.length) {
      return "";
    }
    return records[0].departmentId || records[0].id || "";
  }

  function getLedgerRecords() {
    if (ledgerModeLabel() === "DVRA") {
      return getRevenueLedgerRecords();
    }

    var budgetDepartments = getBudgetDepartments();
    var stored = read(LEDGER_STORE, []);
    var source = Array.isArray(stored) && stored.length ? stored : seedLedgerRecords;
    var normalized = source.map(function (record) {
      var base = record || {};
      var departmentId = normalizeLedgerDepartmentId(base.departmentId);
      var matchedDepartment = budgetDepartments.find(function (department) {
        return department.id === departmentId;
      });
      return {
        id: base.id || "ledger-" + slug(base.departmentName || Date.now()),
        departmentId: departmentId,
        departmentName: matchedDepartment ? matchedDepartment.name : (base.departmentName || ""),
        headCode: base.headCode || (matchedDepartment && matchedDepartment.code ? matchedDepartment.code : ""),
        categoryName: base.categoryName || "",
        estimate: Number(base.estimate || 0) || 0,
        entries: Array.isArray(base.entries) ? base.entries.map(function (entry) {
          return {
            date: entry && entry.date ? entry.date : "",
            pvNo: entry && entry.pvNo ? entry.pvNo : "",
            particulars: entry && entry.particulars ? entry.particulars : "",
            amount: Number(entry && entry.amount ? entry.amount : 0) || 0
          };
        }) : []
      };
    });

    if (source !== seedLedgerRecords) {
      var existingIds = {};
      normalized.forEach(function (record) {
        existingIds[record.id] = true;
      });
      seedLedgerRecords.forEach(function (record) {
        if (!existingIds[record.id]) {
          normalized.push(record);
        }
      });
    }

    return normalized;
  }

  function getRevenueLedgerRecords() {
    var budgetDepartments = getBudgetDepartments();
    var stored = read(REVENUE_LEDGER_STORE, []);
    var source = Array.isArray(stored) && stored.length ? stored : seedRevenueLedgerRecords;
    var normalized = source.map(function (record) {
      var base = record || {};
      var departmentId = normalizeLedgerDepartmentId(base.departmentId);
      var matchedDepartment = budgetDepartments.find(function (department) {
        return department.id === departmentId;
      });
      return {
        id: base.id || "revenue-ledger-" + slug(base.departmentName || Date.now()),
        departmentId: departmentId,
        departmentName: matchedDepartment ? matchedDepartment.name : (base.departmentName || ""),
        headCode: base.headCode || (matchedDepartment && matchedDepartment.code ? matchedDepartment.code : ""),
        categoryName: base.categoryName || "",
        estimate: Number(base.estimate || 0) || 0,
        entries: Array.isArray(base.entries) ? base.entries.map(function (entry) {
          return {
            date: entry && entry.date ? entry.date : "",
            pvNo: entry && entry.pvNo ? entry.pvNo : "",
            particulars: entry && entry.particulars ? entry.particulars : "",
            amount: Number(entry && entry.amount ? entry.amount : 0) || 0
          };
        }) : []
      };
    });

    if (source !== seedRevenueLedgerRecords) {
      var existingIds = {};
      normalized.forEach(function (record) {
        existingIds[record.id] = true;
      });
      seedRevenueLedgerRecords.forEach(function (record) {
        if (!existingIds[record.id]) {
          normalized.push(record);
        }
      });
    }

    return normalized;
  }

  function getBudgetDepartments() {
    return read(BUDGET_DEPARTMENTS_STORE, [
      { id: "dept-health", code: "HLT", name: "Health", status: "Active" },
      { id: "dept-works", code: "WRK", name: "Works", status: "Active" },
      { id: "dept-education", code: "EDU", name: "Education", status: "Active" },
      { id: "dept-finance", code: "FIN", name: "Finance", status: "Active" }
    ]).map(function (department) {
      return {
        id: department.id || "",
        code: department.code || "",
        name: department.name || "",
        status: department.status || ""
      };
    });
  }

  function getBudgetYears() {
    return read(BUDGET_YEARS_STORE, [
      { id: "year-2023", year: "2023" },
      { id: "year-2024", year: "2024" },
      { id: "year-2025", year: "2025" },
      { id: "year-2026", year: "2026" },
      { id: "year-2027", year: "2027" },
      { id: "year-2028", year: "2028" },
      { id: "year-2029", year: "2029" }
    ]).map(function (year) {
      return {
        id: year.id || "",
        year: String(year.year || "")
      };
    }).filter(function (year) {
      return Boolean(year.year);
    });
  }

  function getAdvanceLedgerRecords() {
    var departments = getBudgetDepartments();
    var stored = read(ADVANCE_LEDGER_STORE, []);
    var source = Array.isArray(stored) && stored.length ? stored : seedAdvanceLedgerRecords;
    return source.map(function (record) {
      var departmentId = normalizeLedgerDepartmentId(record.departmentId);
      var department = departments.find(function (entry) {
        return entry.id === departmentId;
      });
      return {
        id: record.id || "advance-" + slug(record.holderName || Date.now()),
        departmentId: departmentId,
        departmentName: department ? department.name : (record.departmentName || "Department"),
        holderName: record.holderName || "Advance holder",
        openingBalance: Number(record.openingBalance || 0),
        entries: record.entries || {}
      };
    });
  }

  function advanceMonthEntry(record, monthIndex) {
    var entry = (record.entries || {})[monthIndex] || {};
    return {
      granted: Number(entry.granted || 0),
      retired: Number(entry.retired || 0)
    };
  }

  function advanceRowsForActiveFilter(records) {
    return records.filter(function (record) {
      return !selectedDepartmentId || record.departmentId === selectedDepartmentId;
    }).sort(function (left, right) {
      return String(left.holderName).localeCompare(String(right.holderName));
    });
  }

  function getActiveDepartmentRecords(records) {
    if (!selectedDepartmentId) {
      return records.slice();
    }

    return records.filter(function (record) {
      return record.departmentId === selectedDepartmentId;
    });
  }

  function getRecordsForActiveFilter(records) {
    return getActiveDepartmentRecords(records).map(function (record) {
      return {
        id: record.id,
        departmentId: record.departmentId,
        departmentName: record.departmentName,
        headCode: record.headCode,
        categoryName: record.categoryName,
        estimate: record.estimate,
        entries: filterEntriesByYear(record.entries, selectedLedgerYear)
      };
    });
  }

  function sum(values) {
    return values.reduce(function (total, value) {
      return total + Number(value || 0);
    }, 0);
  }

  function monthKey(dateValue) {
    return String(dateValue || "").slice(0, 7);
  }

  function monthLabel(dateValue) {
    return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(dateValue));
  }

  function shiftMonths(dateValue, months) {
    var date = new Date(dateValue);
    date.setMonth(date.getMonth() + months);
    return date;
  }

  function filterEntriesByYear(entries, yearValue) {
    var year = String(yearValue || "");
    var matchedEntries = entries.filter(function (entry) {
      var entryDate = parseInputDate(entry.date);
      if (!entryDate) {
        return false;
      }
      return String(entryDate.getFullYear()) === year;
    });
    return matchedEntries.length ? matchedEntries : entries.slice();
  }

  function getCategorySummaryRows(records) {
    var buckets = {};
    records.forEach(function (record) {
      var key = String(record.departmentId || "") + "::" + String(record.categoryName || "");

      if (!buckets[key]) {
        buckets[key] = {
          departmentId: record.departmentId,
          departmentName: record.departmentName,
          headCode: record.headCode,
          categoryName: record.categoryName,
          items: 0,
          estimate: 0,
          spent: 0
        };
      }
      buckets[key].items += 1;
      buckets[key].estimate += Number(record.estimate || 0);
      buckets[key].spent += sum(record.entries.map(function (entry) { return entry.amount; }));
    });

    return Object.keys(buckets).map(function (key) {
      var row = buckets[key];
      row.balance = row.estimate - row.spent;
      return row;
    }).sort(function (left, right) {
      return String(left.categoryName).localeCompare(String(right.categoryName));
    });
  }

  function getDefaultDateRange(entries) {
    var dates = entries.map(function (entry) {
      return new Date(entry.date);
    }).filter(function (date) {
      return !isNaN(date.getTime());
    });

    if (!dates.length) {
      return { start: "", end: "" };
    }

    var latest = new Date(Math.max.apply(null, dates.map(function (date) { return date.getTime(); })));
    var start = shiftMonths(latest, -5);
    return {
      start: toInputDate(start),
      end: toInputDate(latest)
    };
  }

  function filterEntriesByRange(entries, startValue, endValue) {
    var start = parseInputDate(startValue);
    var end = parseInputDate(endValue);
    return entries.filter(function (entry) {
      var entryDate = parseInputDate(entry.date);
      if (!entryDate) {
        return false;
      }
      if (start && entryDate < start) {
        return false;
      }
      if (end) {
        var endOfDay = new Date(end.getTime());
        endOfDay.setHours(23, 59, 59, 999);
        if (entryDate > endOfDay) {
          return false;
        }
      }
      return true;
    });
  }

  function buildCategoryRows(category, entriesSource) {
    var entries = (entriesSource || category.entries).slice().sort(function (left, right) {
      return String(left.date || "").localeCompare(String(right.date || ""));
    });
    var monthlyTotals = {};
    var runningTotal = 0;

    entries.forEach(function (entry) {
      var key = monthKey(entry.date);
      monthlyTotals[key] = (monthlyTotals[key] || 0) + Number(entry.amount || 0);
    });

    var rows = [
      {
        type: "estimate",
        label: "Amount in estimate",
        amount: category.estimate,
        balance: category.estimate
      }
    ];

    entries.forEach(function (entry, index) {
      runningTotal += Number(entry.amount || 0);
      var next = entries[index + 1];
      var isMonthEnd = !next || monthKey(next.date) !== monthKey(entry.date);

      rows.push({
        type: "entry",
        date: entry.date,
        pvNo: entry.pvNo,
        particulars: entry.particulars,
        amount: entry.amount,
        monthlyTotal: isMonthEnd ? monthlyTotals[monthKey(entry.date)] : null,
        runningTotal: runningTotal,
        balance: category.estimate - runningTotal,
        monthLabel: isMonthEnd ? monthLabel(entry.date) : ""
      });
    });

    return rows;
  }

  function renderSummaryTable(records) {
    var rows = getCategorySummaryRows(records);

    $("ledger-summary-body").innerHTML = rows.map(function (row) {
      return '<tr>' +
        '<td>' + escapeHtml(row.categoryName) + '</td>' +
        '<td>' + escapeHtml(row.departmentName) + '</td>' +
        '<td>' + escapeHtml(row.headCode || "-") + '</td>' +
        '<td>' + escapeHtml(row.items.toLocaleString()) + '</td>' +
        '<td class="ledger-amount-cell">' + displayAmount(row.estimate) + '</td>' +
        '<td class="ledger-amount-cell">' + displayAmount(row.spent) + '</td>' +
        '<td class="ledger-balance-cell ' + (row.balance < 0 ? "negative" : "") + '">' + displayAmount(row.balance) + '</td>' +
        '</tr>';
    }).join("") || '<tr><td colspan="7">No category summary rows available.</td></tr>';
  }

  function renderLedgerExportSource() {
    var exportBlocks = [];
    var salaryTable = $("salary-ledger-preview-table") || $("salary-template-table") || $("salary-upload-table");
    if (salaryTable) {
      exportBlocks.push({
        title: "Salary Ledger",
        table: salaryTable
      });
      return exportBlocks;
    }
    var advanceTable = $("advance-ledger-table");
    if (advanceTable) {
      exportBlocks.push({
        title: "Advance Ledger",
        table: advanceTable
      });
      return exportBlocks;
    }
    document.querySelectorAll(".ledger-category-card").forEach(function (card) {
      exportBlocks.push({
        title: card.querySelector(".ledger-category-title strong") ? card.querySelector(".ledger-category-title strong").textContent : "Category",
        table: card.querySelector("table")
      });
    });
    return exportBlocks;
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

  function exportLedgerToExcel() {
    var blocks = renderLedgerExportSource();
    var lines = [];

    blocks.forEach(function (block, index) {
      var table = block.table;
      if (!table) {
        return;
      }
      if (index > 0) {
        lines.push("");
        lines.push("");
      }
      lines.push(block.title);
      table.querySelectorAll("thead th").forEach(function (cell, headerIndex) {
        if (headerIndex === 0) {
          lines.push(Array.from(table.querySelectorAll("thead th")).map(function (th) { return th.textContent.trim(); }).join("\t"));
        }
      });
      table.querySelectorAll("tbody tr").forEach(function (row) {
        var cells = [];
        row.querySelectorAll("td").forEach(function (cell) {
          cells.push((cell.textContent || "").trim());
        });
        if (cells.length) {
          lines.push(cells.join("\t"));
        }
      });
    });

    downloadTextFile("ledger-" + ledgerModeLabel().toLowerCase() + ".xls", lines.join("\n"), "application/vnd.ms-excel;charset=utf-8");
  }

  function openLedgerPrintView() {
    var blocks = renderLedgerExportSource();
    var printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) {
      return;
    }

    var body = blocks.map(function (block) {
      if (!block.table) {
        return "";
      }

      var headers = Array.from(block.table.querySelectorAll("thead th")).map(function (cell) {
        return "<th>" + escapeHtml(cell.textContent || "") + "</th>";
      }).join("");
      var rows = Array.from(block.table.querySelectorAll("tbody tr")).map(function (row) {
        return "<tr>" + Array.from(row.querySelectorAll("td")).map(function (cell) {
          return "<td>" + escapeHtml(cell.textContent || "") + "</td>";
        }).join("") + "</tr>";
      }).join("");

      return '<section style="margin-bottom:24px;"><h2 style="font-size:18px;margin:0 0 10px;">' + escapeHtml(block.title) + '</h2><table style="width:100%;border-collapse:collapse;"><thead><tr>' + headers + '</tr></thead><tbody>' + rows + '</tbody></table></section>';
    }).join("");

    printWindow.document.write('<!DOCTYPE html><html><head><title>Ledger ' + escapeHtml(ledgerModeLabel()) + '</title><style>body{font-family:Arial,sans-serif;padding:28px;color:#172019;}h1{margin:0 0 8px;font-size:20px;}p{margin:0 0 18px;color:#5f6e63;font-size:12px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #d6ddd7;padding:10px 12px;text-align:left;font-size:12px;vertical-align:top;}th{background:#143326;color:#fff;}tr:nth-child(even) td{background:#f7faf8;}</style></head><body><h1>' + escapeHtml(ledgerModeFullLabel()) + ' Ledger</h1><p>Generated from the prototype view.</p>' + body + '</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function renderCategory(category) {
    var filteredEntries = filterEntriesByYear(category.entries, selectedLedgerYear);
    var rows = buildCategoryRows(category, filteredEntries);
    var spent = sum(filteredEntries.map(function (entry) { return entry.amount; }));
    var balance = category.estimate - spent;

    return '' +
      '<article class="ledger-category-card">' +
      '<header class="ledger-category-head">' +
      '<div class="ledger-category-title">' +
      '<span>' + escapeHtml(category.departmentName) + '</span>' +
      '<strong>' + escapeHtml(category.categoryName.toUpperCase()) + '</strong>' +
      '<p>' + escapeHtml(category.headCode) + '</p>' +
      '</div>' +
      '<div class="ledger-category-stats">' +
      '<div class="ledger-stat"><span>Estimate</span><strong>' + displayAmount(category.estimate) + '</strong></div>' +
      '<div class="ledger-stat"><span>Spent</span><strong>' + displayAmount(spent) + '</strong></div>' +
      '<div class="ledger-stat ' + (balance < 0 ? "negative" : "") + '"><span>Available</span><strong>' + displayAmount(balance) + '</strong></div>' +
      '</div>' +
      '</header>' +
      '<div class="ledger-table-wrap">' +
      '<table class="data-table ledger-table ledger-dvea-table">' +
      '<thead><tr><th>Date</th><th>PV No.</th><th>Particulars of Payment</th><th>Amount in Estimate</th><th>Monthly Total</th><th>Running Total</th><th>Balance Available</th></tr></thead>' +
      '<tbody>' +
      rows.map(function (row) {
        if (row.type === "estimate") {
          return '<tr class="ledger-estimate-row"><td></td><td></td><td class="ledger-estimate-label">' + escapeHtml(row.label) + '</td><td class="ledger-amount-cell">' + displayAmount(row.amount) + '</td><td></td><td></td><td class="ledger-balance-cell">' + displayAmount(row.balance) + '</td></tr>';
        }

        return '<tr>' +
          '<td>' + escapeHtml(formatDate(row.date)) + '</td>' +
          '<td>' + escapeHtml(row.pvNo) + '</td>' +
          '<td>' + escapeHtml(row.particulars) + '</td>' +
          '<td class="ledger-amount-cell">' + displayAmount(row.amount) + '</td>' +
          '<td class="ledger-month-total-cell">' + (row.monthlyTotal !== null ? displayAmount(row.monthlyTotal) : "") + '</td>' +
          '<td class="ledger-running-total">' + (row.monthlyTotal !== null ? displayAmount(row.runningTotal) : "") + '</td>' +
          '<td class="ledger-balance-cell ' + (row.balance < 0 ? "negative" : "") + '">' + (row.monthlyTotal !== null ? displayAmount(row.balance) : "") + '</td>' +
          '</tr>';
      }).join("") +
      '</tbody></table></div></article>';
  }

  function renderAdvanceLedger() {
    var departments = getBudgetDepartments();
    var records = getAdvanceLedgerRecords();
    var rows = advanceRowsForActiveFilter(records);
    var departmentField = $("dvea-department");
    var yearField = $("dvea-year");
    var years = getBudgetYears();
    var totalOpening = 0;
    var monthTotals = advanceMonths.map(function () {
      return { granted: 0, retired: 0, balance: 0 };
    });

    if (!selectedLedgerYear || !years.some(function (year) { return year.year === selectedLedgerYear; })) {
      selectedLedgerYear = currentBudgetYear();
    }

    if (departmentField) {
      departmentField.innerHTML = '<option value="">All departments</option>' + departments.map(function (department) {
        var selected = department.id === selectedDepartmentId ? " selected" : "";
        return '<option value="' + escapeHtml(department.id) + '"' + selected + '>' + escapeHtml(department.name) + "</option>";
      }).join("");
      departmentField.value = selectedDepartmentId || "";
    }

    if (yearField) {
      yearField.innerHTML = years.map(function (year) {
        var selected = year.year === selectedLedgerYear ? " selected" : "";
        return '<option value="' + escapeHtml(year.year) + '"' + selected + '>' + escapeHtml(year.year) + "</option>";
      }).join("");
      yearField.value = selectedLedgerYear;
    }

    if ($("ledger-instance-copy")) {
      $("ledger-instance-copy").textContent = ACTIVE_INSTANCE.localGovernmentName + ", " + ACTIVE_INSTANCE.stateName;
    }
    if ($("ledger-department-title")) {
      var department = departments.find(function (entry) { return entry.id === selectedDepartmentId; });
      $("ledger-department-title").textContent = department ? department.name.toUpperCase() : "ALL DEPARTMENTS";
    }
    if ($("ledger-department-copy")) {
      $("ledger-department-copy").textContent = "Advance holders are tracked by opening balance, monthly grants, retirements, and running balance for the selected year.";
    }
    if ($("ledger-head-code")) {
      $("ledger-head-code").textContent = "YEAR: " + selectedLedgerYear;
    }
    if ($("ledger-category-count")) {
      $("ledger-category-count").textContent = rows.length.toLocaleString() + " holders";
    }

    var groupedMonthHeaders = advanceMonths.map(function (month) {
      return '<th colspan="3">' + escapeHtml(month.toUpperCase() + "," + selectedLedgerYear) + '</th>';
    }).join("");
    var monthColumns = advanceMonths.map(function () {
      return '<th>Granted</th><th>Retired</th><th>Balance</th>';
    }).join("");

    var bodyRows = rows.map(function (record, index) {
      var runningBalance = Number(record.openingBalance || 0);
      totalOpening += runningBalance;
      var cells = advanceMonths.map(function (month, monthIndex) {
        var entry = advanceMonthEntry(record, monthIndex);
        runningBalance += entry.granted - entry.retired;
        monthTotals[monthIndex].granted += entry.granted;
        monthTotals[monthIndex].retired += entry.retired;
        monthTotals[monthIndex].balance += runningBalance;
        return '<td class="ledger-amount-cell">' + displayAmount(entry.granted) + '</td>' +
          '<td class="ledger-amount-cell">' + displayAmount(entry.retired) + '</td>' +
          '<td class="ledger-amount-cell">' + displayAmount(runningBalance) + '</td>';
      }).join("");

      return '<tr>' +
        '<td class="advance-serial-cell">' + (index + 1) + '</td>' +
        '<td class="advance-holder-cell">' + escapeHtml(record.holderName) + '</td>' +
        '<td class="ledger-amount-cell advance-opening-cell">' + displayAmount(record.openingBalance) + '</td>' +
        cells +
      '</tr>';
    }).join("");

    var totalCells = monthTotals.map(function (total) {
      return '<td class="ledger-amount-cell">' + displayAmount(total.granted) + '</td>' +
        '<td class="ledger-amount-cell">' + displayAmount(total.retired) + '</td>' +
        '<td class="ledger-amount-cell">' + displayAmount(total.balance) + '</td>';
    }).join("");

    $("advance-ledger-sheet").innerHTML =
      '<div class="ledger-table-wrap advance-ledger-wrap">' +
        '<table class="data-table ledger-table advance-ledger-table" id="advance-ledger-table">' +
          '<thead>' +
            '<tr><th rowspan="2">S/No.</th><th rowspan="2">Advance Holders</th><th rowspan="2">Opening Balance as at 1st Jan., ' + escapeHtml(selectedLedgerYear) + '</th>' + groupedMonthHeaders + '</tr>' +
            '<tr>' + monthColumns + '</tr>' +
          '</thead>' +
          '<tbody>' +
            (bodyRows || '<tr><td colspan="' + (3 + (advanceMonths.length * 3)) + '">No advance holders found for the active filter.</td></tr>') +
            '<tr class="ledger-estimate-row"><td></td><td>Total</td><td class="ledger-amount-cell">' + displayAmount(totalOpening) + '</td>' + totalCells + '</tr>' +
          '</tbody>' +
        '</table>' +
      '</div>';
  }

  function salaryYearMonths() {
    var currentYear = currentBudgetYear();
    var currentMonth = new Date().getMonth();
    var maxMonth = selectedLedgerYear === currentYear ? currentMonth : 11;
    return advanceMonths.slice(0, maxMonth + 1);
  }

  function salaryPreviewTable(monthIndex) {
    var fileName = salaryUploadedMonths[monthIndex] || "ukuwani_salary_" + advanceMonths[monthIndex].toLowerCase() + "_" + selectedLedgerYear + ".xlsx";
    var headers = salaryTemplateHeaders.map(function (header) {
      return "<th>" + escapeHtml(header) + "</th>";
    }).join("");
    var rows = salarySampleRows.map(function (row) {
      return "<tr>" + row.map(function (cell, index) {
        var numeric = typeof cell === "number";
        return '<td class="' + (numeric || index >= 5 ? "ledger-amount-cell" : "") + '">' + escapeHtml(numeric ? displayAmount(cell) : (cell || "")) + "</td>";
      }).join("") + "</tr>";
    }).join("");

    return '' +
      '<section class="salary-preview-panel">' +
        '<div class="ledger-sheet-head salary-preview-head">' +
          '<div>' +
            '<p class="kicker">Uploaded Salary File</p>' +
            '<h2>' + escapeHtml(advanceMonths[monthIndex] + " " + selectedLedgerYear) + '</h2>' +
            '<p>' + escapeHtml(fileName) + '</p>' +
          '</div>' +
          '<div class="salary-preview-actions">' +
            '<button class="button slim" type="button" data-salary-back>Back to table</button>' +
            '<span class="status-pill ok">Loaded preview</span>' +
          '</div>' +
        '</div>' +
        '<div class="ledger-table-wrap salary-ledger-wrap">' +
          '<table class="data-table ledger-table salary-ledger-preview-table" id="salary-ledger-preview-table">' +
            '<thead><tr>' + headers + '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</section>';
  }

  function renderSalaryTemplateTab() {
    var headers = salaryTemplateHeaders.map(function (header) {
      return "<th>" + escapeHtml(header) + "</th>";
    }).join("");
    var sample = salaryTemplateHeaders.map(function () {
      return "<td></td>";
    }).join("");
    return '' +
      '<section class="ledger-sheet-panel ops-panel salary-tab-panel">' +
        '<div class="ledger-sheet-head">' +
          '<div>' +
            '<p class="kicker">Template</p>' +
            '<h2>Salary upload template</h2>' +
            '<p>Download the salary ledger template and fill it month by month before importing.</p>' +
          '</div>' +
          '<button class="button action-submit" type="button" data-salary-template-download>Download template</button>' +
        '</div>' +
        '<div class="ledger-table-wrap salary-ledger-wrap">' +
          '<table class="data-table ledger-table salary-template-table" id="salary-template-table">' +
            '<thead><tr>' + headers + '</tr></thead>' +
            '<tbody><tr>' + sample + '</tr></tbody>' +
          '</table>' +
        '</div>' +
      '</section>';
  }

  function renderSalaryImportTab() {
    var months = advanceMonths;
    var rows = months.map(function (month, index) {
      var fileName = salaryUploadedMonths[index] || "";
      return '<tr>' +
        '<td>' + escapeHtml(month) + '</td>' +
        '<td>' + (fileName ? escapeHtml(fileName) : '<span class="salary-empty-file">No file uploaded</span>') + '</td>' +
        '<td>' + (fileName ? '<span class="salary-uploaded-lock">Already uploaded</span>' : '<input type="file" accept=".xlsx,.xls" data-salary-file="' + index + '">') + '</td>' +
        '<td><span class="status-pill ' + (fileName ? "ok" : "warn") + '">' + (fileName ? "Uploaded" : "Awaiting file") + '</span></td>' +
      '</tr>';
    }).join("");
    return '' +
      '<section class="ledger-sheet-panel ops-panel salary-tab-panel">' +
        '<div class="ledger-sheet-head">' +
          '<div>' +
            '<p class="kicker">Monthly Import</p>' +
            '<h2>Import salary files for ' + escapeHtml(selectedLedgerYear) + '</h2>' +
            '<p>Each month accepts one salary Excel file. Missing months remain open for upload.</p>' +
          '</div>' +
          '<span class="status-pill info">12 monthly slots</span>' +
        '</div>' +
        '<div class="ledger-table-wrap">' +
          '<table class="data-table ledger-table salary-upload-table" id="salary-upload-table">' +
            '<thead><tr><th>Month</th><th>Uploaded file</th><th>Import Excel</th><th>Status</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</section>';
  }

  function renderSalaryViewTab() {
    var months = salaryYearMonths();
    if (selectedSalaryMonth !== "") {
      return '' +
        '<section class="ledger-sheet-panel ops-panel salary-tab-panel">' +
          salaryPreviewTable(Number(selectedSalaryMonth || 0)) +
        '</section>';
    }
    var rows = months.map(function (month, index) {
      var fileName = salaryUploadedMonths[index] || "ukuwani_salary_" + month.toLowerCase() + "_" + selectedLedgerYear + ".xlsx";
      return '<tr>' +
        '<td>' + escapeHtml(month) + '</td>' +
        '<td>' + escapeHtml(fileName) + '</td>' +
        '<td><span class="status-pill ok">Uploaded</span></td>' +
        '<td><button class="button slim" type="button" data-salary-view-month="' + index + '">View</button></td>' +
      '</tr>';
    }).join("");
    return '' +
      '<section class="ledger-sheet-panel ops-panel salary-tab-panel">' +
        '<div class="ledger-sheet-head">' +
          '<div>' +
            '<p class="kicker">View Uploads</p>' +
            '<h2>Salary files from January to current month</h2>' +
            '<p>Select a month to preview the salary voucher data uploaded into the ledger.</p>' +
          '</div>' +
          '<span class="status-pill ok">' + months.length + ' uploaded files</span>' +
        '</div>' +
        '<div class="ledger-table-wrap">' +
          '<table class="data-table ledger-table salary-upload-table">' +
            '<thead><tr><th>Month</th><th>File name</th><th>Status</th><th>Action</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</section>';
  }

  function downloadSalaryTemplate() {
    var lines = [
      "UKWUANI LOCAL GOVT - Salary Voucher Upload Template",
      "Fill one workbook per month, then import it into the salary ledger.",
      "",
      salaryTemplateHeaders.join("\t")
    ];
    downloadTextFile("salary-ledger-template.xls", lines.join("\n"), "application/vnd.ms-excel;charset=utf-8");
  }

  function renderSalaryLedger() {
    var years = getBudgetYears();
    var yearField = $("dvea-year");
    if (!selectedLedgerYear || !years.some(function (year) { return year.year === selectedLedgerYear; })) {
      selectedLedgerYear = currentBudgetYear();
    }
    if (yearField) {
      yearField.innerHTML = years.map(function (year) {
        var selected = year.year === selectedLedgerYear ? " selected" : "";
        return '<option value="' + escapeHtml(year.year) + '"' + selected + '>' + escapeHtml(year.year) + "</option>";
      }).join("");
      yearField.value = selectedLedgerYear;
    }
    if ($("ledger-instance-copy")) {
      $("ledger-instance-copy").textContent = ACTIVE_INSTANCE.localGovernmentName + ", " + ACTIVE_INSTANCE.stateName;
    }
    if ($("ledger-head-code")) {
      $("ledger-head-code").textContent = "YEAR: " + selectedLedgerYear;
    }
    if ($("ledger-category-count")) {
      $("ledger-category-count").textContent = salaryYearMonths().length.toLocaleString() + " files";
    }

    document.querySelectorAll("[data-salary-tab]").forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-salary-tab") === selectedSalaryTab);
    });

    var panel = $("salary-ledger-panel");
    if (!panel) {
      return;
    }
    panel.innerHTML = selectedSalaryTab === "import"
      ? renderSalaryImportTab()
      : selectedSalaryTab === "view"
        ? renderSalaryViewTab()
        : renderSalaryTemplateTab();

    if (panel.querySelector("[data-salary-template-download]")) {
      panel.querySelector("[data-salary-template-download]").addEventListener("click", downloadSalaryTemplate);
    }
    panel.querySelectorAll("[data-salary-view-month]").forEach(function (button) {
      button.addEventListener("click", function () {
        selectedSalaryMonth = button.getAttribute("data-salary-view-month") || "0";
        renderSalaryLedger();
      });
    });
    if (panel.querySelector("[data-salary-back]")) {
      panel.querySelector("[data-salary-back]").addEventListener("click", function () {
        selectedSalaryMonth = "";
        renderSalaryLedger();
      });
    }
  }

  function renderLedger() {
    var records = getLedgerRecords();
    var departments = getBudgetDepartments();
    var departmentField = $("dvea-department");
    var department = null;
    var departmentEntries = [];
    var filteredRecords = [];
    var selectedDepartmentRecords = [];

    if (!departments.length) {
      if ($("ledger-summary-body")) {
        $("ledger-summary-body").innerHTML = '<tr><td colspan="7">No ledger data available.</td></tr>';
      }
      $("dvea-sheet").innerHTML = '<div class="ledger-empty-state"><strong>No ledger data</strong><span>Add ' + escapeHtml(ledgerModeLabel()) + ' records to local storage or keep the seed data in place to render the department ledger.</span></div>';
      return;
    }

    if (!selectedLedgerYear || !getBudgetYears().some(function (year) { return year.year === selectedLedgerYear; })) {
      selectedLedgerYear = currentBudgetYear();
    }

    if (!selectedDepartmentId || !departments.some(function (department) { return department.id === selectedDepartmentId; })) {
      selectedDepartmentId = defaultDepartmentId(records);
      if (!departments.some(function (department) { return department.id === selectedDepartmentId; })) {
        selectedDepartmentId = departments[0].id;
      }
    }

    department = selectedDepartmentId ? departments.find(function (entry) { return entry.id === selectedDepartmentId; }) : null;
    departmentEntries = selectedDepartmentId ? records.filter(function (record) {
      return record.departmentId === selectedDepartmentId;
    }).reduce(function (acc, record) {
      return acc.concat(record.entries);
    }, []) : [];
    selectedDepartmentRecords = selectedDepartmentId ? getActiveDepartmentRecords(records) : [];

    departmentField.innerHTML = departments.map(function (department) {
      var selected = department.id === selectedDepartmentId ? " selected" : "";
      return '<option value="' + escapeHtml(department.id) + '"' + selected + '>' + escapeHtml(department.name) + "</option>";
    }).join("");
    departmentField.value = selectedDepartmentId || "";

    var yearField = $("dvea-year");
    var years = getBudgetYears();
    if (yearField) {
      yearField.innerHTML = years.map(function (year) {
        var selected = year.year === selectedLedgerYear ? " selected" : "";
        return '<option value="' + escapeHtml(year.year) + '"' + selected + '>' + escapeHtml(year.year) + "</option>";
      }).join("");
      yearField.value = selectedLedgerYear;
    }

    var instanceCopy = ACTIVE_INSTANCE.stateName + " / " + ACTIVE_INSTANCE.localGovernmentName;

    if ($("ledger-instance-copy")) {
      $("ledger-instance-copy").textContent = instanceCopy;
    }
    if ($("ledger-department-title")) {
      $("ledger-department-title").textContent = department ? department.name.toUpperCase() : "Select a department";
    }
    if ($("ledger-department-copy")) {
      $("ledger-department-copy").textContent = departmentEntries.length
        ? "The selected department is broken down by category so each vote can be tracked against its estimate within the active filter."
        : "Select a department to load its " + ledgerModeLabel() + " data.";
    }
    if ($("ledger-head-code")) {
      $("ledger-head-code").textContent = department && department.code ? "HEAD:" + department.code : "HEAD: -";
    }
    if ($("ledger-category-count")) {
      $("ledger-category-count").textContent = selectedDepartmentRecords.length.toLocaleString() + " categories";
    }

    filteredRecords = selectedDepartmentId ? getRecordsForActiveFilter(records) : [];
    if (selectedDepartmentId) {
      renderSummaryTable(filteredRecords);
    } else if ($("ledger-summary-body")) {
      $("ledger-summary-body").innerHTML = '<tr><td colspan="7">Select a department to load the category summary.</td></tr>';
    }
    $("dvea-sheet").innerHTML = selectedDepartmentRecords.length
      ? selectedDepartmentRecords.map(renderCategory).join("")
      : '<div class="ledger-empty-state"><strong>Select a department</strong><span>The ledger will load the department data after you choose one from the filter above.</span></div>';

    write(ledgerModeLabel() === "DVRA" ? REVENUE_LEDGER_STORE : LEDGER_STORE, records);
  }

  function bindExports() {
    document.querySelectorAll("[data-ledger-export]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-ledger-export");
        if (action === "excel") {
          exportLedgerToExcel();
          return;
        }
        if (action === "pdf" || action === "print") {
          openLedgerPrintView();
        }
      });
    });
  }

  function setLedgerTab(tab) {
    selectedLedgerTab = tab === "dvea" ? "dvea" : "summary";
    document.querySelectorAll("[data-ledger-tab]").forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-ledger-tab") === selectedLedgerTab);
    });
    if ($("ledger-summary-panel")) {
      $("ledger-summary-panel").classList.toggle("active", selectedLedgerTab === "summary");
    }
    if ($("ledger-dvea-panel")) {
      $("ledger-dvea-panel").classList.toggle("active", selectedLedgerTab === "dvea");
    }
  }

  function renderActiveLedger() {
    if (isSalaryLedgerPage()) {
      renderSalaryLedger();
      return;
    }
    if (isAdvanceLedgerPage()) {
      renderAdvanceLedger();
      return;
    }
    renderLedger();
  }

  function init() {
    var records = getLedgerRecords();
    selectedDepartmentId = "";
    if ($("dvea-department")) {
      $("dvea-department").addEventListener("change", function () {
        selectedDepartmentId = $("dvea-department").value;
        renderActiveLedger();
      });
    }
    if ($("dvea-year")) {
      $("dvea-year").addEventListener("change", function () {
        selectedLedgerYear = $("dvea-year").value;
        selectedSalaryMonth = "";
        renderActiveLedger();
      });
    }
    document.querySelectorAll("[data-salary-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        selectedSalaryTab = button.getAttribute("data-salary-tab") || "template";
        selectedSalaryMonth = "";
        renderSalaryLedger();
      });
    });
    document.querySelectorAll("[data-ledger-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLedgerTab(button.getAttribute("data-ledger-tab"));
      });
    });
    bindExports();
    selectedLedgerYear = currentBudgetYear();
    if (!isAdvanceLedgerPage() && !isSalaryLedgerPage()) {
      setLedgerTab("summary");
    }
    renderActiveLedger();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

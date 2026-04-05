(function () {
    var premiumRange = document.getElementById("premiumRange");
    if (!premiumRange) return;

    var minRange = premiumRange.querySelector(".premium-range-input-min");
    var maxRange = premiumRange.querySelector(".premium-range-input-max");
    var minInput = premiumRange.querySelector(".premium-min-input");
    var maxInput = premiumRange.querySelector(".premium-max-input");
    var badgesWrap = premiumRange.querySelector(".premium-badges");
    var minBadge = premiumRange.querySelector(".premium-badge-min");
    var maxBadge = premiumRange.querySelector(".premium-badge-max");
    var track = premiumRange.querySelector(".premium-track");
    var fill = premiumRange.querySelector(".premium-fill");
    var startHandle = premiumRange.querySelector(".premium-handle-start");
    var endHandle = premiumRange.querySelector(".premium-handle-end");

    if (!minRange || !maxRange || !minInput || !maxInput || !minBadge || !maxBadge || !fill || !startHandle || !endHandle) {
        return;
    }

    var ABS_MIN = Number(minRange.min);
    var ABS_MAX = Number(minRange.max);
    var STEP = Number(minRange.step) || 1;

    function clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    function parseNumber(value) {
        var cleaned = String(value || "").replace(/[^\d]/g, "");
        return cleaned ? Number(cleaned) : NaN;
    }

    function formatINR(value) {
        return new Intl.NumberFormat("en-IN").format(value);
    }

    function formatCompactIN(value) {
        if (value >= 10000000) {
            var cr = value / 10000000;
            return (Number.isInteger(cr) ? cr.toString() : cr.toFixed(1).replace(/\.0$/, "")) + "Cr";
        }
        if (value >= 100000) {
            var lakh = value / 100000;
            return (Number.isInteger(lakh) ? lakh.toString() : lakh.toFixed(1).replace(/\.0$/, "")) + "L";
        }
        return formatINR(value);
    }

    function positionBadge(badge, pct) {
        var host = badgesWrap || track;
        var hostWidth = host ? host.clientWidth : 0;

        if (!hostWidth) {
            badge.style.left = pct + "%";
            return;
        }

        var px = (pct / 100) * hostWidth;
        var half = badge.offsetWidth / 2;
        px = clamp(px, half, hostWidth - half);
        badge.style.left = px + "px";
    }

    function syncUI(source) {
        var minVal = Number(minRange.value);
        var maxVal = Number(maxRange.value);

        if (maxVal - minVal < STEP) {
            if (source === "min") minVal = maxVal - STEP;
            else maxVal = minVal + STEP;
        }

        minVal = clamp(minVal, ABS_MIN, ABS_MAX - STEP);
        maxVal = clamp(maxVal, ABS_MIN + STEP, ABS_MAX);

        minRange.value = minVal;
        maxRange.value = maxVal;

        var minPct = ((minVal - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100;
        var maxPct = ((maxVal - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100;

        fill.style.left = minPct + "%";
        fill.style.width = (maxPct - minPct) + "%";
        startHandle.style.left = minPct + "%";
        endHandle.style.left = maxPct + "%";

        minInput.value = formatINR(minVal);
        maxInput.value = formatINR(maxVal);
        minBadge.textContent = formatCompactIN(minVal);
        maxBadge.textContent = formatCompactIN(maxVal);
        positionBadge(minBadge, minPct);
        positionBadge(maxBadge, maxPct);

        minRange.style.zIndex = minVal > ABS_MAX - STEP * 6 ? "6" : "4";
        maxRange.style.zIndex = "5";
    }

    function syncFromInputs(which) {
        var minVal = parseNumber(minInput.value);
        var maxVal = parseNumber(maxInput.value);

        if (Number.isNaN(minVal)) minVal = Number(minRange.value);
        if (Number.isNaN(maxVal)) maxVal = Number(maxRange.value);

        minVal = Math.round(minVal / STEP) * STEP;
        maxVal = Math.round(maxVal / STEP) * STEP;

        if (which === "min") {
            minVal = clamp(minVal, ABS_MIN, Number(maxRange.value) - STEP);
            minRange.value = minVal;
        } else {
            maxVal = clamp(maxVal, Number(minRange.value) + STEP, ABS_MAX);
            maxRange.value = maxVal;
        }

        syncUI(which);
    }

    minRange.addEventListener("input", function () { syncUI("min"); });
    maxRange.addEventListener("input", function () { syncUI("max"); });

    ["change", "blur"].forEach(function (eventName) {
        minInput.addEventListener(eventName, function () { syncFromInputs("min"); });
        maxInput.addEventListener(eventName, function () { syncFromInputs("max"); });
    });

    window.addEventListener("resize", function () {
        syncUI("max");
    });

    syncUI("max");
})();

(function () {
    var cardList = document.getElementById("enquiryCardList");
    var cardTemplate = document.getElementById("enquiryCardTemplate");
    if (!cardList || !cardTemplate) return;

    var baseCards = [
        {
            status: "Quote Viewed",
            statusClass: "lead-stage-gray",
            id: "#CE00001-STL0046-NB",
            title: "Child Education Plan",
            subtitle: "For Daughter (07)",
            avatar: "./assets/img/Child-Education-Plan.svg",
            logo: "./assets/img/beyond-sure.svg",
            metrics: [
                { label: "Customer Name", value: "Jayendra Suresh Naik" },
                { label: "Location", value: "NA" },
                { label: "Enquiry Date", value: "28 Mar, 2026  |  13:00 PM" },
                { label: "Cover Amount", value: "NA" },
                { label: "Policy Term", value: "NA" }
            ],
            chips: ["Inbuilt Life Cover", "Premium Waver"],
            cta: "Continue"
        },
        {
            status: "KYC Details",
            statusClass: "lead-stage-green",
            id: "#IL00003-STL0024-NB",
            title: "eTouch II",
            subtitle: "Investment Life Insurance for Self (33), Female",
            avatar: "./assets/img/eTouch-II.svg",
            logo: "./assets/img/bajaj-1.svg",
            logoSm: true,
            metrics: [
                { label: "Project Category", value: "Jayendra Suresh Naik" },
                { label: "Location", value: "CG, 495115" },
                { label: "Enquiry Date", value: "27 Mar, 2026  |  12:00 PM" },
                { label: "Cover Amount", value: "\u20B9 15,00,000" },
                { label: "PT", value: "30 Yrs" },
                { label: "PPT", value: "5 Yrs" }
            ],
            chips: ["Life Coverage", "Partial Withdrawals"],
            cta: "\u20B9 7,286"
        },

        {
            status: "Policy Features",
            statusClass: "lead-stage-purple",
            id: "#IL00006-STL0044-NB",
            title: "Saral Jeevan Bima",
            subtitle: "Life Insurance for Self (33), Spouse (35)",
            avatar: "./assets/img/Saral-Jeevan-Bima.svg",
            logo: "./assets/img/sbi-1.svg",
            metrics: [
                { label: "Project Category", value: "Karthikeyan Subramanian" },
                { label: "Location", value: "CG, 495115" },
                { label: "Enquiry Date", value: "26 Mar, 2026  |  14:00 PM" },
                { label: "Cover Amount", value: "\u20B9 5,00,000" },
                { label: "PT", value: "30 Yrs" },
                { label: "PPT", value: "5 Yrs" }
            ],
            chips: ["Accidental Death Benefit"],
            cta: "\u20B9 5,586"
        },
        {
            status: "Insured Details",
            statusClass: "lead-stage-blue",
            id: "#RP00001-STL0021-NB",
            title: "Shriram Life Online Term Plan",
            subtitle: "Retirement Plan for Self (33), Female",
            avatar: "./assets/img/Shriram-Life-Online-Term-Plan.svg",
            logo: "./assets/img/Shiram-genral-ins.svg",
            metrics: [
                { label: "Customer Name", value: "Jayendra Suresh Naik" },
                { label: "Location", value: "Margao, 403601" },
                { label: "Enquiry Date", value: "09 Feb, 2026  |  15:00 PM" },
                { label: "Cover Amount", value: "\u20B9 10,00,000" },
                { label: "Policy Term", value: "10 Yrs" }
            ],
            chips: ["Systematic Withdrawal Facility"],
            cta: "\u20B9 6,879"
        },
        {
            status: "Proposal Details",
            statusClass: "lead-stage-blue",
            id: "#TL00001-STL0029-NB",
            title: "Gen 2 Gen Protect",
            subtitle: "Teem Life for Self (33), Female",
            avatar: "./assets/img/Saral-Jeevan-Bima.svg",
            logo: "./assets/img/Kotak-bank.svg",
            logoSm: true,
            metrics: [
                { label: "Project Category", value: "Karthikeyan Subramanian" },
                { label: "Location", value: "CG, 495115" },
                { label: "Enquiry Date", value: "09 Feb, 2026  |  12:00 PM" },
                { label: "Cover Amount", value: "\u20B9 25,00,000" },
                { label: "PT", value: "30 Yrs" },
                { label: "PPT", value: "5 Yrs" }
            ],
            chips: ["Critical Illness Benefit", "Terminal Illness Benefit"],
            cta: "\u20B9 7,286"
        },
        {
            status: "Nominee Details",
            statusClass: "lead-stage-blue",
            id: "#HE00009-CUS0815-SIBL-NB",
            title: "Lifeline Classic",
            subtitle: "Health Insurance for Self (33), Spouse (35), Mother in Law (77), Father in Law (80)",
            avatar: "./assets/img/Lifeline-Classic.svg",
            logo: "./assets/img/sbigenerak-1.svg",
            metrics: [
                { label: "Customer Name", value: "Shristi Kamble" },
                { label: "Location", value: "Virar, 401303" },
                { label: "Enquiry Date", value: "08 Feb, 2026  |  11:00 AM" },
                { label: "Cover Amount", value: "\u20B9 5,00,000" },
                { label: "Policy Term", value: "1 Yrs" }
            ],
            chips: ["Cumulative Bonus", "Unlimited E-Consultations"],
            cta: "\u20B9 5000",
            // ctaClass: "lead-cta-btn-red"
        },

        {
            status: "Portability",
            statusClass: "lead-stage-purple",
            id: "#HE00230-STL0029-NBM",
            title: "Lifeline Classic",
            subtitle: "Multi-year Health Insurance for Self (33), Female",
            avatar: "./assets/img/Lifeline-Classic.svg",
            logo: "./assets/img/aditya-birla-2.svg",
            metrics: [
                { label: "Customer Name", value: "Shristi Kamble" },
                { label: "Location", value: "Margon, 401303" },
                { label: "Enquiry Date", value: "08 Feb, 2026  |  15:00 PM" },
                { label: "Cover Amount", value: "\u20B9 15,00,000" }
            ],
            chips: ["Premium Lock-in"],
            cta: "\u20B9 15,300",
            // ctaClass: "lead-cta-btn-red"
        },
        {
            status: "Proposal Details",
            statusClass: "lead-stage-red",
            id: "#HL00009-STL0029-NB",
            title: "Care Advantage",
            subtitle: "Portability Health fpr Spouse (35), Mother in Law (67)",
            avatar: "./assets/img/Care-Advantage.svg",
            logo: "./assets/img/Care-Helth.svg",
            metrics: [
                { label: "Customer Name", value: "Shristi Kamble" },
                { label: "Location", value: "Delhi, 411105" },
                { label: "Enquiry Date", value: "07 Mar, 2026  |  20:00 PM" },
                { label: "Cover Amount", value: "\u20B9 10,00,000" },
                { label: "Porting Into", value: "Niva-Bupa" }
            ],
            chips: ["Coverage Continuity", "No Claim Rent Limit"],
            cta: "\u20B9 5,000"
        },
        {
            status: "Quotation Sent",
            statusClass: "lead-stage-red",
            id: "#BK00070-CLU0095-SIBL-NB",
            title: "Lifeline Classic",
            subtitle: "Renewal Health Insurance for Self (33), Female",
            avatar: "./assets/img/Lifeline-Classic.svg",
            logo: "./assets/img/aditya-birla-2.svg",
            metrics: [
                { label: "Customer Name", value: "Shristi Kamble" },
                { label: "Location", value: "Mumbai, 400603" },
                { label: "Enquiry Date", value: "06 Feb, 2026  |  15:00 PM" },
                { label: "Cover Amount", value: "\u20B9 1,00,000" },
                
            ],
            chips: ["50+ Network Hospitals", "No Room Rent Limit"],
            note: "Previous Policy Expiry Date : 14 Apr, 2026",
            cta: "\u20B9 22,987"
        },
        {
            status: "Cheque Collected",
            statusClass: "lead-stage-purple",
            id: "#BK00070-CLU0095-SIBL-NB",
            title: "Aspire",
            subtitle: "Top-up Health for Spouse (35), Son(11), Daughter (10)",
            avatar: "./assets/img/Lifeline-Classic.svg",
            logo: "./assets/img/niva.svg",
            metrics: [
                { label: "Customer Name", value: "Shristi Kamble" },
                { label: "Location", value: "Margon, 400603" },
                { label: "Enquiry Date", value: "07 Feb, 2026  |  15:00 PM" },
                { label: "Cover Amount", value: "\u20B9 3,00,000" },
                
            ],
            chips: ["Post-hospitalization Benefit"],
            cta: "\u20B9 5,000"
        },
        {
            status: "Policy Features",
            statusClass: "lead-stage-gray",
            id: "#CR00082-CLU0095-SIBL-NB",
            title: "Comprehensive Plan",
            subtitle: "Motor - Four Wheeler Insurance | MH-49-UE-7854",
            avatar: "./assets/img/Comprehensive-Plan.svg",
            logo: "./assets/img/ICIC.svg",
            metrics: [
                { label: "Customer Name", value: "Jayendra Suresh Naik" },
                { label: "Location", value: "Mumbai, 400603" },
                { label: "Enquiry Date", value: "07 Feb, 2026  |  08:09 AM" },
                { label: "IDV", value: "\u20B9 5,00,000" },
                { label: "CPA", value: "Yes" },
                { label: "NCB", value: "25%" }
            ],
            chips: ["Zero Depreciation", "Road Side Assistance"],
            cta: "\u20B9 7,567"
        },
        {
            status: "Proposar Summary",
            statusClass: "lead-stage-purple",
            id: "#BK00070-CLU0095-SIBL-NB",
            title: "Third Party Plan",
            subtitle: "Motor - Two Wheeler Insurance | MH-48-EJ-3186",
            avatar: "./assets/img/Third-Party-Plan.svg",
            logo: "./assets/img/sf.svg",
            metrics: [
                { label: "Customer Name", value: "Jayendra Suresh Naik" },
                { label: "Location", value: "Mumbai, 400603" },
                { label: "Enquiry Date", value: "06 Feb, 2026  |  08:09 AM" },
                { label: "IDV", value: "\u20B9 2,50,000" },
                { label: "CPA", value: "Yes" },
                { label: "NCB", value: "20%" }
            ],
            chips: ["Zero Depreciation", "Road Side Assistance"],
            note: "Previous Policy Expiry Date : 14 Apr, 2026",
            cta: "\u20B9 748"
        },
        {
            status: "Quote Viewed",
            statusClass: "lead-stage-gray",
            id: "#GC00001-STL0046-NB",
            title: "Goods Carrying Vehicle",
            subtitle: "MH-48-EJ-3186 : Honda Activa Disc Brake",
            avatar: "./assets/img/Goods-Carrying-Vehicle.svg",
            logo: "./assets/img/beyond-sure.svg",
            metrics: [
                { label: "Customer Name", value: "Jayendra Suresh Naik" },
                { label: "Location", value: "NA" },
                { label: "Enquiry Date", value: "05 Feb, 2026  |  08:09 AM" },
                { label: "IDV", value: "NA" },
                { label: "CPA", value: "NA" },
                { label: "NCB", value: "0" }
            ],
            chips: ["Zero Depreciation", "Road Side Assistance"],
            cta: "Continue"
        },
        {
            status: "Payment Gateway",
            statusClass: "lead-stage-green",
            id: "#PC00111-CUS0243-SIBL-NB",
            title: "Bundle Plan (1 Year OD + 3 Years TP)",
            subtitle: "Motor - PCV Insurance | DL-09-ER-1456",
            avatar: "./assets/img/Comprehensive-Plan.svg",
            logo: "./assets/img/digit-1.svg",
            metrics: [
                { label: "Customer Name", value: "Jayendra Suresh Naik" },
                { label: "Location", value: "Mumbai, 400603" },
                { label: "Enquiry Date", value: "04 Feb, 2026  |  08:09 AM" },
                { label: "IDV", value: "\u20B9 8,00,000" },
                { label: "CPA", value: "Yes" },
                { label: "NCB", value: "20%" }
            ],
            chips: ["Zero Depreciation", "Road Side Assistance"],
            cta: "\u20B9 7,689"
        },

        {
            status: "Vehical Detailes",
            statusClass: "lead-stage-blue",
            id: "#PC00111-CUS0243-SIBL-NB",
            title: "Bundle Plan (1 Year OD + 3 Years TP)",
            subtitle: "Misc. D Vehicle Plan | AP-05-TA-6123 : Eicher PRO 6025 (65 Tonne GVW)-Diesel)",
            avatar: "./assets/img/Tractor.svg",
            logo: "./assets/img/digit-1.svg",
            metrics: [
                { label: "Customer Name", value: "Jayendra Suresh Naik" },
                { label: "Location", value: "Mumbai, 400603" },
                { label: "Enquiry Date", value: "04 Feb, 2026  |  08:09 AM" },
                { label: "IDV", value: "\u20B9 8,00,000" },
                { label: "CPA", value: "Yes" },
                { label: "NCB", value: "20%" }
            ],
            chips: ["Zero Depreciation", "Road Side Assistance"],
            cta: "\u20B9 7,689",
            ctaClass: "lead-cta-btn-red"
        },
       {
            status: "Transaction Failure",
            statusClass: "lead-stage-red",
            id: "#NI00162-STL0024-NB",
            title: "Suraksha Plan",
            subtitle: "Other Insurance for ABC Private Limited",
            avatar: "./assets/img/Time.svg",
            logo: "./assets/img/aditya-birla-2.svg",
            metrics: [
                { label: "Customer Name", value: "Shristi Kamble" },
                { label: "Location", value: "Pune, 412101" },
                { label: "Enquiry Date", value: "20 Jan, 2026  |  09:20 AM" },
                { label: "Cover Amount", value: "\u20B9 17,58,876" },
                { label: "Insurance Type", value: "Techno-Event" }
            ],
            chips: ["Structure Coverage", "Burglary and Theft"],
            cta: "\u20B9 17,586",
            ctaClass: "lead-cta-btn-red"
        },
        {
            status: "Medical Details",
            statusClass: "lead-stage-blue",
            id: "#MOS30001-STL0046-NB",
            title: "MOS-BITE Protector Policy",
            subtitle: "Mosquito Bite Insurance for Self (33), Spouse (35)",
            avatar: "./assets/img/Mosqi.svg",
            logo: "./assets/img/IFFCO-TOKIo.svg",
            metrics: [
                { label: "Customer Name", value: "Shristi Kamble" },
                { label: "Location", value: "MP, 452001" },
                { label: "Enquiry Date", value: "24 Jan, 2026  |  13:00 PM" },
                { label: "Cover Amount", value: "\u20B9 3,45,000" },
                { label: "Covered Diseases", value: "Malaria, Dengue" }
            ],
            chips: ["Hospitalization Coverage", "Vector-borne Diseases"],
            cta: "\u20B9 8,765"
        },
        {
            status: "Awaiting Customer Response",
            statusClass: "lead-stage-orange",
            id: "#TR00162-STL0024-NB",
            title: "Silver Plus",
            subtitle: "Travel Insurance for Self (33), Spouse (35)",
            avatar: "./assets/img/Airoplne.svg",
            logo: "./assets/img/Tata.svg",
            logoSm: true,
            metrics: [
                { label: "Country", value: "Canada & 3 More" },
                { label: "Visa Type", value: "Visitor" },
                { label: "Enquiry Date", value: "23 Jan, 2026  |  12:50 PM" },
                { label: "Cover Amount", value: "$ 250,000" },
                { label: "Members", value: "4" },
                { label: "Purpose", value: "Travel" }
            ],
            chips: ["Zero Depreciation", "Road Side Assistance"],
            cta: "\u20B9 6,515"
        },
        {
            status: "Call Ringing",
            statusClass: "lead-stage-orange",
            id: "#OS00001-POSP300048929-NB",
            title: "Explore Ultra",
            subtitle: "Overseas Student Travel Insurance",
            avatar: "./assets/img/Educ.svg",
            logo: "./assets/img/Cara-health.svg",
            metrics: [
                { label: "Country", value: "United Kingdom" },
                { label: "Visa Type", value: "Student" },
                { label: "Enquiry Date", value: "22 Jan, 2026  |  11:00 AM" },
                { label: "Cover Amount", value: "$ 300,000" },
                { label: "Policy Period", value: "2 Yrs" },
                { label: "Purpose", value: "Education" }
            ],
            chips: ["Tuition Fee Cover", "Medical Emergency"],
            cta: "\u20B9 9,420"
        },
        {
            status: "Proposal Rejected",
            statusClass: "lead-stage-red",
            id: "#PR00811-STL0032-NB",
            title: "Lifeline Classic",
            subtitle: "Health Insurance for Self and Family",
            avatar: "./assets/img/Lifeline-Classic.svg",
            logo: "./assets/img/hdfc-1.svg",
            metrics: [
                { label: "Customer Name", value: "Shristi Kamble" },
                { label: "Location", value: "Pune, 412101" },
                { label: "Enquiry Date", value: "21 Jan, 2026  |  10:30 AM" },
                { label: "Cover Amount", value: "\u20B9 12,00,000" },
                { label: "Policy Term", value: "2 Yrs" }
            ],
            chips: ["Cashless Hospitals", "Pre & Post Hospitalization"],
            cta: "\u20B9 27,000",
            ctaClass: "lead-cta-btn-red"
        }

    ];

    var TARGET_CARD_COUNT = 35;
    var cards = [];

    for (var i = 0; i < TARGET_CARD_COUNT; i++) {
        var source = baseCards[i % baseCards.length];
        cards.push({
            status: source.status,
            statusClass: source.statusClass,
            id: source.id,
            title: source.title,
            subtitle: source.subtitle,
            avatar: source.avatar,
            logo: source.logo,
            logoSm: source.logoSm,
            metrics: (source.metrics || []).map(function (metric) {
                return {
                    label: metric.label,
                    value: metric.value,
                    divider: metric.divider
                };
            }),
            chips: (source.chips || []).slice(),
            note: source.note,
            cta: source.cta,
            ctaClass: source.ctaClass
        });
    }

    function createMetricNode(metric, idx, totalCount) {
        var item = document.createElement("div");
        var isDivider = metric.divider || (totalCount <= 5 ? idx === 2 : idx === 2);
        item.className = "metric-item" + (isDivider ? " with-divider" : "");

        var label = document.createElement("span");
        label.className = "metric-label";
        label.textContent = metric.label || "";

        var value = document.createElement("strong");
        value.className = "metric-value";
        value.textContent = metric.value || "";

        item.appendChild(label);
        item.appendChild(value);
        return item;
    }

    function createChipNode(text, className) {
        var chip = document.createElement("span");
        chip.className = className;
        chip.textContent = text || "";
        return chip;
    }

    var fragment = document.createDocumentFragment();

    cards.forEach(function (card) {
        var cardNode = cardTemplate.content.firstElementChild.cloneNode(true);
        var stageNode = cardNode.querySelector(".lead-stage");
        var avatarNode = cardNode.querySelector('[data-bind="avatar"]');
        var logoNode = cardNode.querySelector('[data-bind="logo"]');
        var idNode = cardNode.querySelector('[data-bind="id"]');
        var titleNode = cardNode.querySelector('[data-bind="title"]');
        var subtitleNode = cardNode.querySelector('[data-bind="subtitle"]');
        var metricsNode = cardNode.querySelector('[data-bind="metrics"]');
        var chipsNode = cardNode.querySelector('[data-bind="chips"]');
        var ctaNode = cardNode.querySelector('[data-bind="cta"]');

        stageNode.classList.add(card.statusClass || "");
        stageNode.textContent = card.status || "";

        avatarNode.src = card.avatar || "";
        logoNode.src = card.logo || "";
        logoNode.className = card.logoSm ? "lead-brand-logo lead-brand-logo-sm" : "lead-brand-logo";

        idNode.textContent = card.id || "";
        titleNode.textContent = card.title || "";
        subtitleNode.textContent = card.subtitle || "";

        metricsNode.className = (card.metrics && card.metrics.length >= 6) ? "lead-metrics lead-metrics-6" : "lead-metrics";
        var metricsCount = (card.metrics || []).length;
        (card.metrics || []).forEach(function (metric, idx) {
            metricsNode.appendChild(createMetricNode(metric, idx, metricsCount));
        });

        (card.chips || []).forEach(function (chipText) {
            chipsNode.appendChild(createChipNode(chipText, "lead-chip"));
        });
        if (card.note) {
            chipsNode.appendChild(createChipNode(card.note, "lead-note"));
        }

        ctaNode.textContent = card.cta || "";
        ctaNode.className = "btn " + (card.ctaClass ? "lead-cta-btn " + card.ctaClass : "lead-cta-btn");

        fragment.appendChild(cardNode);
    });

    cardList.innerHTML = "";
    cardList.appendChild(fragment);
})();

(function () {
    var applyBtn = document.querySelector(".filter-apply-btn");
    var filtersOffcanvas = document.getElementById("filtersOffcanvas");
    if (!applyBtn || !filtersOffcanvas) return;

    applyBtn.addEventListener("click", function () {
        if (window.innerWidth >= 992) return;
        if (!filtersOffcanvas.classList.contains("show")) return;
        if (typeof bootstrap === "undefined" || !bootstrap.Offcanvas) return;

        var offcanvasInstance = bootstrap.Offcanvas.getInstance(filtersOffcanvas);
        if (offcanvasInstance) offcanvasInstance.hide();
    });
})();

(function () {
    var mobileNavbar = document.getElementById("mobileNavbar");
    if (!mobileNavbar) return;

    var menuLinks = mobileNavbar.querySelectorAll(".nav-link");
    if (!menuLinks.length) return;

    menuLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (!mobileNavbar.classList.contains("show")) return;
            if (typeof bootstrap === "undefined" || !bootstrap.Offcanvas) return;

            bootstrap.Offcanvas.getOrCreateInstance(mobileNavbar).hide();
        });
    });
})();

(function () {
    var floatingHelpBtn = document.getElementById("floatingHelpBtn");
    var chatbotPopup = document.getElementById("chatbotPopup");
    var chatbotCloseBtn = document.getElementById("chatbotCloseBtn");
    var chatbotForm = document.getElementById("chatbotForm");
    var chatbotInput = document.getElementById("chatbotInput");
    var chatbotMessages = document.getElementById("chatbotMessages");
    if (!floatingHelpBtn || !chatbotPopup) return;

    function togglePopup(open) {
        var shouldOpen = typeof open === "boolean" ? open : !chatbotPopup.classList.contains("is-open");
        chatbotPopup.classList.toggle("is-open", shouldOpen);
        chatbotPopup.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
        floatingHelpBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        if (shouldOpen && chatbotInput) chatbotInput.focus();
    }

    floatingHelpBtn.addEventListener("click", function () {
        togglePopup();
    });

    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener("click", function () {
            togglePopup(false);
        });
    }

    if (chatbotForm && chatbotInput && chatbotMessages) {
        chatbotForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var text = chatbotInput.value.trim();
            if (!text) return;

            var userMsg = document.createElement("div");
            userMsg.className = "chatbot-msg chatbot-msg-user";
            userMsg.textContent = text;
            chatbotMessages.appendChild(userMsg);

            var botMsg = document.createElement("div");
            botMsg.className = "chatbot-msg chatbot-msg-bot";
            botMsg.textContent = "Thanks! Our support team will connect with you shortly.";
            chatbotMessages.appendChild(botMsg);

            chatbotInput.value = "";
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") togglePopup(false);
    });
})();

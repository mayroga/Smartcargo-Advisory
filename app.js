const BASE_URL = "https://smartcargo-aipa.onrender.com";

const i18n = {
    en: {
        header: "TECHNICAL ADVISORY DASHBOARD",
        legal: "ADVISORY DISCLOSURE: SmartCargo AIPA provides independent quality audits. We are not a Forwarder, TSA, or IATA authority. Final cargo validation is reserved for licensed carriers.",
        step1: "1. DATA AUDIT",
        step2: "2. VISUAL ADVISOR (3 PHOTOS MAX)",
        issue: "TECHNICAL IRREGULARITY",
        remedy: "SUGGESTED REMEDIATION"
    },
    es: {
        header: "PANEL DE ASESORÍA TÉCNICA",
        legal: "AVISO PROFESIONAL: SmartCargo AIPA provee auditorías de calidad independientes. No somos Forwarder, TSA, ni autoridad IATA. La validación final está reservada para transportistas autorizados.",
        step1: "1. AUDITORÍA DE DATOS",
        step2: "2. ASESOR VISUAL (MÁX. 3 FOTOS)",
        issue: "IRREGULARIDAD TÉCNICA",
        remedy: "REMEDIACIÓN SUGERIDA"
    }
};

function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    const d = i18n[lang];
    document.getElementById("mainHeader").innerText = d.header;
    document.getElementById("disclaimer").innerText = d.legal;
    // ... apply translations to other labels
}

// Visual Audit with Photo Limit
document.getElementById("advForm").onsubmit = async (e) => {
    e.preventDefault();
    const out = document.getElementById("advResponse");
    const lang = localStorage.getItem("lang") || "en";
    out.innerText = lang === 'en' ? "Analyzing..." : "Analizando...";

    const fd = new FormData(e.target);
    fd.append("awb", document.getElementById("awbInput").value);

    const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
    const data = await res.json();
    
    out.innerHTML = `<div class="p-4 bg-gray-50 border-l-4 border-blue-600 font-sans text-sm">${data.data}</div>`;
    if(data.remaining !== undefined) {
        document.getElementById("counter").innerText = `Photos left: ${data.remaining}`;
    }
};

// Data Audit with 2-Point Limit
document.getElementById("auditForm").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = await fetch(`${BASE_URL}/audit-basic`, { method: "POST", body: fd });
    const data = await res.json();
    
    const lang = localStorage.getItem("lang") || "en";
    const reportHtml = data.reports.map(r => `
        <div class="mb-4 p-3 bg-white border border-gray-200 shadow-sm">
            <p class="text-xs font-bold text-red-600 uppercase">${i18n[lang].issue}</p>
            <p class="text-sm mb-2">${r.issue}</p>
            <p class="text-xs font-bold text-green-700 uppercase border-t pt-1">${i18n[lang].remedy}</p>
            <p class="text-sm italic font-semibold">${r.suggestion}</p>
        </div>
    `).join("");
    
    document.getElementById("reportContainer").innerHTML = reportHtml;
};

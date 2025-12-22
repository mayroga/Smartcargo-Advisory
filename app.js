const BASE_URL = "https://smartcargo-aipa.onrender.com";

const content = {
    en: {
        title: "SMARTCARGO AIPA | TECHNICAL ADVISORY SYSTEM",
        legal: "PROFESSIONAL DISCLOSURE: SmartCargo AIPA operates as an independent technical advisory tool. All data provided serves as a pre-shipment quality audit. Official classification and cargo acceptance are reserved for licensed carriers and regulated authorities.",
        execute: "RUN TECHNICAL AUDIT",
        issue: "TECHNICAL IRREGULARITY",
        remediation: "RECOMMENDED REMEDIATION",
        placeholder: "Enter technical query or upload image for visual audit..."
    },
    es: {
        title: "SMARTCARGO AIPA | SISTEMA DE ASESORÍA TÉCNICA",
        legal: "AVISO PROFESIONAL: SmartCargo AIPA opera como una herramienta independiente de asesoría técnica. Toda la información sirve como auditoría de calidad previa al embarque. La clasificación oficial y aceptación de carga están reservadas para transportistas licenciados y autoridades reguladas.",
        execute: "EJECUTAR AUDITORÍA TÉCNICA",
        issue: "IRREGULARIDAD TÉCNICA",
        remediation: "REMEDIACIÓN RECOMENDADA",
        placeholder: "Ingrese consulta técnica o suba imagen para auditoría visual..."
    }
};

function updateLanguage(lang) {
    localStorage.setItem("lang", lang);
    const c = content[lang];
    document.getElementById("mainTitle").innerText = c.title;
    document.getElementById("disclaimerText").innerText = c.legal;
    document.getElementById("valBtn").innerText = c.execute;
    document.getElementById("advPrompt").placeholder = c.placeholder;
}

// PROCESO DE AUDITORÍA
document.getElementById("cargoForm").onsubmit = async (e) => {
    e.preventDefault();
    const lang = localStorage.getItem("lang") || "en";
    const fd = new FormData(e.target);
    
    const res = await fetch(`${BASE_URL}/cargas`, { method: "POST", body: fd });
    const data = await res.json();
    
    document.getElementById("riskDisplay").classList.remove("hidden");
    const container = document.getElementById("riskAlerts");
    
    container.innerHTML = data.reports.map(r => `
        <div style="border-left: 5px solid #d32f2f; background: #f9f9f9; padding: 15px; margin-bottom: 10px;">
            <p style="color:#d32f2f; font-weight:bold; font-size: 12px; margin:0;">${content[lang].issue}</p>
            <p style="font-family:'Courier New', monospace; margin: 5px 0;">${r.issue}</p>
            <p style="color:#2e7d32; font-weight:bold; font-size: 12px; margin: 10px 0 0 0; border-top: 1px solid #ddd;">${content[lang].remediation}</p>
            <p style="font-style:italic; font-weight: bold; color: #333;">${r.remediation}</p>
        </div>
    `).join("");
};

// ASESOR IA PROFESIONAL
document.getElementById("advForm").onsubmit = async (e) => {
    e.preventDefault();
    const out = document.getElementById("advResponse");
    out.innerText = "Analyzing technical parameters...";
    
    const fd = new FormData(e.target);
    const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
    const data = await res.json();
    out.innerText = data.data;
};

document.addEventListener("DOMContentLoaded", () => {
    updateLanguage(localStorage.getItem("lang") || "en");
});

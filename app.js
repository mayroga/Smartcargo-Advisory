const BASE_URL = "https://smartcargo-aipa.onrender.com";

const i18n = {
    en: {
        pay: "ACTIVATE ADVISORY", val: "AUDIT CARGO", wait: "Analyzing Safety...",
        disc: "LEGAL DISCLAIMER: SmartCargo AIPA is a technical advisory tool. Final acceptance by airline/TSA is mandatory. / AVISO: Asesoría técnica basada en estándares internacionales.",
        risk: "RISK LEVEL", solution: "TECHNICAL SOLUTION"
    },
    es: {
        pay: "ACTIVAR ASESORÍA", val: "AUDITAR CARGA", wait: "Analizando Seguridad...",
        disc: "AVISO LEGAL: SmartCargo AIPA es asesoría técnica. La aceptación final depende de la aerolínea/TSA. / LEGAL: Technical advisory tool.",
        risk: "NIVEL DE RIESGO", solution: "SOLUCIÓN TÉCNICA"
    }
};

// Cambio de Idioma (Default Inglés)
function updateLang(lang) {
    localStorage.setItem("lang", lang);
    const d = i18n[lang];
    document.getElementById("payBtn").innerText = d.pay;
    document.getElementById("valBtn").innerText = d.val;
    if(document.getElementById("disclaimerText")) document.getElementById("disclaimerText").innerText = d.disc;
}

// Ejecución de Auditoría (Skid, Drum, Crate)
document.getElementById("cargoForm").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const lang = localStorage.getItem("lang") || "en";

    const res = await fetch(`${BASE_URL}/cargas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            awb: fd.get("awb"),
            length: parseFloat(fd.get("length")),
            width: parseFloat(fd.get("width")),
            height: parseFloat(fd.get("height")),
            weight: parseFloat(fd.get("weight")),
            ispm15_seal: fd.get("ispm15_seal"),
            pkg_type: fd.get("pkg_type"), // Selección de tipo de empaque
            unit_system: document.getElementById("unitSelect").value
        })
    });
    
    const data = await res.json();
    const display = document.getElementById("riskDisplay");
    display.classList.remove("hidden");
    
    const scoreEl = document.getElementById("riskScore");
    scoreEl.innerText = `${data.score}% ${i18n[lang].risk}`;
    
    // Semáforo de Riesgo
    scoreEl.className = "text-6xl font-black " + (data.score < 30 ? "text-green-600" : data.score < 70 ? "text-yellow-500" : "text-red-600 animate-pulse");
    
    document.getElementById("riskAlerts").innerHTML = `
        <div class="font-bold text-lg border-b mb-2">${i18n[lang].solution}:</div>
        ${data.alerts.map(a => `<div class="p-2 bg-gray-50 mb-1">🛑 ${a}</div>`).join("")}
        <div class="text-sm mt-2 text-blue-700">${data.details}</div>
    `;
};

// Asesor IA con Imagen (DG, TSA, Crushing)
document.getElementById("advForm").onsubmit = async (e) => {
    e.preventDefault();
    const out = document.getElementById("advResponse");
    out.innerText = i18n[localStorage.getItem("lang") || "en"].wait;

    const fd = new FormData();
    fd.append("prompt", document.getElementById("advPrompt").value);
    const photo = document.getElementById("cargoImg").files[0];
    if (photo) fd.append("image", photo);

    const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
    const data = await res.json();
    out.innerText = data.data;
};

document.addEventListener("DOMContentLoaded", () => {
    const isAuth = window.location.search.includes("access=granted") || localStorage.getItem("auth_aipa") === "true";
    if (isAuth) {
        localStorage.setItem("auth_aipa", "true");
        const vBtn = document.getElementById("valBtn");
        vBtn.disabled = false;
        vBtn.classList.remove("opacity-50", "btn-disabled");
    }
    updateLang(localStorage.getItem("lang") || "en");
});

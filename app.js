const BASE_URL = "https://smartcargo-aipa.onrender.com";

const dictionary = {
    en: {
        title: "SMARTCARGO AIPA | DIGITAL ADVISOR",
        legal: "TECHNICAL ADVISORY ONLY: We are NOT TSA, Forwarders, or Carriers. We provide technical guidance to help you reach 100% compliance. Final execution is responsibility of the user.",
        btn_audit: "RUN TECHNICAL AUDIT",
        btn_pay: "ACTIVATE ADVISOR",
        issue: "IRREGULARITY DETECTED",
        sol: "TECHNICAL SOLUTION",
        placeholder: "Ask about DG, Stacking, Labels..."
    },
    es: {
        title: "SMARTCARGO AIPA | ASESOR DIGITAL",
        legal: "SOLO ASESORÍA TÉCNICA: NO somos TSA, Forwarders ni Aerolíneas. Proveemos guía técnica para alcanzar 100% cumplimiento. La ejecución final es responsabilidad del usuario.",
        btn_audit: "EJECUTAR AUDITORÍA",
        btn_pay: "ACTIVAR ASESOR",
        issue: "IRREGULARIDAD DETECTADA",
        sol: "SOLUCIÓN TÉCNICA",
        placeholder: "Pregunte sobre DG, Apilamiento, Etiquetas..."
    }
};

function changeLanguage(lang) {
    localStorage.setItem("lang", lang);
    const d = dictionary[lang];
    
    document.getElementById("mainTitle").innerText = d.title;
    document.getElementById("disclaimerText").innerText = d.legal;
    document.getElementById("valBtn").innerText = d.btn_audit;
    document.getElementById("payBtn").innerText = d.btn_pay;
    document.getElementById("advPrompt").placeholder = d.placeholder;
    // (Añadir aquí el resto de IDs de labels de tu HTML para traducción total)
}

document.getElementById("cargoForm").onsubmit = async (e) => {
    e.preventDefault();
    const lang = localStorage.getItem("lang") || "en";
    const fd = new FormData(e.target);
    
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
            pkg_type: fd.get("pkgTypeSelect").value,
            unit_system: document.getElementById("unitSelect").value
        })
    });
    
    const data = await res.json();
    const container = document.getElementById("riskAlerts");
    container.innerHTML = data.reports.map(r => `
        <div class="mb-4 border-2 border-red-500 rounded">
            <div class="bg-red-500 text-white p-1 text-xs font-bold uppercase">${dictionary[lang].issue}</div>
            <div class="p-2 text-sm font-mono bg-white">${r.issue}</div>
            <div class="bg-green-600 text-white p-1 text-xs font-bold uppercase">${dictionary[lang].sol}</div>
            <div class="p-2 text-sm italic font-bold bg-green-50">${r.solution}</div>
        </div>
    `).join("");
};

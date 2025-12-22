const BASE_URL = "https://smartcargo-aipa.onrender.com";
let qCount = 0;

const i18n = {
    en: {
        pay: "ACTIVATE SERVICE", val: "RUN AUDIT", wait: "Processing...",
        pUser: "ADMIN USER:", pPass: "ADMIN PASS:", 
        disc: "LEGAL DISCLAIMER: Technical advisory based on IATA. User responsible for final airline verification. / AVISO LEGAL: Asesoría técnica IATA. El usuario es responsable de la verificación final."
    },
    es: {
        pay: "ACTIVAR SERVICIO", val: "EJECUTAR AUDITORÍA", wait: "Procesando...",
        pUser: "USUARIO ADMIN:", pPass: "CLAVE ADMIN:",
        disc: "AVISO LEGAL: Asesoría técnica IATA. El usuario es responsable de la verificación final. / LEGAL DISCLAIMER: Technical advisory based on IATA."
    }
};

function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    const d = i18n[lang];
    document.getElementById("payBtn").innerText = d.pay;
    document.getElementById("valBtn").innerText = d.val;
    if(document.getElementById("disclaimerText")) document.getElementById("disclaimerText").innerText = d.disc;
}

async function handleAccess() {
    const lang = localStorage.getItem("lang") || "en";
    const awb = document.getElementsByName("awb")[0]?.value || "AWB-000";
    const user = prompt(i18n[lang].pUser);
    let pass = user ? prompt(i18n[lang].pPass) : null;

    const fd = new URLSearchParams({ amount: 65, awb });
    if(user) { fd.append('user', user); fd.append('password', pass); }

    const res = await fetch(`${BASE_URL}/create-payment`, { method: 'POST', body: fd });
    const result = await res.json();
    if(result.url) {
        if(result.url.includes("access=granted")) localStorage.setItem("auth_aipa", "true");
        window.location.href = result.url;
    }
}

// Lógica de Auditoría
document.getElementById("cargoForm").onsubmit = async (e) => {
    e.preventDefault();
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
            unit_system: document.getElementById("unitSelect").value
        })
    });
    const data = await res.json();
    const s = document.getElementById("riskScore");
    document.getElementById("riskDisplay").classList.remove("hidden");
    s.innerText = `${data.score}% RISK`;
    s.className = "text-6xl font-black " + (data.score < 35 ? "text-green-600" : data.score < 70 ? "text-amber-500" : "text-red-600 animate-pulse");
    document.getElementById("riskAlerts").innerHTML = data.alerts.map(a => `<div class="p-2 border-b">🛑 ${a}</div>`).join("");
};

// Asesor IA
document.getElementById("advForm").onsubmit = async (e) => {
    e.preventDefault();
    const out = document.getElementById("advResponse");
    if (qCount >= 3) return alert("Limit reached / Límite alcanzado");
    
    out.innerText = "Consulting Experts...";
    const fd = new FormData();
    fd.append("prompt", document.getElementById("advPrompt").value);
    const photo = document.getElementById("cargoImg").files[0];
    if (photo) fd.append("image", photo);

    const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
    const data = await res.json();
    out.innerText = data.data;
    qCount++;
};

document.addEventListener("DOMContentLoaded", () => {
    const isAuth = window.location.search.includes("access=granted") || localStorage.getItem("auth_aipa") === "true";
    if (isAuth) {
        localStorage.setItem("auth_aipa", "true");
        const vBtn = document.getElementById("valBtn");
        vBtn.disabled = false;
        vBtn.classList.remove("opacity-50", "btn-disabled");
        vBtn.classList.add("bg-blue-600");
    }
    document.getElementById("payBtn").onclick = handleAccess;
    setLanguage(localStorage.getItem("lang") || "en");
});

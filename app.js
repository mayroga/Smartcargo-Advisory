const BASE_URL = "https://smartcargo-aipa.onrender.com";

// --- TRADUCTOR DE INTERFAZ ---
const translations = {
    es: {
        legal: "AVISO: SmartCargo AIPA es un servicio de asesoría técnica informativa. La responsabilidad final es del expedidor.",
        sec1: "AUDITORÍA DE RIESGO",
        sec2: "CONSULTORÍA IA & VISIÓN",
        pay: "PAGAR Y ACTIVAR VALIDACIÓN",
        val: "EJECUTAR AUDITORÍA TÉCNICA",
        photo: "Subir foto de la carga",
        wait: "Consultando asesor experto..."
    },
    en: {
        legal: "NOTICE: SmartCargo AIPA is a technical advisory service. Final responsibility rests with the shipper.",
        sec1: "RISK AUDIT",
        sec2: "AI CONSULTANCY & VISION",
        pay: "PAY AND ACTIVATE VALIDATION",
        val: "RUN TECHNICAL AUDIT",
        photo: "Upload cargo photo",
        wait: "Consulting expert advisor..."
    }
};

function changeLang(lang) {
    const t = translations[lang];
    document.getElementById("legalText").innerText = t.legal;
    document.getElementById("section1Title").innerText = t.sec1;
    document.getElementById("section2Title").innerText = t.sec2;
    document.getElementById("payBtn").innerText = t.pay;
    document.getElementById("valBtn").innerText = t.val;
    document.getElementById("photoLabel").innerText = t.photo;
    localStorage.setItem("lang", lang);
}

// --- PAGOS STRIPE ---
document.getElementById("payBtn").onclick = async () => {
    const awb = document.getElementsByName("awb")[0].value;
    const price = document.getElementById("priceSelect").value;
    
    const user = prompt("Admin User (Opcional):");
    const pass = user ? prompt("Admin Pass:") : null;

    const body = new URLSearchParams({ amount: price, awb: awb, description: `Service AWB ${awb}` });
    if (user) { body.append("user", user); body.append("password", pass); }

    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body });
    const data = await res.json();
    if (data.url) {
        window.location.href = data.url;
        if (user) localStorage.setItem("admin", "true");
    }
};

// --- AUDITORÍA Y RIESGO ---
document.getElementById("cargoForm").onsubmit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    
    const res = await fetch(`${BASE_URL}/cargas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fd)
    });
    const data = await res.json();
    
    const resDiv = document.getElementById("riskResult");
    const scoreDiv = document.getElementById("riskScore");
    resDiv.classList.remove("hidden");

    // SEMÁFORO DE COLORES
    scoreDiv.innerText = `${data.alertaScore}% RISK`;
    scoreDiv.className = "text-4xl font-black mb-2 " + 
        (data.alertaScore < 30 ? "text-green-600" : data.alertaScore < 70 ? "text-amber-500" : "text-red-600 animate-pulse");

    document.getElementById("volData").innerHTML = `Volumen: ${data.volumen} | Peso Vol: ${data.peso_vol} kg`;
    document.getElementById("riskAlerts").innerHTML = data.alerts.map(a => `<div>🛑 ${a}</div>`).join("");
};

// --- ASESOR IA VISIÓN ---
document.getElementById("advForm").onsubmit = async (e) => {
    e.preventDefault();
    const prompt = document.getElementById("advPrompt").value;
    const img = document.getElementById("cargoImg").files[0];
    const out = document.getElementById("advResponse");

    out.innerText = translations[localStorage.getItem("lang") || 'es'].wait;
    const formData = new FormData();
    formData.append("prompt", prompt || "Analiza esta carga bilingüe.");
    if (img) formData.append("image", img);

    const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: formData });
    const data = await res.json();
    out.innerText = data.data;
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.search.includes("access=granted") || localStorage.getItem("admin")) {
        const v = document.getElementById("valBtn");
        v.disabled = false; v.classList.remove("opacity-50", "cursor-not-allowed");
    }
    changeLang(localStorage.getItem("lang") || 'es');
});

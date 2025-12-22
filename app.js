const BASE_URL = "https://smartcargo-aipa.onrender.com";
let queryCount = 0;
const MAX_QUERIES = 3;

const langDict = {
    es: {
        pay: "PAGAR Y ACTIVAR", val: "Ejecutar Auditoría", wait: "Consultando IA...",
        limit: "SESIÓN FINALIZADA.", pUser: "USUARIO ADMIN:", pPass: "CLAVE ADMIN:",
        qText: "Consultas", disclaimer: "AVISO LEGAL: SmartCargo AIPA es asesoría técnica basada en estándares IATA."
    },
    en: {
        pay: "PAY AND ACTIVATE", val: "Run Audit", wait: "Consulting AI...",
        limit: "SESSION FINISHED.", pUser: "ADMIN USER:", pPass: "ADMIN PASS:",
        qText: "Queries", disclaimer: "LEGAL DISCLAIMER: SmartCargo AIPA is technical advisory based on IATA standards."
    }
};

function changeLang(lang) {
    localStorage.setItem("lang", lang);
    const d = langDict[lang];
    document.getElementById("payBtn").innerText = d.pay;
    document.getElementById("valBtn").innerText = d.val;
    document.getElementById("qCount").innerText = `${d.qText}: ${queryCount}/${MAX_QUERIES}`;
    if(document.getElementById("disclaimerText")) document.getElementById("disclaimerText").innerText = d.disclaimer;
}

async function handlePaymentClick() {
    const lang = localStorage.getItem("lang") || "es";
    const awb = document.getElementsByName("awb")[0].value || "000";
    const user = prompt(langDict[lang].pUser);
    let pass = null;
    if (user) pass = prompt(langDict[lang].pPass);

    const formData = new URLSearchParams({ amount: 65, awb: awb });
    if (user) { formData.append('user', user); formData.append('password', pass); }

    const res = await fetch(`${BASE_URL}/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });
    const result = await res.json();
    if (result.url) {
        if (result.url.includes("access=granted")) localStorage.setItem("auth_aipa", "true");
        window.location.href = result.url;
    }
}

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
    document.getElementById("riskDisplay").classList.remove("hidden");
    const s = document.getElementById("riskScore");
    s.innerText = `${data.score}% RISK`;
    s.className = "text-5xl font-black " + (data.score < 35 ? "text-green-600" : data.score < 70 ? "text-amber-500" : "text-red-600 animate-pulse");
    document.getElementById("volData").innerText = data.details;
    document.getElementById("riskAlerts").innerHTML = data.alerts.map(a => `<div>🛑 ${a}</div>`).join("");
};

document.getElementById("advForm").onsubmit = async (e) => {
    e.preventDefault();
    const out = document.getElementById("advResponse");
    if (queryCount >= MAX_QUERIES) return alert(langDict[localStorage.getItem("lang") || "es"].limit);

    out.innerText = langDict[localStorage.getItem("lang") || "es"].wait;
    const fd = new FormData();
    fd.append("prompt", document.getElementById("advPrompt").value);
    const photo = document.getElementById("cargoImg").files[0];
    if (photo) fd.append("image", photo);

    const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
    const data = await res.json();
    out.innerText = data.data;
    queryCount++;
    document.getElementById("qCount").innerText = `Queries: ${queryCount}/${MAX_QUERIES}`;
};

document.addEventListener("DOMContentLoaded", () => {
    const isAuth = window.location.search.includes("access=granted") || localStorage.getItem("auth_aipa") === "true";
    if (isAuth) {
        localStorage.setItem("auth_aipa", "true");
        document.getElementById("valBtn").disabled = false;
        document.getElementById("valBtn").classList.remove("opacity-50", "btn-disabled");
    }
    document.getElementById("payBtn").onclick = handlePaymentClick;
    changeLang(localStorage.getItem("lang") || "es");
});

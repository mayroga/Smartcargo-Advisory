const BASE_URL = "https://smartcargo-aipa.onrender.com";
let qCount = 0;

const texts = {
    es: {
        pay: "PAGAR Y ACTIVAR",
        val: "EJECUTAR AUDITORÍA",
        wait: "Consultando...",
        limit: "Límite alcanzado.",
        pUser: "USUARIO ADMIN:",
        pPass: "CONTRASEÑA ADMIN:",
        disclaimer: "AVISO LEGAL: SmartCargo AIPA es asesoría técnica basada en estándares IATA. El usuario es responsable de verificar la estiba final. No hay responsabilidad por rechazos si los datos difieren."
    },
    en: {
        pay: "PAY AND ACTIVATE",
        val: "RUN AUDIT",
        wait: "Consulting...",
        limit: "Limit reached.",
        pUser: "ADMIN USERNAME:",
        pPass: "ADMIN PASSWORD:",
        disclaimer: "LEGAL DISCLAIMER: SmartCargo AIPA is technical advisory based on IATA standards. User is responsible for final stowage verification. No liability for rejections if data differs."
    }
};

function changeLang(l) {
    localStorage.setItem("lang", l);
    location.reload();
}

async function handlePayment() {
    const lang = localStorage.getItem("lang") || "es";
    const awb = document.getElementsByName("awb")[0].value || "000";
    const amount = document.getElementById("priceSelect").value;
    
    const user = prompt(texts[lang].pUser);
    let pass = null;
    if (user) pass = prompt(texts[lang].pPass);

    const formData = new URLSearchParams({ amount, awb });
    if (user) formData.append("user", user);
    if (pass) formData.append("password", pass);

    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: formData });
    const data = await res.json();
    
    if (data.url.includes("access=granted")) {
        localStorage.setItem("smartcargo_auth", "true");
    }
    window.location.href = data.url;
}

document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "es";
    const auth = localStorage.getItem("smartcargo_auth") === "true" || window.location.search.includes("access=granted");

    // Traducciones
    document.getElementById("payBtn").innerText = texts[lang].pay;
    document.getElementById("valBtn").innerText = texts[lang].val;
    if(document.getElementById("disclaimerText")) {
        document.getElementById("disclaimerText").innerText = texts[lang].disclaimer;
    }

    // Activación de Auditoría
    if (auth) {
        localStorage.setItem("smartcargo_auth", "true");
        const btn = document.getElementById("valBtn");
        btn.disabled = false;
        btn.classList.remove("btn-disabled", "opacity-50");
        btn.classList.add("bg-blue-600", "hover:bg-blue-700");
    }

    document.getElementById("payBtn").onclick = handlePayment;

    // LÓGICA DE AUDITORÍA Y COLORES
    document.getElementById("cargoForm").onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = {
            awb: fd.get("awb"),
            length: parseFloat(fd.get("length")),
            width: parseFloat(fd.get("width")),
            height: parseFloat(fd.get("height")),
            weight: parseFloat(fd.get("weight")),
            ispm15_seal: fd.get("ispm15_seal"),
            unit_system: document.getElementById("unitSelect").value
        };

        const res = await fetch(`${BASE_URL}/cargas`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        const scoreElem = document.getElementById("riskScore");
        document.getElementById("riskDisplay").classList.remove("hidden");
        scoreElem.innerText = `${data.score}% RISK`;

        // SEMÁFORO DE COLORES
        scoreElem.className = "text-6xl font-black italic transition-all";
        if (data.score < 40) scoreElem.classList.add("text-green-600");
        else if (data.score < 75) scoreElem.classList.add("text-orange-500");
        else scoreElem.classList.add("text-red-600", "animate-pulse");

        document.getElementById("volData").innerText = data.details;
        document.getElementById("riskAlerts").innerHTML = data.alerts.map(a => `<div class="font-bold text-red-600">🛑 ${a}</div>`).join("");
    };

    // ASESOR IA
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        if (qCount >= 3) return alert(texts[lang].limit);
        
        out.innerText = texts[lang].wait;
        const fd = new FormData();
        fd.append("prompt", document.getElementById("advPrompt").value);
        const img = document.getElementById("cargoImg").files[0];
        if (img) fd.append("image", img);

        const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
        const data = await res.json();
        out.innerText = data.data;
        qCount++;
    };
});

const BASE_URL = "https://smartcargo-aipa.onrender.com";
let queryCount = 0;

// TRADUCCIONES
const d = {
    es: { pay:"PAGAR", val:"AUDITAR", obj:"SmartCargo AIPA: El puente entre el dueño y la aerolínea.", wait:"Consultando..." },
    en: { pay:"PAY", val:"AUDIT", obj:"SmartCargo AIPA: The bridge between owner and airline.", wait:"Consulting..." }
};

function changeLang(l) {
    localStorage.setItem("lang", l);
    location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "es";
    const hasAccess = window.location.search.includes("access=granted") || localStorage.getItem("is_admin");

    if (hasAccess) {
        document.getElementById("valBtn").disabled = false;
        document.getElementById("valBtn").classList.remove("btn-disabled");
    }

    // BOTÓN DE PAGO / ADMIN
    document.getElementById("payBtn").onclick = async () => {
        const pass = prompt("Admin Password (O deje vacío para pagar):");
        const awb = document.getElementsByName("awb")[0].value || "000";
        const amount = document.getElementById("priceSelect").value;

        const body = new URLSearchParams({ amount, awb });
        if (pass) body.append("password", pass);

        const res = await fetch(`${BASE_URL}/create-payment`, { method:"POST", body });
        const data = await res.json();
        
        if (pass && data.url.includes("access=granted")) {
            localStorage.setItem("is_admin", "true");
        }
        window.location.href = data.url;
    };

    // CONSULTOR
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        if (queryCount >= 3) { out.innerText = "Límite alcanzado."; return; }

        queryCount++;
        out.innerText = d[lang].wait;

        const fd = new FormData();
        fd.append("prompt", document.getElementById("advPrompt").value);
        const img = document.getElementById("cargoImg").files[0];
        if (img) fd.append("image", img);

        try {
            const res = await fetch(`${BASE_URL}/advisory`, { method:"POST", body: fd });
            const data = await res.json();
            out.innerText = data.data;
        } catch (e) { out.innerText = "Error de conexión."; }
    };

    // FORMULARIO RIESGO
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
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        document.getElementById("riskDisplay").classList.remove("hidden");
        document.getElementById("riskScore").innerText = `${data.score}% RISK`;
        document.getElementById("volData").innerText = data.details;
        document.getElementById("riskAlerts").innerHTML = data.alerts.map(a => `<div>🛑 ${a}</div>`).join("");
    };
});

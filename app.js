const BASE_URL = "https://smartcargo-aipa.onrender.com";
let queryCount = 0;
const MAX_QUERIES = 3;

const i18n = {
    es: {
        pay: "PAGAR Y ACTIVAR", val: "EJECUTAR AUDITORÍA", 
        wait: "Procesando consulta técnica...", 
        limit: "LÍMITE ALCANZADO. Inicie nueva auditoría.",
        access: "ACCESO DENEGADO. Requiere pago previo.",
        photo: "Subir foto de carga / etiquetas"
    },
    en: {
        pay: "PAY AND ACTIVATE", val: "RUN AUDIT", 
        wait: "Processing technical inquiry...", 
        limit: "LIMIT REACHED. Please start a new audit.",
        access: "ACCESS DENIED. Payment required.",
        photo: "Upload cargo photo / labels"
    }
};

function changeLang(lang) {
    localStorage.setItem("lang", lang);
    location.reload(); // Recarga para aplicar i18n y refrescar estados
}

// Control de UI
document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "es";
    const hasAccess = window.location.search.includes("access=granted") || localStorage.getItem("admin");

    if (hasAccess) {
        const vBtn = document.getElementById("valBtn");
        vBtn.disabled = false;
        vBtn.classList.remove("btn-disabled");
    }

    // --- MANEJO DE PAGOS ---
    document.getElementById("payBtn").onclick = async () => {
        const awb = document.getElementsByName("awb")[0].value;
        const amount = document.getElementById("priceSelect").value;
        const user = prompt("Admin User:");
        const pass = user ? prompt("Pass:") : null;

        const body = new URLSearchParams({ amount, awb, description: `Service AWB ${awb}` });
        if (user) { body.append("user", user); body.append("password", pass); }

        const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
            if (user) localStorage.setItem("admin", "true");
        }
    };

    // --- AUDITORÍA DE RIESGO ---
    document.getElementById("cargoForm").onsubmit = async (e) => {
        e.preventDefault();
        const fd = Object.fromEntries(new FormData(e.target));
        const res = await fetch(`${BASE_URL}/cargas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fd)
        });
        const data = await res.json();
        
        document.getElementById("riskDisplay").classList.remove("hidden");
        const score = document.getElementById("riskScore");
        score.innerText = `${data.alertaScore}% RISK`;
        
        // Semáforo visual
        score.className = "text-5xl font-black " + 
            (data.alertaScore < 30 ? "text-green-600" : data.alertaScore < 70 ? "text-amber-500" : "text-red-600 animate-pulse");

        document.getElementById("volData").innerText = `VOL: ${data.volumen} | VOL-W: ${data.peso_vol} KG`;
        document.getElementById("riskAlerts").innerHTML = data.alerts.map(a => `<div>🛑 ${a}</div>`).join("");
    };

    // --- ASESOR IA (3 CONSULTAS) ---
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        const lang = localStorage.getItem("lang") || "es";

        if (!hasAccess) { alert(i18n[lang].access); return; }
        if (queryCount >= MAX_QUERIES) { alert(i18n[lang].limit); return; }

        queryCount++;
        document.getElementById("queryCounter").innerText = `CONSULTAS: ${queryCount}/${MAX_QUERIES}`;
        
        const prompt = document.getElementById("advPrompt").value;
        const img = document.getElementById("cargoImg").files[0];
        const formData = new FormData();
        formData.append("prompt", prompt || "Analyze this cargo.");
        if (img) formData.append("image", img);

        out.innerText = i18n[lang].wait;

        try {
            const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: formData });
            const data = await res.json();
            out.innerText = data.data;

            if (queryCount === MAX_QUERIES) {
                const btn = document.getElementById("advBtn");
                btn.innerText = "SESIÓN FINALIZADA";
                btn.classList.add("btn-disabled", "bg-gray-400");
                out.innerHTML += "<br><br><b>Sesión cerrada. Para más dudas, inicie un nuevo pago.</b>";
            }
        } catch (e) { out.innerText = "Error de conexión."; }
    };
});

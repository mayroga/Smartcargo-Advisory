const BASE_URL = "https://smartcargo-aipa.onrender.com";
let queries = 0;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = localStorage.getItem("lang") || "es";
    
    // 1. GESTIÓN DE ACCESO (Persistencia)
    const accessGranted = urlParams.get('access') === 'granted' || localStorage.getItem('cargo_auth') === 'true';

    if (accessGranted) {
        localStorage.setItem('cargo_auth', 'true'); // Guardar permiso en el navegador
        const valBtn = document.getElementById("valBtn");
        valBtn.disabled = false;
        valBtn.classList.remove("btn-disabled", "bg-gray-400");
        valBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
    }

    // 2. SISTEMA DE PAGO Y BYPASS ADMIN
    document.getElementById("payBtn").onclick = async () => {
        const awb = document.getElementsByName("awb")[0].value || "000";
        const price = document.getElementById("priceSelect").value;
        const pass = prompt(lang === "es" ? "CLAVE DE ACCESO / ADMIN:" : "ADMIN PASSWORD:");

        const body = new URLSearchParams({ amount: price, awb: awb });
        if (pass) body.append("password", pass);

        try {
            const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: body });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (e) { alert("Error de conexión"); }
    };

    // 3. ASESOR EXPERTO (Híbrido Texto/Imagen)
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        
        if (queries >= 3) { 
            out.innerText = lang === "es" ? "Límite de 3 consultas alcanzado." : "3-query limit reached.";
            return; 
        }
        
        out.innerText = lang === "es" ? "Consultando al experto..." : "Consulting expert...";

        const fd = new FormData();
        fd.append("prompt", document.getElementById("advPrompt").value);
        const imgFile = document.getElementById("cargoImg").files[0];
        if (imgFile) fd.append("image", imgFile);

        try {
            const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
            const data = await res.json();
            out.innerText = data.data;
            queries++;
            document.getElementById("qCount").innerText = `Consultas: ${queries}/3`;
        } catch (err) {
            out.innerText = "Error al conectar con el asesor.";
        }
    };

    // 4. AUDITORÍA DE RIESGO
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        const display = document.getElementById("riskDisplay");
        display.classList.remove("hidden");
        const score = document.getElementById("riskScore");
        score.innerText = `${data.score}% RISK`;
        score.className = `text-5xl font-black ${data.score < 40 ? 'text-green-600' : 'text-red-600 animate-pulse'}`;
        document.getElementById("volData").innerText = data.details;
        document.getElementById("riskAlerts").innerHTML = data.alerts.map(a => `<div>🛑 ${a}</div>`).join("");
    };
});

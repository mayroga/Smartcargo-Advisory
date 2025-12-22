const BASE_URL = "https://smartcargo-aipa.onrender.com";
let qCount = 0;

// Diccionario para traducción total
const texts = {
    es: { pay: "PAGAR Y ACTIVAR", val: "EJECUTAR AUDITORÍA", wait: "Consultando...", limit: "Límite de 3 consultas alcanzado." },
    en: { pay: "PAY AND ACTIVATE", val: "RUN AUDIT", wait: "Consulting...", limit: "3-query limit reached." }
};

function changeLang(l) {
    localStorage.setItem("lang", l);
    location.reload();
}

async function handlePayment() {
    const awb = document.getElementsByName("awb")[0].value || "000";
    const amount = document.getElementById("priceSelect").value;
    const pass = prompt("ADMIN PASSWORD:"); // Aquí pones tu clave de Render

    const formData = new URLSearchParams({ amount, awb });
    if (pass) formData.append("password", pass);

    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: formData });
    const data = await res.json();
    window.location.href = data.url;
}

document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "es";
    
    // Configurar idioma inicial
    document.getElementById("payBtn").innerText = texts[lang].pay;
    document.getElementById("valBtn").innerText = texts[lang].val;

    // Desbloqueo por URL
    if (window.location.search.includes("access=granted")) {
        const btn = document.getElementById("valBtn");
        btn.disabled = false;
        btn.classList.remove("btn-disabled");
    }

    document.getElementById("payBtn").onclick = handlePayment;

    // Lógica del Asesor IA
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        if (qCount >= 3) { alert(texts[lang].limit); return; }

        qCount++;
        out.innerText = texts[lang].wait;
        
        const fd = new FormData();
        fd.append("prompt", document.getElementById("advPrompt").value);
        const img = document.getElementById("cargoImg").files[0];
        if (img) fd.append("image", img);

        const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
        const data = await res.json();
        out.innerText = data.data;
    };
});

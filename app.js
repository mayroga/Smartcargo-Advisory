const BASE_URL = "https://smartcargo-aipa.onrender.com";
let qCount = 0;

// =====================================================
// TEXTOS MULTI-IDIOMA
// =====================================================
const texts = {
    es: {
        pay: "PAGAR Y ACTIVAR",
        val: "EJECUTAR AUDITORÍA",
        wait: "Consultando...",
        limit: "Límite de 3 consultas alcanzado."
    },
    en: {
        pay: "PAY AND ACTIVATE",
        val: "RUN AUDIT",
        wait: "Consulting...",
        limit: "3-query limit reached."
    }
};

function changeLang(l) {
    localStorage.setItem("lang", l);
    location.reload();
}

// =====================================================
// PAGO + BYPASS
// =====================================================
async function handlePayment() {
    const awb = document.getElementsByName("awb")[0].value || "000";
    const amount = document.getElementById("priceSelect").value;
    const pass = prompt("ADMIN PASSWORD:");

    const formData = new URLSearchParams({ amount, awb });
    if (pass) formData.append("password", pass);

    const res = await fetch(`${BASE_URL}/create-payment`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    // Persistencia
    localStorage.setItem("smartcargo_auth", "true");

    window.location.href = data.url;
}

// =====================================================
// INIT
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "es";
    const authorized = localStorage.getItem("smartcargo_auth") === "true";

    document.getElementById("payBtn").innerText = texts[lang].pay;
    document.getElementById("valBtn").innerText = texts[lang].val;

    // 🔓 Persistencia del acceso
    if (authorized || window.location.search.includes("access=granted")) {
        const btn = document.getElementById("valBtn");
        btn.disabled = false;
        btn.classList.remove("btn-disabled");
        localStorage.setItem("smartcargo_auth", "true");
    }

    document.getElementById("payBtn").onclick = handlePayment;

    // =================================================
    // ASESOR IA
    // =================================================
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();

        const out = document.getElementById("advResponse");

        if (qCount >= 3) {
            alert(texts[lang].limit);
            return;
        }

        qCount++;
        out.innerText = texts[lang].wait;

        const fd = new FormData();
        fd.append("prompt", document.getElementById("advPrompt").value);

        const img = document.getElementById("cargoImg").files[0];
        if (img) fd.append("image", img);

        const res = await fetch(`${BASE_URL}/advisory`, {
            method: "POST",
            body: fd
        });

        const data = await res.json();
        out.innerText = data.data;
    };
});

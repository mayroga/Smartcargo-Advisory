const BASE_URL = "https://smartcargo-aipa.onrender.com";

const texts = {
    es: { 
        pay: "PAGAR Y ACTIVAR", val: "EJECUTAR AUDITORÍA", 
        wait: "Procesando...", limit: "Límite alcanzado.",
        res: "Resultado:"
    },
    en: { 
        pay: "PAY AND ACTIVATE", val: "RUN AUDIT", 
        wait: "Processing...", limit: "Limit reached.",
        res: "Result:"
    }
};

function changeLang(l) {
    localStorage.setItem("lang", l);
    location.reload();
}

async function handlePayment() {
    const awb = document.getElementsByName("awb")[0]?.value || "000";
    const amount = document.getElementById("priceSelect")?.value || "10";
    const pass = prompt("ADMIN PASSWORD:");

    const formData = new URLSearchParams({ amount, awb });
    if (pass) formData.append("password", pass);

    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
}

document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "es";
    const params = new URLSearchParams(window.location.search);
    
    // 1. Traducir botones
    if(document.getElementById("payBtn")) document.getElementById("payBtn").innerText = texts[lang].pay;
    if(document.getElementById("valBtn")) document.getElementById("valBtn").innerText = texts[lang].val;

    // 2. Verificar Acceso (Stripe o Pass)
    if (params.get("access") === "granted" || localStorage.getItem("smartcargo_auth") === "true") {
        localStorage.setItem("smartcargo_auth", "true");
        const vBtn = document.getElementById("valBtn");
        if(vBtn) {
            vBtn.disabled = false;
            vBtn.classList.remove("btn-disabled");
        }
    }

    // 3. Evento de Auditoría
    const auditForm = document.getElementById("auditForm");
    if(auditForm) {
        auditForm.onsubmit = async (e) => {
            e.preventDefault();
            const payload = {
                awb: document.getElementsByName("awb")[0].value,
                length: parseFloat(document.getElementById("length").value),
                width: parseFloat(document.getElementById("width").value),
                height: parseFloat(document.getElementById("height").value),
                weight: parseFloat(document.getElementById("weight").value),
                ispm15_seal: document.getElementById("ispm").value,
                unit_system: document.getElementById("unit").value
            };

            const res = await fetch(`${BASE_URL}/cargas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            document.getElementById("auditResponse").innerHTML = `
                <b>${texts[lang].res}</b> ${result.score}% riesgo<br>
                <small>${result.alerts.join(", ")}</small>
            `;
        };
    }

    // 4. Evento IA Asesor
    const advForm = document.getElementById("advForm");
    let qCount = parseInt(localStorage.getItem("qCount") || "0");

    if(advForm) {
        advForm.onsubmit = async (e) => {
            e.preventDefault();
            if (qCount >= 3) return alert(texts[lang].limit);

            const out = document.getElementById("advResponse");
            out.innerText = texts[lang].wait;

            const fd = new FormData(advForm);
            const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
            const data = await res.json();
            
            out.innerText = data.data;
            qCount++;
            localStorage.setItem("qCount", qCount);
        };
    }

    document.getElementById("payBtn").onclick = handlePayment;
});

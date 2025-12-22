const BASE_URL = "https://smartcargo-aipa.onrender.com";

const texts = {
    es: { 
        title: "SmartCargo 360", 
        pay: "ACTIVAR ASESORÍA", 
        val: "VERIFICAR CUMPLIMIENTO",
        legal: "ADVERTENCIA: SOLO ASESORÍA TÉCNICA. NO SOMOS TSA/FORWARDER. NO MANIPULAMOS CARGA."
    },
    en: { 
        title: "SmartCargo 360", 
        pay: "ACTIVATE ADVISORY", 
        val: "VERIFY COMPLIANCE",
        legal: "WARNING: TECHNICAL ADVISORY ONLY. NOT TSA/FORWARDER. WE DO NOT HANDLE CARGO."
    }
};

function changeLang(l) {
    localStorage.setItem("lang", l);
    location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "es";
    document.getElementById("legalBanner").innerText = texts[lang].legal;
    document.getElementById("payBtn").innerText = texts[lang].pay;
    document.getElementById("valBtn").innerText = texts[lang].val;

    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "granted") localStorage.setItem("smartcargo_auth", "true");

    if (localStorage.getItem("smartcargo_auth") === "true") {
        document.getElementById("valBtn").disabled = false;
        document.getElementById("valBtn").classList.remove("btn-disabled");
    }

    // AUDITORÍA DE RIESGOS POR COLORES
    document.getElementById("auditForm").onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/cargas`, { method: "POST", body: fd });
        const data = await res.json();
        
        const out = document.getElementById("auditResponse");
        out.innerHTML = "<h4>RESULTADO DE ASESORÍA:</h4>";
        data.forEach(item => {
            out.innerHTML += `<div class="risk-box risk-${item.level}">${item.msg}</div>`;
        });
    };

    // ASESOR IA (FOTO Y TEXTO)
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        out.innerText = "Consultando base de datos IATA/TSA...";
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
        const data = await res.json();
        out.innerText = data.data;
    };
});

async function handlePayment() {
    const fd = new FormData();
    fd.append("awb", document.getElementsByName("awb")[0].value || "000");
    fd.append("amount", document.getElementById("priceSelect").value);
    const pass = prompt("ADMIN PASS:");
    if(pass) fd.append("password", pass);

    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: fd });
    const data = await res.json();
    if(data.url) window.location.href = data.url;
}
document.getElementById("payBtn").onclick = handlePayment;

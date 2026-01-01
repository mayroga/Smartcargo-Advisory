const BASE_URL = "https://smartcargo-aipa.onrender.com";

const texts = {
    es: { 
        title: "SmartCargo 360", 
        pay: "ACTIVAR ASESORÍA", 
        val: "VERIFICAR CUMPLIMIENTO",
        consulting: "Consultando base de datos IATA/TSA..."
    },
    en: { 
        title: "SmartCargo 360", 
        pay: "ACTIVATE ADVISORY", 
        val: "VERIFY COMPLIANCE",
        consulting: "Consulting IATA/TSA database..."
    }
};

function changeLang(l) {
    localStorage.setItem("lang", l);
    location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("lang") || "es";
    
    // Auth Check
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "granted") localStorage.setItem("smartcargo_auth", "true");

    if (localStorage.getItem("smartcargo_auth") === "true") {
        const valBtn = document.getElementById("valBtn");
        valBtn.disabled = false;
        valBtn.classList.remove("btn-disabled");
    }

    // 1. Auditoría de Riesgos (Backend Rules)
    document.getElementById("auditForm").onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/cargas`, { method: "POST", body: fd });
        const data = await res.json();
        
        const out = document.getElementById("auditResponse");
        out.innerHTML = "<h4>DIAGNÓSTICO TÉCNICO:</h4>";
        data.forEach(item => {
            out.innerHTML += `
                <div class="risk-box risk-${item.level}">
                    <strong>${item.msg}</strong><br>
                    <small>${item.desc}</small>
                </div>`;
        });
    };

    // 2. Asistente IA con Multi-Foto (Máximo 3)
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        out.innerText = texts[lang].consulting;
        
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
        const data = await res.json();
        out.innerText = data.data;
    };
});

// 3. Manejo de Pago y Acceso Administrativo
async function handlePayment() {
    const fd = new FormData();
    const awb = document.getElementsByName("awb")[0].value || "000";
    const amount = document.getElementById("priceSelect").value;
    
    const user = prompt("USUARIO ADMINISTRADOR:");
    const pass = prompt("CONTRASEÑA:");

    fd.append("awb", awb);
    fd.append("amount", amount);
    if(user) fd.append("user", user);
    if(pass) fd.append("password", pass);

    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: fd });
    const data = await res.json();
    if(data.url) window.location.href = data.url;
}

document.getElementById("payBtn").onclick = handlePayment;

const BASE_URL = "https://smartcargo-aipa.onrender.com";
let queryCount = 0;
const MAX_QUERIES = 3;

const langDict = {
    es: {
        objT: "Nuestro Objetivo",
        objX: "SmartCargo AIPA nace para eliminar la incertidumbre en la cadena logística. Servimos como un puente de asesoría técnica entre el dueño de la carga, el forwarder, el transportista y la aerolínea.",
        sec1: "Auditoría Técnica",
        sec2: "Asesoría IA Vision",
        pay: "PAGAR Y ACTIVAR",
        val: "Ejecutar Auditoría",
        photo: "Subir foto de carga / etiquetas",
        wait: "Procesando consulta técnica...",
        limit: "SESIÓN FINALIZADA. Requiere nuevo pago.",
        placeholder: "Describa su duda técnica aquí...",
        seal1: "Sello ISPM-15 (Madera)",
        seal2: "SIN Sello (Madera - Riesgo)",
        seal3: "Exento (Plástico/Metal/Cartón)",
        qText: "Consultas"
    },
    en: {
        objT: "Our Mission",
        objX: "SmartCargo AIPA was created to eliminate uncertainty in the logistics chain. We serve as a technical advisory bridge between the cargo owner, forwarder, trucker, and airline.",
        sec1: "Technical Audit",
        sec2: "AI Vision Advisory",
        pay: "PAY AND ACTIVATE",
        val: "Run Audit",
        photo: "Upload cargo photo / labels",
        wait: "Processing technical inquiry...",
        limit: "SESSION FINISHED. New payment required.",
        placeholder: "Describe your technical doubt here...",
        seal1: "ISPM-15 Seal (Wood)",
        seal2: "No Seal (Wood - Risk)",
        seal3: "Exempt (Plastic/Metal/Cardboard)",
        qText: "Queries"
    }
};
const BASE_URL = "https://smartcargo-aipa.onrender.com";

async function handlePaymentClick() {
    const amount = 65; // Precio Profesional
    const description = "SmartCargo Professional Tier";
    
    // Preguntar por credenciales para Bypass
    const user = prompt("Admin User (Deje en blanco para pagar):");
    let pass = null;
    if (user) {
        pass = prompt("Admin Password:");
    }

    try {
        const formData = new URLSearchParams();
        formData.append('amount', amount);
        formData.append('description', description);
        if (user && pass) {
            formData.append('user', user);
            formData.append('password', pass);
        }

        const response = await fetch(`${BASE_URL}/create-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        const result = await response.json();
        
        if (result.url) {
            window.location.href = result.url;
        } else {
            alert("Error al procesar el acceso.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Fallo en la conexión con el servidor.");
    }
}

// Asegúrate de vincular el botón en el DOM
document.getElementById('paymentButton').addEventListener('click', handlePaymentClick);
function changeLang(lang) {
    localStorage.setItem("lang", lang);
    const d = langDict[lang];
    document.getElementById("navTitle").innerText = "SMARTCARGO AIPA";
    document.getElementById("objTitle").innerText = d.objT;
    document.getElementById("objText").innerText = d.objX;
    document.getElementById("sec1Title").innerText = d.sec1;
    document.getElementById("sec2Title").innerText = d.sec2;
    document.getElementById("payBtn").innerText = d.pay;
    document.getElementById("valBtn").innerText = d.val;
    document.getElementById("photoLabel").innerText = d.photo;
    document.getElementById("advPrompt").placeholder = d.placeholder;
    document.getElementById("qCount").innerText = `${d.qText}: ${queryCount}/${MAX_QUERIES}`;
    
    // Traducción del Selector de Sellos
    const sealS = document.getElementById("sealSelect");
    sealS.options[0].text = d.seal1;
    sealS.options[1].text = d.seal2;
    sealS.options[2].text = d.seal3;
}

function updateUnitPlaceholders() {
    const unit = document.getElementById("unitSelect").value;
    const suffix = unit === "cm" ? "(cm)" : "(in)";
    const wSuffix = unit === "cm" ? "(kg)" : "(lb)";
    document.getElementById("inputL").placeholder = "L " + suffix;
    document.getElementById("inputW").placeholder = "W " + suffix;
    document.getElementById("inputH").placeholder = "H " + suffix;
    document.getElementById("inputWeight").placeholder = "Weight " + wSuffix;
}

// LÓGICA DE AUDITORÍA
document.getElementById("cargoForm").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const unit = document.getElementById("unitSelect").value;
    
    const payload = {
        awb: fd.get("awb"),
        length: parseFloat(fd.get("length")),
        width: parseFloat(fd.get("width")),
        height: parseFloat(fd.get("height")),
        weight: parseFloat(fd.get("weight")),
        ispm15_seal: fd.get("ispm15_seal"),
        unit_system: unit // Enviamos si es CM o IN al backend
    };

    const res = await fetch(`${BASE_URL}/cargas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    
    document.getElementById("riskDisplay").classList.remove("hidden");
    const s = document.getElementById("riskScore");
    s.innerText = `${data.score}% RISK`;
    s.className = "text-5xl font-black " + (data.score < 30 ? "text-green-600" : data.score < 70 ? "text-amber-500" : "text-red-600 animate-pulse");
    document.getElementById("volData").innerText = data.details;
    document.getElementById("riskAlerts").innerHTML = data.alerts.map(a => `<div>🛑 ${a}</div>`).join("");
};

// LÓGICA DEL ASESOR (FIX DE CONEXIÓN)
document.getElementById("advForm").onsubmit = async (e) => {
    e.preventDefault();
    const lang = localStorage.getItem("lang") || "es";
    const out = document.getElementById("advResponse");

    if (queryCount >= MAX_QUERIES) { alert(langDict[lang].limit); return; }

    queryCount++;
    document.getElementById("qCount").innerText = `${langDict[lang].qText}: ${queryCount}/${MAX_QUERIES}`;
    out.innerText = langDict[lang].wait;

    const fd = new FormData();
    fd.append("prompt", document.getElementById("advPrompt").value);
    const photo = document.getElementById("cargoImg").files[0];
    if (photo) fd.append("image", photo);

    try {
        const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
        const data = await res.json();
        out.innerText = data.data;
    } catch (err) {
        out.innerText = "Connection Error. Please check your internet or API Key.";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    changeLang(localStorage.getItem("lang") || "es");
    updateUnitPlaceholders();
});

// Simulación de URL del Backend
const BACKEND_URL = "https://smartcargo-aipa.onrender.com";

// Estado global
let CURRENT_PANEL = "cargas";
let LANG = "es"; // Establecer idioma inicial en español

// =============================================================
// TRADUCCIONES COMPLETAS
// =============================================================
const LANGS = {
    en: {
        app_title: "SmartCargo-AIPA: Virtual Preventive Advisor",
        nav_cargas: "AIPA Operational Console",
        nav_pagos: "Payment Center",
        nav_asesoria: "SmartCargo Consulting (AI)",
        pagos_title: "Payment Center: Select a Service",
        asesoria_title: "SmartCargo Consulting: Your Preventive Advisor",
        asesoria_disclaimer:
            "Disclaimer: SmartCargo-AIPA is a preventive advisor, not a certifying body (TSA, IATA, Forwarder). Our advice is based on documented inputs and is not a substitute for physical carrier inspection.",
        ask_advisor_button: "Ask the Advisor",

        consola_title: "AIPA OPERATIONAL CONSOLE: Pre-Clearance Check",
        data_awb_title: "1. AWB & Dimensions Data (Inches Default)",
        awb_label: "AWB / BOL Number:",
        content_label: "Cargo Content:",
        weight_label: "Declared Gross Weight:",
        dimensions_title: "Dimensions (L x W x H):",
        length_label: "Length:",
        width_label: "Width:",
        height_label: "Height:",

        physical_check_title: "2. Physical Pre-Checklist",
        packing_label: "Packing Integrity:",
        packing_ok: "OK / Undamaged",
        packing_damaged: "Minor Damage",
        packing_critical: "CRITICAL (Broken/Leaking)",

        labeling_label: "All Labels Applied?",
        ispm15_label: "ISPM-15 Seal Present?",

        dg_type_label: "Dangerous Goods:",
        dg_no: "NO DG / General Cargo",
        dg_lithium: "Lithium Batteries",
        dg_other: "Other DG",

        dg_separation_label: "DG Segregation:",
        sep_ok: "OK / Separated",
        sep_mixed: "CRITICAL / MIXED",

        weight_match_label: "Weight Match AWB/Scale?",
        check_yes: "YES",
        check_no: "NO",

        submit_button: "SEND TO AIPA & GET SCORE",

        risk_score_label: "AIPA RISK SCORE",
        alerts_label: "PREVENTIVE ALERTS",
        status_ok: "Pre-Clearance OK",
        status_hold: "HIGH RISK OF HOLD",

        payment_services: {
            service_1: "Immediate AIPA Score (Free)",
            service_2: "Detailed Report PDF - $15",
            service_3: "AI Advisor (3 Questions) - $10"
        }
    },

    es: {
        app_title: "SmartCargo-AIPA: Asesor Preventivo Virtual",
        nav_cargas: "Consola Operacional AIPA",
        nav_pagos: "Centro de Pagos",
        nav_asesoria: "SmartCargo Consulting (IA)",
        pagos_title: "Centro de Pagos: Seleccione un Servicio",
        asesoria_title: "SmartCargo Consulting: Su Asesor Preventivo",
        asesoria_disclaimer:
            "SmartCargo-AIPA es un asesor preventivo, no un certificador (TSA, IATA, Forwarder). No sustituye inspección física.",
        ask_advisor_button: "Preguntar al Asesor",

        consola_title: "CONSOLA OPERACIONAL AIPA: Verificación Pre-Despacho",
        data_awb_title: "1. Datos AWB y Dimensiones",
        awb_label: "Número AWB:",
        content_label: "Contenido:",
        weight_label: "Peso Declarado:",
        dimensions_title: "Dimensiones (L x An x Al):",
        length_label: "Largo:",
        width_label: "Ancho:",
        height_label: "Altura:",

        physical_check_title: "2. Lista Física",
        packing_label: "Integridad del Embalaje:",
        packing_ok: "OK / Sin Daños",
        packing_damaged: "Daño Menor",
        packing_critical: "CRÍTICO (Roto/Fuga)",

        labeling_label: "¿Etiquetas Aplicadas?",
        ispm15_label: "¿Sello ISPM-15?",

        dg_type_label: "Mercancías Peligrosas:",
        dg_no: "NO DG / Carga General",
        dg_lithium: "Baterías de Litio",
        dg_other: "Otro DG",

        dg_separation_label: "Segregación DG:",
        sep_ok: "OK / Separado",
        sep_mixed: "CRÍTICO / Mezclado",

        weight_match_label: "¿Coincide Peso AWB/Báscula?",
        check_yes: "SÍ",
        check_no: "NO",

        submit_button: "ENVIAR A AIPA Y OBTENER PUNTAJE",

        risk_score_label: "PUNTAJE DE RIESGO AIPA",
        alerts_label: "ALERTAS PREVENTIVAS",
        status_ok: "Aprobado",
        status_hold: "ALTO RIESGO DE HOLD",

        payment_services: {
            service_1: "Puntaje AIPA Gratis",
            service_2: "Reporte PDF - $15",
            service_3: "Asesor IA (3 preguntas) - $10"
        }
    }
};

// =============================================================
// CAMBIO DE IDIOMA
// =============================================================
function setLang(lang) {
    LANG = lang;
    const L = LANGS[LANG];

    // Actualizar elementos principales
    document.title = L.app_title;
    document.getElementById('app_title').textContent = L.app_title;
    
    // Itera sobre todas las keys de traducción (simple, pero efectivo)
    for (const key in L) {
        const el = document.getElementById(key);
        if (el) el.textContent = L[key];
    }

    // Lógica específica para opciones de selección y botones
    document.getElementById('packing_ok').textContent = L.packing_ok;
    document.getElementById('packing_damaged').textContent = L.packing_damaged;
    document.getElementById('packing_critical').textContent = L.packing_critical;
    document.getElementById('dg_no').textContent = L.dg_no;
    document.getElementById('dg_lithium').textContent = L.dg_lithium;
    document.getElementById('dg_other').textContent = L.dg_other;
    document.getElementById('sep_ok').textContent = L.sep_ok;
    document.getElementById('sep_mixed').textContent = L.sep_mixed;
    document.getElementById('check_yes').textContent = L.check_yes;
    document.getElementById('check_no').textContent = L.check_no;
}

// Inicializar idioma al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Si tienes un selector de idioma, puedes leer su valor aquí
    setLang(LANG); 
});

// =============================================================
// MOSTRAR PANEL
// =============================================================
function showPanel(panelId) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.getElementById(panelId).classList.add("active");
}

// =============================================================
// CONVERSIÓN DE UNIDADES
// =============================================================
function getUnitFactor(u) {
    // Convertir a CM: si la unidad es 'in' (pulgadas), el factor es 2.54, si es 'cm', 1.
    return u === "in" ? 2.54 : 1;
}

function convertToCm(v, u) {
    // Asegura que 'v' es un número válido.
    return (parseFloat(v) || 0) * getUnitFactor(u);
}

// =============================================================
// ENVIAR CARGA AL BACKEND (¡Ruta corregida!)
// =============================================================
async function submitNewCarga(event) {
    event.preventDefault();

    const unit = document.getElementById("unit_selector").value;

    const data = {
        awb: document.getElementById("awb_number").value,
        content: document.getElementById("cargo_content").value,

        length_cm: convertToCm(document.getElementById("length_val").value, unit),
        width_cm: convertToCm(document.getElementById("width_val").value, unit),
        height_cm: convertToCm(document.getElementById("height_val").value, unit),

        weight_declared: parseFloat(document.getElementById("weight_val").value) || 0,
        weight_unit: document.getElementById("weight_unit_selector").value, // Asumiendo que tienes un selector
        packing_integrity: document.getElementById("packing_integrity").value,
        labeling_complete: document.getElementById("labeling_complete").value,
        ispm15_seal: document.getElementById("ispm15_seal").value,

        dg_type: document.getElementById("dg_type").value,
        dg_separation:
            document.getElementById("dg_type").value !== "NO_DG"
                ? document.getElementById("dg_separation").value
                : "NA",

        weight_match: document.getElementById("weight_match").value
    };

    try {
        // 🛑 CORRECCIÓN CLAVE: La ruta correcta es /cargas (definida en main.py)
        const res = await fetch(`${BACKEND_URL}/cargas`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        renderCargoCard(json);

    } catch (error) {
        console.error("Error al conectar o procesar la respuesta del servidor AIPA:", error);
        
        // Muestra el mensaje de error que reportaste
        alert("Error connecting to the AIPA SERVER"); 
    }
}

// =============================================================
// MOSTRAR RESULTADO (¡Lógica de Alertas restaurada!)
// =============================================================
function renderCargoCard(c) {
    const list = document.getElementById("cargo_list_display");
    const L = LANGS[LANG]; // Obtener traducciones

    // Mapear el 'alertaScore' del backend a 'score'
    const score = c.alertaScore || 0; 
    
    // Determinar el estado y clase de riesgo
    const status = score < 50 ? 'OK' : 'HOLD';
    const statusText = status === 'OK' ? L.status_ok : L.status_hold;
    let riskClass;
    if (score <= 30) riskClass = 'risk-low';
    else if (score <= 60) riskClass = 'risk-medium';
    else riskClass = 'risk-high';

    let alertsHtml = '';
    if (c.alerts && c.alerts.length > 0) {
        // 🛑 TRADUCCIÓN DE CÓDIGO (R001) A MENSAJE LARGO
        // Esta parte REQUIERE que window.standards esté definida en standards.js
        alertsHtml = c.alerts.map(a => 
            // Usamos standards.ALERTS_DB que ahora es global (gracias a window.standards)
            `<li title="${window.standards.ALERTS_DB[a].desc}">${window.standards.ALERTS_DB[a].msg} (${a})</li>`
        ).join('');
        alertsHtml = `<p><b>${L.alerts_label}:</b></p><ul class="alert-list">${alertsHtml}</ul>`;
    }

    const card = document.createElement("div");
    card.className = "cargo-card";
    card.dataset.awb = c.awb;

    card.innerHTML = `
        <h3 data-status="${status}">${c.awb} - ${statusText}</h3>
        <hr>
        <p><span class="risk-score ${riskClass}">
            ${L.risk_score_label}: ${score}%
        </span></p>
        ${alertsHtml}
    `;

    list.prepend(card);
}
// =============================================================
// FUNCIÓN PARA EL CENTRO DE PAGOS
// =============================================================
async function handlePayment(amount, description) {
    // 1. Crear el objeto FormData que el backend espera
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('description', description);

    try {
        const res = await fetch(`${BACKEND_URL}/create-payment`, {
            method: 'POST',
            // NO se usa 'Content-Type: application/json' cuando se envía FormData
            body: formData, 
        });

        if (!res.ok) {
            throw new Error(`Error al crear el pago. Estado: ${res.status}`);
        }

        const json = await res.json();
        
        // 2. Redireccionar o mostrar el enlace (la lógica que solía funcionar)
        if (json.url) {
            window.location.href = json.url; 
        } else {
            alert("Error: El servidor no proporcionó un enlace de pago.");
        }

    } catch (error) {
        console.error("Error en el Centro de Pagos:", error);
        alert(`Fallo en el Centro de Pagos. Revise logs y la conexión al backend. Detalle: ${error.message}`);
    }
}

// Ejemplo de cómo se llamaría esta función desde un botón en el HTML (no incluido aquí):
// Por ejemplo, si tienes un botón para el "Reporte PDF - $15":
// <button onclick="handlePayment(15, 'Reporte PDF Detallado')">Pagar $15</button>

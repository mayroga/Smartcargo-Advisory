// Simulación de URL del Backend
const BACKEND_URL = 'http://localhost:8000';

// Estado de la Aplicación
let CURRENT_PANEL = 'cargas';
let LANG = 'en';

// Objeto de Traducciones (Actualizado con nuevos campos)
const LANGS = {
    'en': {
        app_title: "SmartCargo-AIPA: Virtual Preventive Advisor",
        nav_cargas: "AIPA Operational Console",
        nav_pagos: "Payment Center",
        nav_asesoria: "SmartCargo Consulting (AI)",
        pagos_title: "Payment Center: Select a Service",
        asesoria_title: "SmartCargo Consulting: Your Preventive Advisor",
        asesoria_disclaimer: "Disclaimer: SmartCargo-AIPA is a preventive advisor, not a certifying body (TSA, IATA, Forwarder). Our advice is based on documented inputs and is not a substitute for physical carrier inspection.",
        ask_advisor_button: "Ask the Advisor",
        
        // --- Consola Operacional AIPA (Nuevos Campos) ---
        consola_title: "AIPA OPERATIONAL CONSOLE: Pre-Clearance Check",
        data_awb_title: "1. AWB & Dimensions Data (Inches Default)",
        awb_label: "AWB / BOL Number:",
        content_label: "Cargo Content (Description):",
        weight_label: "Declared Gross Weight:",
        dimensions_title: "Dimensions (L x W x H):",
        length_label: "Length:",
        width_label: "Width:",
        height_label: "Height:",
        
        physical_check_title: "2. Physical Pre-Checklist (Trucker/Handler)",
        packing_label: "Packing Integrity Check:",
        packing_ok: "OK / Undamaged",
        packing_damaged: "Minor Damage",
        packing_critical: "CRITICAL (Broken/Leaking)",
        
        labeling_label: "All Labels & Marks Applied?",
        ispm15_label: "ISPM-15 Wooden Pallet Seal Present?",
        
        dg_type_label: "Dangerous Goods (DG) Classification:",
        dg_no: "NO DG / General Cargo",
        dg_lithium: "Lithium Batteries (UN3481/UN3091)",
        dg_other: "Other DG Classification",
        
        dg_separation_label: "DG Segregation Check (If Applicable):",
        sep_ok: "OK / Separated",
        sep_mixed: "CRITICAL / MIXED with Non-DG",
        
        weight_match_label: "Weight Match AWB/Scale?",
        check_yes: "YES",
        check_no: "NO",

        check_yes_2: "YES",
        check_no_2: "NO",

        check_yes_3: "YES",
        check_no_3: "NO",

        submit_button: "SEND TO AIPA CONSULTING & GET RISK SCORE",
        
        // Card content
        risk_score_label: "AIPA RISK SCORE",
        alerts_label: "PREVENTIVE ALERTS",
        status_ok: "Pre-Clearance OK",
        status_hold: "HIGH RISK OF HOLD",
        
        // Payments
        payment_services: {
            service_1: "Immediate AIPA Score (Free)",
            service_2: "Detailed Report (PDF/Excel) - $15.00",
            service_3: "AI Advisory Consultation (3 Qs) - $10.00",
        }
    },
    'es': {
        app_title: "SmartCargo-AIPA: Asesor Preventivo Virtual",
        nav_cargas: "Consola Operacional AIPA",
        nav_pagos: "Centro de Pagos",
        nav_asesoria: "SmartCargo Consulting (IA)",
        pagos_title: "Centro de Pagos: Seleccione un Servicio",
        asesoria_title: "SmartCargo Consulting: Su Asesor Preventivo",
        asesoria_disclaimer: "Descargo de Responsabilidad: SmartCargo-AIPA es un asesor preventivo, no un organismo certificador (TSA, IATA, Forwarder). Nuestro asesoramiento se basa en datos documentados y no sustituye la inspección física del transportista.",
        ask_advisor_button: "Preguntar al Asesor",
        
        // --- Consola Operacional AIPA (Nuevos Campos) ---
        consola_title: "CONSOLA OPERACIONAL AIPA: Verificación Pre-Despacho",
        data_awb_title: "1. Datos AWB y Dimensiones (Pulgadas por Defecto)",
        awb_label: "Número AWB / BOL:",
        content_label: "Contenido de la Carga (Descripción):",
        weight_label: "Peso Bruto Declarado:",
        dimensions_title: "Dimensiones (L x An x Al):",
        length_label: "Largo:",
        width_label: "Ancho:",
        height_label: "Altura:",

        physical_check_title: "2. Lista de Verificación Física (Camionero/Handler)",
        packing_label: "Integridad del Embalaje:",
        packing_ok: "OK / Sin Daños",
        packing_damaged: "Daño Menor",
        packing_critical: "CRÍTICO (Roto/Fuga)",

        labeling_label: "¿Todas las Etiquetas y Marcas Aplicadas?",
        ispm15_label: "¿Sello ISPM-15 de Pallet de Madera Presente?",

        dg_type_label: "Clasificación de Mercancías Peligrosas (DG):",
        dg_no: "NO DG / Carga General",
        dg_lithium: "Baterías de Litio (UN3481/UN3091)",
        dg_other: "Otra Clasificación DG",

        dg_separation_label: "Verificación de Segregación DG (Si Aplica):",
        sep_ok: "OK / Separado",
        sep_mixed: "CRÍTICO / MEZCLADO con No DG",
        
        weight_match_label: "¿Coincide el Peso AWB/Báscula?",
        check_yes: "SÍ",
        check_no: "NO",

        check_yes_2: "SÍ",
        check_no_2: "NO",

        check_yes_3: "SÍ",
        check_no_3: "NO",
        
        submit_button: "ENVIAR A AIPA CONSULTING Y OBTENER PUNTAJE DE RIESGO",

        // Card content
        risk_score_label: "PUNTAJE DE RIESGO AIPA",
        alerts_label: "ALERTAS PREVENTIVAS",
        status_ok: "Pre-Despacho OK",
        status_hold: "ALTO RIESGO DE RETENCIÓN (HOLD)",
        
        // Payments
        payment_services: {
            service_1: "Puntaje AIPA Inmediato (Gratis)",
            service_2: "Reporte Detallado (PDF/Excel) - $15.00",
            service_3: "Consulta Asesor IA (3 Preguntas) - $10.00",
        }
    }
};

/**
 * Función que cambia el idioma de la interfaz.
 * @param {string} lang - 'en' o 'es'
 */
function setLang(lang) {
    LANG = lang;
    const l = LANGS[LANG];

    // Navegación y Títulos
    document.getElementById('app_title').textContent = l.app_title;
    document.getElementById('nav_cargas').textContent = l.nav_cargas;
    document.getElementById('nav_pagos').textContent = l.nav_pagos;
    document.getElementById('nav_asesoria').textContent = l.nav_asesoria;
    document.getElementById('pagos_title').textContent = l.pagos_title;
    document.getElementById('asesoria_title').textContent = l.asesoria_title;
    document.getElementById('asesoria_disclaimer').textContent = l.asesoria_disclaimer;
    document.getElementById('ask_advisor_button').textContent = l.ask_advisor_button;
    
    // Consola Operacional
    document.getElementById('consola_title').textContent = l.consola_title;
    document.getElementById('data_awb_title').textContent = l.data_awb_title;
    document.getElementById('awb_label').textContent = l.awb_label;
    document.getElementById('content_label').textContent = l.content_label;
    document.getElementById('weight_label').textContent = l.weight_label;
    document.getElementById('dimensions_title').textContent = l.dimensions_title;
    document.getElementById('length_label').textContent = l.length_label;
    document.getElementById('width_label').textContent = l.width_label;
    document.getElementById('height_label').textContent = l.height_label;

    document.getElementById('physical_check_title').textContent = l.physical_check_title;
    document.getElementById('packing_label').textContent = l.packing_label;
    document.getElementById('packing_ok').textContent = l.packing_ok;
    document.getElementById('packing_damaged').textContent = l.packing_damaged;
    document.getElementById('packing_critical').textContent = l.packing_critical;

    document.getElementById('labeling_label').textContent = l.labeling_label;
    document.getElementById('ispm15_label').textContent = l.ispm15_label;

    document.getElementById('dg_type_label').textContent = l.dg_type_label;
    document.getElementById('dg_no').textContent = l.dg_no;
    document.getElementById('dg_lithium').textContent = l.dg_lithium;
    document.getElementById('dg_other').textContent = l.dg_other;

    document.getElementById('dg_separation_label').textContent = l.dg_separation_label;
    document.getElementById('sep_ok').textContent = l.sep_ok;
    document.getElementById('sep_mixed').textContent = l.sep_mixed;
    
    document.getElementById('weight_match_label').textContent = l.weight_match_label;
    
    // Opciones de SÍ/NO (Para evitar duplicación de IDs en el HTML)
    document.querySelectorAll('[id^="check_yes"]').forEach(el => el.textContent = l.check_yes);
    document.querySelectorAll('[id^="check_no"]').forEach(el => el.textContent = l.check_no);

    document.getElementById('submit_button').textContent = l.submit_button;

    // Actualizar botones de pago
    generatePaymentButtons();
    // Re-renderizar tarjetas de carga para actualizar traducciones de Risk Score
    // (Necesitaría la lista de cargas, simularemos el refresh)
    const cargoList = document.getElementById('cargo_list_display');
    const cards = cargoList.querySelectorAll('.cargo-card');
    cards.forEach(card => {
        // Simple refresh para el Risk Score y alerts. En un sistema real sería más complejo.
        const scoreElement = card.querySelector('.risk-score');
        if (scoreElement) {
            scoreElement.textContent = `${l.risk_score_label}: ${scoreElement.dataset.score}%`;
        }
        const titleElement = card.querySelector('h3');
        const status = titleElement.dataset.status;
        titleElement.textContent = `${card.dataset.awb} - ${status === 'OK' ? l.status_ok : l.status_hold}`;
    });

}

/**
 * Muestra el panel seleccionado.
 * @param {string} panelId - ID del panel a mostrar ('cargas', 'pagos', 'asesoria').
 */
function showPanel(panelId) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(panelId).classList.add('active');

    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(`nav_${panelId}`).classList.add('active');

    CURRENT_PANEL = panelId;
}

/**
 * Muestra u oculta la opción de Segregación DG.
 * @param {string} dgType - Valor del selector de DG.
 */
function toggleDGSeparation(dgType) {
    const separationGroup = document.getElementById('dg_separation_group');
    if (dgType === 'LITHIUM' || dgType === 'OTHER_DG') {
        separationGroup.style.display = 'block';
        document.getElementById('dg_separation').setAttribute('required', 'required');
    } else {
        separationGroup.style.display = 'none';
        document.getElementById('dg_separation').removeAttribute('required');
    }
}

/**
 * Obtiene el factor de conversión para la unidad dada.
 * @param {string} unit - 'in' (pulgadas) o 'cm'.
 * @returns {number} Factor para convertir a centímetros.
 */
function getUnitConversionFactor(unit) {
    return unit === 'in' ? 2.54 : 1;
}

/**
 * Convierte un valor de la unidad dada a centímetros.
 * @param {number} value - El valor a convertir.
 * @param {string} unit - La unidad de origen ('in' o 'cm').
 * @returns {number} El valor en centímetros.
 */
function convertValueToCm(value, unit) {
    return value * getUnitConversionFactor(unit);
}

/**
 * Maneja el envío del nuevo formulario de carga.
 * @param {Event} event - Evento de envío del formulario.
 */
async function submitNewCarga(event) {
    event.preventDefault();

    const awb = document.getElementById('awb_number').value;
    const content = document.getElementById('cargo_content').value;
    
    // Lectura de Unidades
    const lengthVal = parseFloat(document.getElementById('length_val').value);
    const widthVal = parseFloat(document.getElementById('width_val').value);
    const heightVal = parseFloat(document.getElementById('height_val').value);
    const unit = document.getElementById('unit_selector').value;
    
    const weightVal = parseFloat(document.getElementById('weight_val').value);
    const weightUnit = document.getElementById('weight_unit_selector').value;

    // Conversión a la unidad base del Backend (asumimos CM y KG como base de validación)
    const lengthCm = convertValueToCm(lengthVal, unit);
    const widthCm = convertValueToCm(widthVal, unit);
    const heightCm = convertValueToCm(heightVal, unit);

    // Lectura de Checkpoints Operacionales
    const packingIntegrity = document.getElementById('packing_integrity').value;
    const labelingComplete = document.getElementById('labeling_complete').value;
    const ispm15Seal = document.getElementById('ispm15_seal').value;
    const dgType = document.getElementById('dg_type').value;
    const dgSeparation = (dgType !== 'NO_DG') ? document.getElementById('dg_separation').value : 'NA';
    const weightMatch = document.getElementById('weight_match').value;
    
    // Crear el objeto de carga con todos los datos
    const cargoData = {
        awb: awb,
        content: content,
        length_cm: parseFloat(lengthCm.toFixed(2)),
        width_cm: parseFloat(widthCm.toFixed(2)),
        height_cm: parseFloat(heightCm.toFixed(2)),
        weight_declared: parseFloat(weightVal.toFixed(2)),
        weight_unit: weightUnit, 
        
        # Checkpoints Operacionales 
        packing_integrity: packingIntegrity,
        labeling_complete: labelingComplete,
        ispm15_seal: ispm15Seal,
        dg_type: dgType,
        dg_separation: dgSeparation,
        weight_match: weightMatch
    };

    try {
        const response = await fetch(`${BACKEND_URL}/cargas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cargoData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        generateCargoCard(result);
        
        // Limpiar el formulario después del envío exitoso
        document.querySelector('.operational-console').reset();
        toggleDGSeparation('NO_DG'); // Resetear la visibilidad de DG separation

    } catch (error) {
        console.error('Error al enviar la carga:', error);
        alert(LANG === 'es' ? 'Error al conectar con el servidor de AIPA.' : 'Error connecting to the AIPA server.');
    }
}


/**
 * Genera y muestra una tarjeta de carga con el puntaje de riesgo.
 * @param {object} cargo - Objeto de carga con el resultado del riesgo.
 */
function generateCargoCard(cargo) {
    const cargoList = document.getElementById('cargo_list_display');
    const l = LANGS[LANG];

    let riskClass;
    if (cargo.alertaScore <= 30) riskClass = 'risk-low';
    else if (cargo.alertaScore <= 60) riskClass = 'risk-medium';
    else riskClass = 'risk-high';

    const status = cargo.alertaScore > 50 ? 'HOLD' : 'OK';
    const statusText = status === 'OK' ? l.status_ok : l.status_hold;

    let alertsHtml = '';
    if (cargo.alerts && cargo.alerts.length > 0) {
        alertsHtml = cargo.alerts.map(a => `<li title="${standards.ALERTS_DB[a].desc}">${standards.ALERTS_DB[a].msg} (R${a})</li>`).join('');
        alertsHtml = `<p><strong>${l.alerts_label}:</strong></p><ul class="alert-list">${alertsHtml}</ul>`;
    }

    const cardHtml = `
        <div class="cargo-card" data-awb="${cargo.awb}" data-status="${status}">
            <h3 data-status="${status}">${cargo.awb} - ${statusText}</h3>
            <p><strong>${l.content_label.replace(':', '')}:</strong> ${cargo.content}</p>
            <p><strong>${l.dimensions_title.replace(':', '')}:</strong> ${cargo.length_cm}x${cargo.width_cm}x${cargo.height_cm} cm</p>
            <p><strong>${l.weight_label.replace(':', '')}:</strong> ${cargo.weight_declared} ${cargo.weight_unit.toUpperCase()}</p>
            <p><strong>${l.ispm15_label.replace('?', '')}:</strong> ${cargo.ispm15_seal}</p>
            <p><strong>${l.dg_type_label.replace(':', '')}:</strong> ${cargo.dg_type}</p>
            <hr>
            <p><span class="risk-score ${riskClass}" data-score="${cargo.alertaScore}">${l.risk_score_label}: ${cargo.alertaScore}%</span></p>
            ${alertsHtml}
        </div>
    `;

    cargoList.insertAdjacentHTML('afterbegin', cardHtml);
}

/**
 * Genera los botones de pago/servicios.
 */
function generatePaymentButtons() {
    const container = document.getElementById('payment_buttons_container');
    const l = LANGS[LANG];
    container.innerHTML = '';

    for (const [key, value] of Object.entries(l.payment_services)) {
        const button = document.createElement('button');
        button.textContent = value;
        button.onclick = () => alert(LANG === 'es' ? `Servicio "${value}" comprado. Gracias.` : `Service "${value}" purchased. Thank you.`);
        container.appendChild(button);
    }
}

/**
 * Envía la consulta al Asesor IA.
 */
async function getAdvisory() {
    const query = document.getElementById('advisory_query').value;
    const responseDiv = document.getElementById('advisory_response');
    responseDiv.innerHTML = `<p>${LANG === 'es' ? 'Consultando al asesor...' : 'Consulting the advisor...'}</p>`;

    try {
        const response = await fetch(`${BACKEND_URL}/advisory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: query })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const advisorResponse = result.response;
        
        // Aplicar la regla de 4 líneas: separar el primer párrafo del resto
        const paragraphs = advisorResponse.split('\n\n');
        const mainAdvice = paragraphs[0];
        const context = paragraphs.slice(1).join('<br>');
        
        let finalHtml = `<p><strong>SmartCargo Consulting:</strong></p>`;
        finalHtml += `<p style="font-size:1.1em; color:#003366;">${mainAdvice}</p>`;
        
        if (context) {
            finalHtml += `<p style="font-size:0.9em; border-left: 3px solid #ccc; padding-left: 10px;">${context}</p>`;
        }
        
        responseDiv.innerHTML = finalHtml;

    } catch (error) {
        console.error('Error al obtener la asesoría:', error);
        responseDiv.innerHTML = `<p style="color:red;">${LANG === 'es' ? 'Error al contactar con el Asesor IA.' : 'Error contacting the AI Advisor.'}</p>`;
    }
}


// Inicialización de la aplicación
(function () {
    // Establecer el idioma por defecto a Inglés (en) como se solicitó
    setLang('en'); 
    showPanel('cargas'); 
    generatePaymentButtons();
    // Inicializar la visibilidad de DG separation
    document.addEventListener('DOMContentLoaded', () => {
        toggleDGSeparation(document.getElementById('dg_type').value);
    });
})();

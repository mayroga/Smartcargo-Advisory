// ==============================================================================
// SMARTCARGO-ADVISORY — CÓDIGO DEL FRONTEND (app.js)
// VERSIÓN FINAL Y COMPLETA: Incluye lógica de Idioma y RUTA DE PAGOS ACTIVA.
// ==============================================================================

const BASE_URL = "http://127.0.0.1:8000"; // Cambiar a URL de Render en producción
let LANG = 'en'; // IDIOMA OFICIAL POR DEFECTO: Inglés

// --- CONTENIDO MULTI-IDIOMA ---

const TEXT_CONTENT = {
    en: {
        title: "🔒 SmartCargo-AIPA: Safety and Savings in your Logistics Chain",
        mission: "Our goal is to transform operational risk into **efficiency and profit** for every actor in the chain.",
        benefits: [
            { icon: "💰", text: "Cost Savings: Eliminate fines, excessive fees, and delay charges (Holds)." },
            { icon: "⏱️", text: "Time Savings: Avoid ramp rejection and lost hours due to documentation/packaging errors." },
            { icon: "🛡️", "text": "Risk Mitigation: Full coverage from Forwarder (legal DG paperwork) to Trucker (cargo safety)." },
            { icon: "✅", text: "Compliance: Validate your cargo against IATA, TSA (Screening limits), ISPM-15, and specific airline operational restrictions." }
        ],
        cta: "Ready to pre-validate your cargo and ensure shipping success?",
        validation_title: "AIPA Operational Console (Pre-Validation)",
        validation_subtitle: "For Forwarders, Truckers, and Counter Agents. **Save Money and Avoid Returns.**",
        results_title: "Preventive Audit Result",
        results_subtitle: "The goal is 0% risk.",
        risk_label: "HOLD/REJECTION RISK",
        alerts_header: "🛑 Critical Alerts Detected (AIPA Engine):",
        alerts_ok: "Preliminary Compliance OK! Low Operational Risk.",
        consequence: "Consequence: LOSS OF TIME and MONEY.",
        next_step_title: "👉 Next Step: Get the Immediate Solution.",
        next_step_body: "Use the AI Advisor to ask how to mitigate the risk of these alerts and secure your operation.",
        consultant_title: "SmartCargo Consulting (AI)",
        consultant_subtitle: "Your IATA/TSA/Logistics Consultant. **Concise Solutions and Immediate Actions**.",
        consultant_placeholder: "Type your query here...",
        consulting: "Consulting the advisor (Seeking Concise Solutions)...",
        consultant_response: "✅ SmartCargo AI Consultant Response:",
        consultant_note: "The Advisor will always give you the fastest solution to avoid the Hold.",
        connection_error: "Connection error with AIPA Engine.",
        ai_error: "Error connecting with AI Advisor. Try again.",
        button_validate: "Validate AIPA Cargo",
        button_pay: "Pay/Subscribe SmartCargo Tier"
    },
    es: {
        title: "🔒 SmartCargo-AIPA: Seguridad y Ahorro en su Cadena Logística",
        mission: "Nuestro objetivo es transformar el riesgo operativo en **eficiencia y ganancia** para cada actor de la cadena.",
        benefits: [
            { icon: "💰", text: "Ahorro de Costos: Elimine multas, pagos excesivos y cargos por demoras (Holds)." },
            { icon: "⏱️", text: "Ahorro de Tiempo: Evite el rechazo en rampa y las horas perdidas por errores de documentación/embalaje." },
            { icon: "🛡️", text: "Mitigación de Riesgos: Cobertura total desde el Forwarder (papeleo legal DG) hasta el Camionero (seguridad de carga)." },
            { icon: "✅", text: "Conformidad: Valide su carga contra IATA, TSA (límites de Screening), ISPM-15, y restricciones operacionales específicas de aerolíneas." }
        ],
        cta: "¿Listo para pre-validar su carga y asegurar el éxito del envío?",
        validation_title: "Consola Operacional AIPA (Pre-Validación)",
        validation_subtitle: "Para Forwarders, Camioneros y Counter Agents. **Ahorre Dinero y Evite Retornos.**",
        results_title: "Resultado de la Auditoría Preventiva",
        results_subtitle: "El objetivo es 0% de riesgo.",
        risk_label: "RIESGO DE HOLD O RECHAZO",
        alerts_header: "🛑 Alertas Críticas Detectadas (Motor AIPA):",
        alerts_ok: "¡Cumplimiento Preliminar OK! Bajo Riesgo Operacional.",
        consequence: "Consecuencia: PÉRDIDA DE TIEMPO y DINERO.",
        next_step_title: "👉 Siguiente Paso: Obtenga la Solución Inmediata.",
        next_step_body: "Use el Asesor AI para preguntar cómo mitigar el riesgo de estas alertas y asegurar su operación.",
        consultant_title: "SmartCargo Consulting (AI)",
        consultant_subtitle: "Su Consultor IATA/TSA/Logístico. Respuestas **Concisas y Soluciones Inmediatas**.",
        consultant_placeholder: "Escriba su duda aquí...",
        consulting: "Consultando al asesor (Buscando Soluciones Concisas)...",
        consultant_response: "✅ Respuesta del Consultor SmartCargo AI:",
        consultant_note: "El Asesor siempre le dará la solución más rápida para evitar el Hold.",
        connection_error: "Error de conexión con el Motor AIPA.",
        ai_error: "Error en la consulta al Asesor IA. Intente de nuevo.",
        button_validate: "Validar Carga AIPA",
        button_pay: "Pagar/Suscribir SmartCargo Tier"
    }
};

// --- FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    setupFormListeners();
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
    displayValueProposition();
    updateTextContent();
});

// --- FUNCIÓN DE IDIOMA ---

function updateTextContent() {
    const content = TEXT_CONTENT[LANG];

    // Actualiza textos en la interfaz
    document.getElementById('validationTitle').innerText = content.validation_title;
    document.getElementById('validationSubtitle').innerText = content.validation_subtitle;
    document.getElementById('resultsTitle').innerText = content.results_title;
    document.getElementById('resultsSubtitle').innerText = content.results_subtitle;
    document.getElementById('consultantTitle').innerText = content.consultant_title;
    document.getElementById('consultantSubtitle').innerText = content.consultant_subtitle;
    document.getElementById('advisoryPrompt').placeholder = content.consultant_placeholder;
    document.getElementById('consultantNote').innerText = content.consultant_note;
    document.getElementById('validationButton').innerText = content.button_validate;
    document.getElementById('paymentButton').innerText = content.button_pay; // Actualiza el botón de pago
    
    displayValueProposition();
    
    document.getElementById('langToggle').innerText = LANG === 'en' ? 'Cambiar a Español' : 'Switch to English';
}

function toggleLanguage() {
    LANG = LANG === 'en' ? 'es' : 'en';
    updateTextContent();
    // Limpiar resultados para evitar mezcla de idiomas en alertas
    document.getElementById('alertaScoreDisplay').innerHTML = `<span class="score-value">0%</span><span class="score-label">${TEXT_CONTENT[LANG].risk_label}</span>`;
    document.getElementById('alertsList').innerHTML = `<p class="text-secondary">${LANG === 'es' ? 'Introduzca los datos y valide la carga para ver las alertas.' : 'Enter data and validate cargo to see alerts.'}</p>`;
    document.getElementById('nextSteps').innerHTML = '';
}


// --- FUNCIONES DE ASESORÍA Y VALIDACIÓN ---

function displayRiskScore(score) {
    const content = TEXT_CONTENT[LANG];
    const scoreDiv = document.getElementById('alertaScoreDisplay');
    let colorClass = 'score-low'; 

    if (score >= 80) {
        colorClass = 'score-critical'; 
    } else if (score >= 50) {
        colorClass = 'score-high'; 
    } else if (score >= 20) {
        colorClass = 'score-medium'; 
    }

    scoreDiv.className = `alertaScore ${colorClass}`;
    scoreDiv.innerHTML = `<span class="score-value">${score}%</span><span class="score-label">${content.risk_label}</span>`;
}

function displayAlerts(alertKeys) {
    const content = TEXT_CONTENT[LANG];
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';
    
    if (alertKeys.length === 0) {
        alertsList.innerHTML = `<p class="text-success">${content.alerts_ok}</p>`;
        return;
    }

    const ALERTS_DB = window.standards ? window.standards.ALERTS_DB : {};

    alertsList.innerHTML = `<h4 class="text-danger">${content.alerts_header}</h4>`;

    alertKeys.forEach(key => {
        const alertInfo = ALERTS_DB[key] || { msg: `Alert ${key} Unknown`, desc: 'Configuration error.' };
        
        alertsList.innerHTML += `
            <div class="alert alert-warning border-left-danger">
                <strong>[${key}] ${alertInfo.msg}</strong>
                <p class="mb-0 small">${alertInfo.desc}</p>
                <p class="mt-1 small text-danger"><strong>${content.consequence}</strong></p>
            </div>
        `;
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    const content = TEXT_CONTENT[LANG];
    const form = e.target;
    const formData = new FormData(form);
    const cargoData = {};
    formData.forEach((value, key) => {
        if (key.includes('cm') || key.includes('weight')) {
            cargoData[key] = parseFloat(value);
        } else {
            cargoData[key] = value;
        }
    });
    
    try {
        const response = await fetch(`${BASE_URL}/cargas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cargoData)
        });

        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        const result = await response.json();
        
        displayRiskScore(result.alertaScore);
        displayAlerts(result.alerts);
        
        const nextStepsDiv = document.getElementById('nextSteps');
        nextStepsDiv.innerHTML = `<h5 class="mt-3">${content.next_step_title}</h5><p>${content.next_step_body}</p>`;

    } catch (error) {
        console.error('Error al validar la carga:', error);
        document.getElementById('alertsList').innerHTML = `<p class="text-danger">${content.connection_error}</p>`;
    }
}

async function getAdvisory(e) {
    e.preventDefault();
    const content = TEXT_CONTENT[LANG];
    const promptInput = document.getElementById('advisoryPrompt');
    const prompt = promptInput.value;
    const responseDiv = document.getElementById('advisory_response');

    if (!prompt) return;

    responseDiv.innerHTML = `<p class="text-info">${content.consulting}</p>`;
    
    try {
        const response = await fetch(`${BASE_URL}/advisory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        const result = await response.json();
        
        responseDiv.innerHTML = `<h5 class="text-primary">${content.consultant_response}</h5><p>${result.data}</p>`;
        
    } catch (error) {
        console.error('Error al consultar al Asesor IA:', error);
        responseDiv.innerHTML = `<p class="text-danger">${content.ai_error}</p>`;
    }
}

function displayValueProposition() {
    const content = TEXT_CONTENT[LANG];
    const container = document.getElementById('valuePropositionContainer');
    if (!container) return;

    let html = `
        <div class="card p-4 shadow-sm mb-4">
            <h3 class="card-title text-center text-primary mb-3">${content.title}</h3>
            <p class="lead text-center mb-4">${content.mission}</p>
            <div class="row">
    `;

    content.benefits.forEach(item => {
        html += `
            <div class="col-md-6 mb-3">
                <div class="d-flex align-items-start">
                    <span style="font-size: 1.5rem; margin-right: 10px;">${item.icon}</span>
                    <p class="mb-0"><strong>${item.text}</strong></p>
                </div>
            </div>
        `;
    });

    html += `
            </div>
            <p class="text-center mt-4"><em>${content.cta}</em></p>
        </div>
    `;

    container.innerHTML = html;
}

// --- LÓGICA DE PAGOS RESTABLECIDA ---

async function handlePaymentClick() {
    const content = TEXT_CONTENT[LANG];
    const amount = 65; // Ejemplo de un plan
    const description = "SmartCargo Professional Tier Subscription";

    try {
        const response = await fetch(`${BASE_URL}/create-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            // Enviamos los datos como x-www-form-urlencoded porque el backend usa Form(...)
            body: new URLSearchParams({
                'amount': amount,
                'description': description
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // El backend devuelve una URL (real de Stripe o simulada)
        if (result.url) {
            alert(LANG === 'en' ? `Redirecting to payment: ${result.url}` : `Redirigiendo al pago: ${result.url}`);
            // window.location.href = result.url; // Descomentar para redirección real
        } else {
            alert(LANG === 'en' ? `Payment success (Simulated): ${result.message}` : `Pago exitoso (Simulado): ${result.message}`);
        }

    } catch (error) {
        console.error('Error al iniciar el pago:', error);
        alert(LANG === 'en' ? 'Payment initiation error. Check backend configuration.' : 'Error al iniciar el pago. Verifique la configuración del backend.');
    }
}

// --- CONFIGURACIÓN DE LISTENERS ---
function setupFormListeners() {
    const validationForm = document.getElementById('cargoValidationForm');
    if (validationForm) {
        validationForm.addEventListener('submit', handleSubmit);
    }

    const advisoryForm = document.getElementById('advisoryForm');
    if (advisoryForm) {
        advisoryForm.addEventListener('submit', getAdvisory);
    }
    
    const paymentButton = document.getElementById('paymentButton');
    if (paymentButton) {
        // 🚨 Conexión a la función de pago restablecida
        paymentButton.addEventListener('click', handlePaymentClick);
    }
}

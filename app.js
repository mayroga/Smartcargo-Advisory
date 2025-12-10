// ==============================================================================
// SMARTCARGO-ADVISORY — CÓDIGO DEL FRONTEND (app.js)
// MANEJO DE LA LÓGICA DE INTERFAZ Y COMUNICACIÓN CON EL BACKEND
// ==============================================================================

const BASE_URL = "http://127.0.0.1:8000"; // Cambiar a URL de Render en producción
const LANG = 'es'; // Control de Idioma

// --- VALOR Y PROPÓSITO DEL SOFTWARE (Para mostrar en la interfaz) ---

const VALUE_PROPOSITION = {
    title: "🔒 SmartCargo-AIPA: Seguridad y Ahorro en su Cadena Logística",
    mission: "Nuestro objetivo es transformar el riesgo operativo en **eficiencia y ganancia** para cada actor de la cadena.",
    benefits: [
        { icon: "💰", text: "Ahorro de Costos: Elimine multas, pagos excesivos y cargos por demoras (Holds)." },
        { icon: "⏱️", text: "Ahorro de Tiempo: Evite el rechazo en rampa y las horas perdidas por errores de documentación/embalaje." },
        { icon: "🛡️", text: "Mitigación de Riesgos: Cobertura total desde el Forwarder (papeleo legal) hasta el Camionero (seguridad de carga)." },
        { icon: "✅", text: "Conformidad: Valide su carga contra IATA, TSA (límites de Screening), ISPM-15, y restricciones operacionales específicas de aerolíneas." }
    ],
    cta: "¿Listo para pre-validar su carga y asegurar el éxito del envío?"
};

// --- FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar listeners del formulario y botones
    setupFormListeners();
    // Mostrar la propuesta de valor al cargar la página
    displayValueProposition();
});

// --- FUNCIONES DE ASESORÍA Y VALIDACIÓN ---

/**
 * Muestra el puntaje de riesgo con el color adecuado y el mensaje clave.
 * @param {number} score 
 */
function displayRiskScore(score) {
    const scoreDiv = document.getElementById('alertaScoreDisplay');
    let colorClass = 'score-low'; // Verde por defecto

    if (score >= 80) {
        colorClass = 'score-critical'; // Rojo: Riesgo de rechazo inmediato
    } else if (score >= 50) {
        colorClass = 'score-high'; // Naranja: Riesgo de Hold
    } else if (score >= 20) {
        colorClass = 'score-medium'; // Amarillo: Necesita corrección menor
    }

    scoreDiv.className = `alertaScore ${colorClass}`;
    scoreDiv.innerHTML = `
        <span class="score-value">${score}%</span>
        <span class="score-label">${LANG === 'es' ? 'RIESGO DE HOLD O RECHAZO' : 'HOLD/REJECTION RISK'}</span>
    `;
}

/**
 * Muestra las alertas específicas y su impacto económico/operativo.
 * @param {Array<string>} alertKeys 
 */
function displayAlerts(alertKeys) {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';
    
    if (alertKeys.length === 0) {
        alertsList.innerHTML = `<p class="text-success">${LANG === 'es' ? '¡Cumplimiento Preliminar OK! Bajo Riesgo Operacional.' : 'Preliminary Compliance OK! Low Operational Risk.'}</p>`;
        return;
    }

    // Usamos el ALERTS_DB (global en standards.js)
    const ALERTS_DB = window.standards ? window.standards.ALERTS_DB : {};

    alertsList.innerHTML = `<h4 class="text-danger">${LANG === 'es' ? '🛑 Alertas Críticas Detectadas (Motor AIPA):' : '🛑 Critical Alerts Detected (AIPA Engine):'}</h4>`;

    alertKeys.forEach(key => {
        const alertInfo = ALERTS_DB[key] || { msg: `Alerta ${key} Desconocida`, desc: 'Error de configuración.' };
        
        // El mensaje ahora enfatiza la consecuencia económica/operativa (HOLD, DEVOLUCIÓN, MULTA)
        alertsList.innerHTML += `
            <div class="alert alert-warning border-left-danger">
                <strong>[${key}] ${alertInfo.msg}</strong>
                <p class="mb-0 small">${alertInfo.desc}</p>
                <p class="mt-1 small text-danger"><strong>Consecuencia: PÉRDIDA DE TIEMPO y DINERO.</strong></p>
            </div>
        `;
    });
}

/**
 * Envía los datos de la carga al backend para su validación.
 * @param {Event} e 
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const cargoData = {};

    formData.forEach((value, key) => {
        // Conversión de números y manejo de checkboxes
        if (key.includes('cm') || key.includes('weight')) {
            cargoData[key] = parseFloat(value);
        } else {
            cargoData[key] = value;
        }
    });

    try {
        const response = await fetch(`${BASE_URL}/cargas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cargoData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // 1. Mostrar el score y las alertas
        displayRiskScore(result.alertaScore);
        displayAlerts(result.alerts);
        
        // 2. Dar la CONFIANZA: Mostrar mensaje de "qué hacer ahora"
        const nextStepsDiv = document.getElementById('nextSteps');
        nextStepsDiv.innerHTML = `<h5 class="mt-3">${LANG === 'es' ? '👉 Siguiente Paso: Obtenga la Solución Inmediata.' : '👉 Next Step: Get the Immediate Solution.'}</h5>
            <p>${LANG === 'es' ? 'Use el Asesor AI para preguntar cómo mitigar el riesgo de estas alertas y asegurar su operación.' : 'Use the AI Advisor to ask how to mitigate this risk and secure your operation.'}</p>`;

    } catch (error) {
        console.error('Error al validar la carga:', error);
        document.getElementById('alertsList').innerHTML = `<p class="text-danger">${LANG === 'es' ? 'Error de conexión con el Motor AIPA.' : 'Connection error with AIPA Engine.'}</p>`;
    }
}

/**
 * Consulta al Asesor IA (Gemini)
 */
async function getAdvisory(e) {
    e.preventDefault();
    const promptInput = document.getElementById('advisoryPrompt');
    const prompt = promptInput.value;
    const responseDiv = document.getElementById('advisory_response');

    if (!prompt) return;

    // Esto BORRA el contenido anterior, cumpliendo la regla de profesionalidad
    responseDiv.innerHTML = `<p class="text-info">${LANG === 'es' ? 'Consultando al asesor (Buscando Soluciones Concisas)...' : 'Consulting the advisor (Seeking Concise Solutions)...'}</p>`;
    
    try {
        const response = await fetch(`${BASE_URL}/advisory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Muestra la respuesta concisa y orientada a la solución
        responseDiv.innerHTML = `<h5 class="text-primary">${LANG === 'es' ? '✅ Respuesta del Consultor SmartCargo AI:' : '✅ SmartCargo AI Consultant Response:'}</h5>
            <p>${result.data}</p>`;
        
    } catch (error) {
        console.error('Error al consultar al Asesor IA:', error);
        responseDiv.innerHTML = `<p class="text-danger">${LANG === 'es' ? 'Error en la conexión con el Asesor IA. Intente de nuevo.' : 'Error connecting with AI Advisor. Try again.'}</p>`;
    }
}


/**
 * Muestra la propuesta de valor (Fortalezas y Beneficios Económicos)
 */
function displayValueProposition() {
    const container = document.getElementById('valuePropositionContainer');
    if (!container) return;

    let html = `
        <div class="card p-4 shadow-sm mb-4">
            <h3 class="card-title text-center text-primary mb-3">${VALUE_PROPOSITION.title}</h3>
            <p class="lead text-center mb-4">${VALUE_PROPOSITION.mission}</p>
            <div class="row">
    `;

    // 🏆 Lista de Beneficios y Fortalezas
    VALUE_PROPOSITION.benefits.forEach(item => {
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
            <p class="text-center mt-4"><em>${VALUE_PROPOSITION.cta}</em></p>
        </div>
    `;

    container.innerHTML = html;
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
    
    // Asignar el botón de pago (si existe)
    const paymentButton = document.getElementById('paymentButton');
    if (paymentButton) {
        paymentButton.addEventListener('click', () => {
             alert('Simulación de Pago: SmartCargo Advisory Tier.');
             // Aquí iría la llamada real al backend /create-payment si fuera necesario.
        });
    }
}

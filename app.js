// ================================= CONFIG & IMPORTS =================================
// 🚨 RECUERDE REEMPLAZAR ESTA URL CON LA URL FINAL DE SU SERVICIO BACKEND EN RENDER 🚨
const BACKEND_URL = "https://smartcargo-aipa.onrender.com"; 

const ELEGANT_SERVICE_TIERS = [
// ... (código previo sin cambios en configuración)
// ...
];
// Configuración FINAL: FREE
const BACKEND_MODE = "free"; 

// ================================= MULTILENGUAJE (MISIÓN) =================================
// ... (código previo de LANGS sin cambios)
// ...

function setLang(l) {
// ... (código previo de setLang sin cambios)
// ...
    refreshCargas();
    refreshAlertas();
}

// ================================= PANEL SWITCH =================================
// ... (código previo de showPanel sin cambios)
// ...

// ================================= CARGAS =================================
async function refreshCargas() {
    try {
        // CORRECCIÓN: Asegura que el fetch usa la BACKEND_URL definida arriba
        const res = await fetch(`${BACKEND_URL}/cargas`);
        const data = await res.json();
        const tbody = document.querySelector('#cargasTableBody');
        tbody.innerHTML = '';

        (Array.isArray(data.cargas) ? data.cargas : data.cargas || []).forEach(c => {
            const id = c.id ?? c[0];
// ... (resto de lógica de refreshCargas sin cambios)
// ...
        });
    } catch (e) { console.error("Error al cargar cargas:", e); document.querySelector('#cargasTableBody').innerHTML = `<tr><td colspan="6" style="color:red;">Error al conectar con el backend. (Verifique si ${BACKEND_URL} está activo)</td></tr>`; }
}

function viewCarga(id) { 
// ... (código previo de viewCarga sin cambios)
// ...
}

function openNewCargaModal() {
// ... (código previo de openNewCargaModal sin cambios)
// ...
}

async function createCarga(payload) {
    try {
        const res = await fetch(`${BACKEND_URL}/cargas`, { 
// ... (resto de lógica de createCarga sin cambios)
// ...
        alert(`Carga creada ID: ${data.id.substring(0, 8)}... Alertas iniciales: ${data.alertas}`);
        refreshCargas();
        refreshAlertas();
    } catch (e) { console.error(e); alert("Error creando carga."); }
}

// ================================= ALERTAS Y SIMULACIÓN (PALPABLE) =================================
async function refreshAlertas() {
    try {
        // CORRECCIÓN: Fetch usa la BACKEND_URL
        const res = await fetch(`${BACKEND_URL}/alertas`);
        const data = await res.json();
        const tbody = document.querySelector('#alertasTableBody');
        tbody.innerHTML = '';
        
        // 1. Cargar alertas
        (Array.isArray(data.alertas) ? data.alertas : []).forEach(a => {
// ... (resto de lógica de carga de alertas sin cambios)
// ...
        });

        // 2. Ejecutar Simulación de Riesgo General y Ahorros
        const simRes = await fetch(`${BACKEND_URL}/simulacion/GENERAL/${data.alertas.length}`); 
        const simData = await simRes.json();
        const scoreDiv = document.getElementById('alertaScore');
        const t = LANGS[LANG];
        
        const riskValue = parseInt(simData.riesgo_rechazo.replace('%', ''));
        
        // CÁLCULO Y VISUALIZACIÓN DE AHORROS
        // Se asegura el acceso seguro al summary (si el backend retorna summary)
        const totalTimeSaved = data.summary?.total_time_saved || 0;
        const totalCostSaved = data.summary?.total_cost_saved || 0;
        
        // FEEDBACK VISUAL MEJORADO
        let scoreColor = '#d4edda'; // Bajo Riesgo (Verde)
        let scoreIcon = '👍';
// ... (resto de lógica de feedback visual sin cambios)
// ...
        scoreDiv.style.border = `1px solid ${riskValue >= 70 ? '#f5c6cb' : riskValue >= 40 ? '#ffeeba' : '#c3e6cb'}`;
        
        // Incorporamos el ahorro de Tiempo y Dinero
        scoreDiv.innerHTML = `
            ${scoreIcon} ${t.riesgo}: <strong>${simData.riesgo_rechazo}</strong> 
            <p style="margin-top: 5px; font-weight: normal;">Sugerencia AIPA: <em>${simData.sugerencia}</em></p>
            <hr style="margin: 5px 0; border-top: 1px solid #ccc;">
            <p style="font-weight: bold; color: #007bff;">
                💰 Ahorro Proactivo: $${totalCostSaved.toLocaleString()} USD | ⏱️ Tiempo Ganado: ${totalTimeSaved} Hrs
            </p>`;

    } catch (e) { console.error("Error loading alertas:", e); 
        // Mensaje de error más descriptivo
        document.getElementById('alertaScore').innerHTML = `🚨 Error de Conexión. El backend (${BACKEND_URL}) no responde.`;
    }
}

// ================================= DOCUMENTOS Y LIMPIEZA =================================
async function uploadDoc() {
// ... (código previo sin cambios)
    try {
        const res = await fetch(`${BACKEND_URL}/upload`, { method: 'POST', body: fd });
        const j = await res.json();
// ... (resto de lógica de uploadDoc sin cambios)
    } catch (e) { console.error(e); alert("Upload failed"); }
}

function clearUploadFields() {
// ... (código previo sin cambios)
}

// ================================= ASESORÍA IA (SMARTCARGO CONSULTING) =================================
async function askAssistant() {
// ... (código previo sin cambios)
    try {
        const fd = new FormData();
        fd.append('question', q);
        
        const res = await fetch(`${BACKEND_URL}/advisory`, { method: 'POST', body: fd });
// ... (resto de lógica de askAssistant sin cambios)
    } catch (e) {
// ... (resto de lógica de askAssistant sin cambios)
    }
    responseDiv.scrollTop = responseDiv.scrollHeight; 
}

function clearAdvisoryChat() {
// ... (código previo sin cambios)
}


// ================================= PAGOS (MOCK) =================================
function generatePaymentButtons() {
// ... (código previo sin cambios)
}

async function startPayment(amount, desc) {
    if (BACKEND_MODE === "free") { 
// ... (código previo sin cambios)
        return; 
    }
    
    try {
        const fd = new FormData();
        fd.append('amount', amount);
        fd.append('description', desc);
        
        const res = await fetch(`${BACKEND_URL}/create-payment`, { method: 'POST', body: fd });
        const data = await res.json();

// ... (resto de lógica de startPayment sin cambios)
    } catch (e) {
        console.error("Payment simulation error:", e);
        alert("Fallo en la simulación de pago.");
    }
}


// ================================= INIT =================================
(function () {
// ... (código previo sin cambios)
})();

// ================================= CONFIG & IMPORTS =================================
const BACKEND_URL = "https://smartcargo-aipa.onrender.com"; 

const ELEGANT_SERVICE_TIERS = [
    { name: "Plan Operador (Mensual)", price: "$99.00" },
    { name: "Plan Corporativo (Anual)", price: "$999.00" }
];
// Configuración FINAL: FREE
const BACKEND_MODE = "free"; 

// ================================= MULTILENGUAJE (MISIÓN) =================================
const LANGS = {
    en: {
        tagline: "Client Merchandise Defense: Air, Maritime, and Ground Compliance Advisory to Prevent Holds and Fines.",
        cargas: "Active Shipments",
        documentos: "Upload Documents/Photos",
        alertas: "Generated Alerts by AIPA 🚨",
        advisory: "SmartCargo Consulting (Direct Solutions)", 
        pagos: "Premium Plans and Services",
        riesgo: "General Rejection Risk",
        upload_btn: "Upload and Verify",
        new_carga: "+ New Shipment",
        consult_btn: "Consult",
        client_name: "Client Name:",
        cargo_type: "Cargo Type:",
        pallet_type: "Pallet Type (wood, plastic, metal):",
        ispm15: "ISPM-15 Verified (true/false):",
        height: "Height (cm):",
        advisory_desc: "Ask about regulations, submit photos/writings for **Review, Advisory, and Direct Solutions** so your cargo flows without HOLDS. Serves all links: Client, Forwarder, Trucker, Handler, Airline/Port.",
        legal_disclaimer: "[LEGAL DISCLAIMER] AIPA's advice is PREVENTIVE, not a legal certification. The user is solely responsible for final cargo verification.",
        scope_title: "AIPA Inspection Scope (We Cover 100% of the Cargo):",
        scope_list_1: "Merchandise: DG/HAZMAT, Perishables, Fragile, Oversized.",
        scope_list_2: "Packaging: Labeling, Segregation/Consolidation, Pallets (ISPM-15), Temperatures.",
        scope_list_3: "Process: Documentation (AWB, Weight), Inconsistencies, HOLD / Fine Risk.",
    },
    es: {
        tagline: "La Defensa de la Mercancía del Cliente: Asesoría de Cumplimiento Aéreo, Marítimo y Terrestre, para evitar Holds y Multas.",
        cargas: "Cargas Activas",
        documentos: "Subir Documentos/Fotos",
        alertas: "Alertas Generadas por AIPA 🚨",
        advisory: "SmartCargo Consulting (Soluciones Directas)",
        pagos: "Planes y Servicios Premium",
        riesgo: "Riesgo General de Rechazo",
        upload_btn: "Subir y Verificar",
        new_carga: "+ Nueva Carga",
        consult_btn: "Consultar",
        client_name: "Nombre del Cliente:",
        cargo_type: "Tipo de Carga (DG, Perecederos, Quimicos, Frágil):",
        pallet_type: "Tipo de Pallet (madera, plastico, metal):",
        ispm15: "¿ISPM-15 Verificado? (true/false):",
        height: "Altura (cm):",
        advisory_desc: "Pregunte por regulaciones, envíe fotos/escritos para **Revisión, Asesoría y Soluciones Directas** para que su carga fluya sin HOLDS. Sirve a toda la cadena: Cliente, Forwarder, Camionero, Handler, Aerolínea/Puerto.",
        legal_disclaimer: "[DISCLAIMER LEGAL] La asesoría de AIPA es PREVENTIVA, no una certificación legal. El usuario es el único responsable de la verificación legal final de la carga.",
        scope_title: "Alcance de la Inspección AIPA (Cubrimos el 100% de la Carga):",
        scope_list_1: "Mercancía: DG/HAZMAT, Perecederos, Frágil, Sobredimensionada.",
        scope_list_2: "Embalaje: Etiquetado, Separación/Consolidación, Pallets (ISPM-15), Temperaturas.",
        scope_list_3: "Proceso: Documentación (AWB, Peso), Inconsistencias, Riesgo de HOLD / Multa.",
    }
};
let LANG = 'es';

function setLang(l) {
    LANG = l;
    const t = LANGS[l];
    // Actualizar textos principales
    document.getElementById('tagline').innerText = t.tagline;
    document.getElementById('titleCargas').innerText = t.cargas;
    document.getElementById('titleDocumentos').innerText = t.documentos;
    document.getElementById('titleAlertas').innerText = t.alertas;
    document.getElementById('titleAdvisory').innerText = t.advisory;
    document.getElementById('titlePagos').innerText = t.pagos;
    document.getElementById('btnUpload').innerText = t.upload_btn;
    document.getElementById('btnAdvisory').innerText = t.consult_btn;
    document.getElementById('btnNewCarga').innerText = t.new_carga;
    // Actualizar Descripción, Disclaimer Legal y Alcance
    document.getElementById('advisory_desc').innerText = t.advisory_desc;
    document.getElementById('legal_disclaimer').innerText = t.legal_disclaimer;
    
    // Actualizar la lista de Alcance
    const scopeDiv = document.getElementById('scope_list');
    if(scopeDiv) {
        scopeDiv.querySelector('p').innerText = t.scope_title;
        scopeDiv.querySelector('ul').children[0].innerHTML = `**Mercancía:** ${t.scope_list_1.split(': ')[1]}`;
        scopeDiv.querySelector('ul').children[1].innerHTML = `**Embalaje:** ${t.scope_list_2.split(': ')[1]}`;
        scopeDiv.querySelector('ul').children[2].innerHTML = `**Proceso:** ${t.scope_list_3.split(': ')[1]}`;
    }

    refreshCargas();
    refreshAlertas();
}

// ================================= PANEL SWITCH =================================
function showPanel(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'alertas') {
        refreshAlertas();
    }
}

// ================================= CARGAS =================================
async function refreshCargas() {
    try {
        const res = await fetch(`${BACKEND_URL}/cargas`);
        const data = await res.json();
        const tbody = document.querySelector('#cargasTableBody');
        tbody.innerHTML = '';

        (Array.isArray(data.cargas) ? data.cargas : data.cargas || []).forEach(c => {
            const id = c.id ?? c[0];
            const client = c.cliente ?? c.client_name ?? c[1] ?? '';
            const tipo = c.tipo_carga ?? c.tipo ?? c[2] ?? '';
            const estado = c.estado ?? c[3] ?? 'En revisión';
            const alertas = c.alertas ?? c[4] ?? 0;

            const tr = document.createElement('tr');
            const alertClass = alertas > 0 ? (alertas > 2 ? 'alert-critical' : 'alert-warning') : '';
            
            // Añadir onclick a la fila para la interacción de la Carga ID
            tr.innerHTML = `
                <td onclick="viewCarga('${id}')">${id.substring(0, 8)}...</td>
                <td>${client}</td>
                <td>${tipo}</td>
                <td>${estado}</td>
                <td class="${alertClass}">${alertas} ${alertas > 0 ? '🚨' : '✅'}</td>
                <td><button class="btn btn-sm btn-outline-secondary" onclick="viewCarga('${id}')">View</button></td>`;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Error al cargar cargas:", e); document.querySelector('#cargasTableBody').innerHTML = `<tr><td colspan="6" style="color:red;">Error al conectar con el backend.</td></tr>`; }
}

function viewCarga(id) { 
    // Función de placeholder para dar interacción al ID Carga, ID Alerta y otros campos
    alert(`Abriendo detalles de la Carga ID: ${id.substring(0, 8)}... (Aquí podría editar, ver documentos, historial, etc.)`); 
}

function openNewCargaModal() {
    const t = LANGS[LANG];
    // Se usan prompts para simular campos de texto sencillos y fáciles de llenar
    const client = prompt(t.client_name); if (!client) return;
    const tipo = prompt(t.cargo_type, "Perecederos"); if (!tipo) return;
    const pallet = prompt(t.pallet_type, "madera");
    const ispm15 = prompt(t.ispm15, "false");
    const height = parseInt(prompt(t.height, "150") || '0');

    createCarga({ 
        cliente: client, 
        tipo_carga: tipo, 
        pallet_type: pallet,
        ispm15_verified: ispm15.toLowerCase() === 'true',
        height_cm: height
    });
}

async function createCarga(payload) {
    try {
        const res = await fetch(`${BACKEND_URL}/cargas`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        });
        const data = await res.json();
        alert(`Carga creada ID: ${data.id.substring(0, 8)}... Alertas iniciales: ${data.alertas}`);
        refreshCargas();
        refreshAlertas();
    } catch (e) { console.error(e); alert("Error creando carga."); }
}

// ================================= ALERTAS Y SIMULACIÓN (PALPABLE) =================================
async function refreshAlertas() {
    try {
        const res = await fetch(`${BACKEND_URL}/alertas`);
        const data = await res.json();
        const tbody = document.querySelector('#alertasTableBody');
        tbody.innerHTML = '';
        
        // 1. Cargar alertas
        (Array.isArray(data.alertas) ? data.alertas : []).forEach(a => {
            const tr = document.createElement('tr');
            let colorClass = '';
            let emoji = '✅';
            if (a.nivel === 'CRITICAL') { colorClass = 'alert-critical'; emoji = '❌'; }
            else if (a.nivel === 'WARNING') { colorClass = 'alert-warning'; emoji = '⚠️'; }
            else { colorClass = 'alert-info'; emoji = '💡'; }

            tr.innerHTML = `
                <td onclick="viewCarga('${a.carga_id}')">${a.carga_id.substring(0, 8)}...</td>
                <td class="${colorClass}">${a.nivel} ${emoji}</td>
                <td>${a.mensaje}</td>
                <td>${new Date(a.fecha).toLocaleDateString()}</td>`;
            tbody.appendChild(tr);
        });

        // 2. Ejecutar Simulación de Riesgo General
        const simRes = await fetch(`${BACKEND_URL}/simulacion/GENERAL/${data.alertas.length}`); 
        const simData = await simRes.json();
        const scoreDiv = document.getElementById('alertaScore');
        const t = LANGS[LANG];
        
        const riskValue = parseInt(simData.riesgo_rechazo.replace('%', ''));
        
        // FEEDBACK VISUAL MEJORADO
        let scoreColor = '#d4edda'; // Bajo Riesgo (Verde)
        let scoreIcon = '👍';
        if (riskValue >= 70) {
            scoreColor = '#f8d7da'; // CRÍTICO (Rojo claro)
            scoreIcon = '🚨';
        } else if (riskValue >= 40) {
            scoreColor = '#fff3cd'; // ALTO RIESGO (Amarillo claro)
            scoreIcon = '🔔';
        }

        scoreDiv.style.backgroundColor = scoreColor;
        scoreDiv.style.color = 'black'; 
        scoreDiv.style.border = `1px solid ${riskValue >= 70 ? '#f5c6cb' : riskValue >= 40 ? '#ffeeba' : '#c3e6cb'}`;
        
        scoreDiv.innerHTML = `
            ${scoreIcon} ${t.riesgo}: <strong>${simData.riesgo_rechazo}</strong> 
            <p style="margin-top: 5px; font-weight: normal;">Sugerencia AIPA: <em>${simData.sugerencia}</em></p>`;


    } catch (e) { console.error("Error loading alertas:", e); }
}

// ================================= DOCUMENTOS Y LIMPIEZA =================================
async function uploadDoc() {
    const input = document.getElementById('docFile');
    const cargaId = document.getElementById('docCargaId').value.trim();
    if (!input.files.length || !cargaId) { alert("Choose file and enter Carga ID"); return; }
    
    const fd = new FormData();
    fd.append('file', input.files[0]);
    fd.append('carga_id', cargaId);

    try {
        const res = await fetch(`${BACKEND_URL}/upload`, { method: 'POST', body: fd });
        const j = await res.json();
        alert(`File uploaded: ${j.data?.filename}. Carga ID: ${j.data?.carga_id}. Verificando inconsistencias...`);
        refreshAlertas(); 
    } catch (e) { console.error(e); alert("Upload failed"); }
}

function clearUploadFields() {
    document.getElementById('docCargaId').value = '';
    document.getElementById('docFile').value = ''; 
    alert('Campos de subida borrados.');
}

// ================================= ASESORÍA IA (SMARTCARGO CONSULTING) =================================
async function askAssistant() {
    const q = document.getElementById('advisoryQuestion').value.trim();
    if (!q) return;
    const responseDiv = document.getElementById('advisoryResponse');
    
    const userQuestion = `<p style="font-weight: bold; border-bottom: 1px dashed #ccc; padding-bottom: 5px;">👤 Tú preguntas: ${q}</p>`;

    document.getElementById('advisoryQuestion').value = '';
    
    responseDiv.innerHTML += userQuestion;
    responseDiv.innerHTML += `<p id="consulta_status" style="color:#004080; font-style: italic;">Consultando a SmartCargo Consulting (Buscando Soluciones Directas)... Por favor, espera.</p>`;
    responseDiv.scrollTop = responseDiv.scrollHeight; 

    try {
        const fd = new FormData();
        fd.append('question', q);
        
        const res = await fetch(`${BACKEND_URL}/advisory`, { method: 'POST', body: fd });
        const j = await res.json();
        
        const statusElement = document.getElementById('consulta_status');
        if (statusElement) statusElement.remove(); 
        
        if (j.error) {
            responseDiv.innerHTML += `<div style="padding: 10px; background-color: #ffe0e0; border-left: 5px solid red; margin: 10px 0;">❌ ERROR de SmartCargo Consulting: ${j.error}</div>`;
        } else {
            // Estilo para hacer la respuesta más palpable y accionable
            responseDiv.innerHTML += `
                <div style="margin: 10px 0; padding: 10px; border: 1px solid #0066cc; background-color: #f0f8ff;">
                    <p style="color: #0066cc; font-weight: bold; margin-bottom: 5px;">🤖 SmartCargo Consulting Responde:</p>
                    <p>${j.data.replace(/\n/g, '<br>')}</p>
                </div>`;
        }
        
    } catch (e) {
        const statusElement = document.getElementById('consulta_status');
        if (statusElement) statusElement.remove();
        responseDiv.innerHTML += `<div style="padding: 10px; background-color: #ffe0e0; border-left: 5px solid red; margin: 10px 0;">❌ Error: No se pudo contactar a SmartCargo Consulting. Verifique el backend.</div>`;
    }
    responseDiv.scrollTop = responseDiv.scrollHeight; 
}

function clearAdvisoryChat() {
    document.getElementById('advisoryQuestion').value = '';
    document.getElementById('advisoryResponse').innerHTML = ''; 
    alert('Historial de asesoría limpiado.');
}


// ================================= PAGOS (MOCK) =================================
function generatePaymentButtons() {
    const subsContainer = document.getElementById('subscriptionButtons');
    const servContainer = document.getElementById('serviceButtons');
    subsContainer.innerHTML = '';
    servContainer.innerHTML = '';

    ELEGANT_SERVICE_TIERS.forEach(t => {
        const btn = document.createElement('button');
        // Se mantiene el color gris para evitar confusión si el modo FREE está activo.
        btn.className = BACKEND_MODE === "pay" ? "btn btn-primary" : "btn btn-secondary btn"; 
        btn.innerText = `${t.name} — ${t.price}`;
        btn.onclick = () => startPayment(parseFloat(t.price.replace(/\$/g, '').replace(/,/g, '')), t.name);
        subsContainer.appendChild(btn);
    });

    const services = [
        { name: "Upload & Verify Cargo", price: 10 },
        { name: "Advanced Simulation", price: 15 },
        { name: "Report PDF/Excel", price: 12 }
    ];
    services.forEach(s => {
        const btn = document.createElement('button');
        btn.className = BACKEND_MODE === "pay" ? "btn btn-sm btn-primary btn" : "btn btn-sm btn";
        btn.innerText = `$${s.price} ${s.name}`;
        btn.onclick = () => startPayment(s.price, s.name);
        servContainer.appendChild(btn);
    });
}

async function startPayment(amount, desc) {
    if (BACKEND_MODE === "free") { 
        alert(`Pago simulado: ${desc} — Gratis. SmartCargo Consulting está actualmente en modo GRATUITO. Disfrute de los servicios sin costo.`); 
        return; 
    }
    alert(`Iniciando pago por ${desc} ($${amount})`);
}


// ================================= INIT =================================
(function () {
    setLang('es');
    showPanel('cargas'); 
    generatePaymentButtons();
})();

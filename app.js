// ================================= CONFIG & IMPORTS =================================
// NOTA: Para el backend real, reemplaza esta URL con la URL de tu servicio de Render
const BACKEND_URL = "https://smartcargo-aipa.onrender.com"; 

// Datos Mock para Pagos (Sección 6)
const ELEGANT_SERVICE_TIERS = [
    { name: "Plan Operador (Mensual)", price: "$99.00" },
    { name: "Plan Corporativo (Anual)", price: "$999.00" }
];
const BACKEND_MODE = "free"; 

// ================================= MULTILENGUAJE (Sección 3.6) =================================
const LANGS = {
    en: {
        tagline: "Virtual preventive advisory to protect client's merchandise",
        cargas: "Active Shipments",
        documentos: "Upload Documents/Photos",
        alertas: "Generated Alerts by AIPA 🚨",
        advisory: "Preventive AI Advisory",
        pagos: "Premium Plans and Services",
        riesgo: "General Rejection Risk",
        upload_btn: "Upload and Verify",
        new_carga: "+ New Shipment",
        consult_btn: "Consult",
        client_name: "Client Name:",
        cargo_type: "Cargo Type:",
        pallet_type: "Pallet Type (madera, plastico, metal):",
        ispm15: "ISPM-15 Verified (true/false):",
        height: "Height (cm):"
    },
    es: {
        tagline: "Asesoría preventiva virtual para proteger la mercancía del cliente",
        cargas: "Cargas Activas",
        documentos: "Subir Documentos/Fotos",
        alertas: "Alertas Generadas por AIPA 🚨",
        advisory: "Asesoría Preventiva IA",
        pagos: "Planes y Servicios Premium",
        riesgo: "Riesgo General de Rechazo",
        upload_btn: "Subir y Verificar",
        new_carga: "+ Nueva Carga",
        consult_btn: "Consultar",
        client_name: "Nombre del Cliente:",
        cargo_type: "Tipo de Carga (DG, Perecederos, Quimicos, Frágil):",
        pallet_type: "Tipo de Pallet (madera, plastico, metal):",
        ispm15: "¿ISPM-15 Verificado? (true/false):",
        height: "Altura (cm):"
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
    
    // Recargar cargas y alertas para actualizar el contenido dinámico
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

// ================================= CARGAS (Sección 4) =================================
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
            
            tr.innerHTML = `
                <td>${id.substring(0, 8)}...</td>
                <td>${client}</td>
                <td>${tipo}</td>
                <td>${estado}</td>
                <td class="${alertClass}">${alertas}</td>
                <td><button class="btn btn-sm btn-outline-secondary" onclick="viewCarga('${id}')">View</button></td>`;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Error al cargar cargas:", e); document.querySelector('#cargasTableBody').innerHTML = `<tr><td colspan="6" style="color:red;">Error al conectar con el backend.</td></tr>`; }
}

function viewCarga(id) { alert("Open carga details: " + id); }

function openNewCargaModal() {
    const t = LANGS[LANG];
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

// ================================= ALERTAS Y SIMULACIÓN (Sección 3.4/3.5) =================================
async function refreshAlertas() {
    try {
        const res = await fetch(`${BACKEND_URL}/alertas`);
        const data = await res.json();
        const tbody = document.querySelector('#alertasTableBody');
        tbody.innerHTML = '';
        
        // 1. Cargar alertas
        (Array.isArray(data.alertas) ? data.alertas : []).forEach(a => {
            const tr = document.createElement('tr');
            let colorClass = a.nivel === 'CRITICAL' ? 'alert-critical' : a.nivel === 'WARNING' ? 'alert-warning' : 'alert-info';
            tr.innerHTML = `
                <td>${a.carga_id.substring(0, 8)}...</td>
                <td class="${colorClass}">${a.nivel}</td>
                <td>${a.mensaje}</td>
                <td>${new Date(a.fecha).toLocaleDateString()}</td>`;
            tbody.appendChild(tr);
        });

        // 2. Ejecutar Simulación de Riesgo General
        const simRes = await fetch(`${BACKEND_URL}/simulacion/GENERAL/5`); 
        const simData = await simRes.json();
        const scoreDiv = document.getElementById('alertaScore');
        const t = LANGS[LANG];
        
        scoreDiv.innerText = `${t.riesgo}: ${simData.riesgo_rechazo}`;
        if (simData.riesgo_rechazo.includes('50%')) {
            scoreDiv.style.backgroundColor = '#f0ad4e'; // Warning
        } else if (simData.riesgo_rechazo.includes('80%') || simData.riesgo_rechazo.includes('100%')) {
            scoreDiv.style.backgroundColor = '#d9534f'; // Critical
        } else {
            scoreDiv.style.backgroundColor = '#ffe0b2'; // Info
        }

    } catch (e) { console.error("Error loading alertas:", e); }
}

// ================================= DOCUMENTOS (Sección 3.2) =================================
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
        refreshAlertas(); // Recargar para ver si la subida disparó una alerta (e.g., R005)
    } catch (e) { console.error(e); alert("Upload failed"); }
}

// ================================= ASESORÍA IA (Sección 1) =================================
async function askAssistant() {
    const q = document.getElementById('advisoryQuestion').value.trim();
    if (!q) return;
    const responseDiv = document.getElementById('advisoryResponse');
    responseDiv.innerHTML = `<p>Consultando a AIPA...</p>`;

    try {
        const fd = new FormData();
        fd.append('question', q);
        
        const res = await fetch(`${BACKEND_URL}/advisory`, {
            method: 'POST',
            body: fd
        });
        const j = await res.json();
        if (j.error) {
            responseDiv.innerHTML = `<p style="color:red;">Error: ${j.error}</p>`;
        } else {
            responseDiv.innerHTML = `<p><strong>AIPA:</strong> ${j.data.replace(/\n/g, '<br>')}</p>`;
        }
    } catch (e) {
        responseDiv.innerHTML = `<p style="color:red;">Error: No se pudo contactar al asesor AIPA. Verifique el backend.</p>`;
    }
}

// ================================= PAGOS (MOCK) =================================
function generatePaymentButtons() {
    const subsContainer = document.getElementById('subscriptionButtons');
    const servContainer = document.getElementById('serviceButtons');
    subsContainer.innerHTML = '';
    servContainer.innerHTML = '';

    // Suscripciones
    ELEGANT_SERVICE_TIERS.forEach(t => {
        const btn = document.createElement('button');
        btn.className = BACKEND_MODE === "pay" ? "btn btn-primary" : "btn btn-outline-secondary btn";
        btn.innerText = `${t.name} — ${t.price}`;
        btn.onclick = () => startPayment(parseFloat(t.price.replace(/\$/g, '').replace(/,/g, '')), t.name);
        subsContainer.appendChild(btn);
    });

    // Servicios individuales
    const services = [
        { name: "Upload & Verify Cargo", price: 10 },
        { name: "Advanced Simulation", price: 15 },
        { name: "Report PDF/Excel", price: 12 }
    ];
    services.forEach(s => {
        const btn = document.createElement('button');
        btn.className = BACKEND_MODE === "pay" ? "btn btn-sm btn-outline-primary btn" : "btn btn-sm btn";
        btn.innerText = `$${s.price} ${s.name}`;
        btn.onclick = () => startPayment(s.price, s.name);
        servContainer.appendChild(btn);
    });
}

async function startPayment(amount, desc) {
    if (BACKEND_MODE === "free") { alert(`Pago simulado: ${desc} — Gratis`); return; }
    // Implementación real de pago iría aquí
    alert(`Iniciando pago por ${desc} ($${amount})`);
}


// ================================= INIT =================================
(function () {
    setLang('es');
    showPanel('cargas'); 
    generatePaymentButtons();
})();

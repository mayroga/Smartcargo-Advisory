const BACKEND_URL = "https://smartcargo-aipa.onrender.com";
document.getElementById('backendUrlDisplay').innerText = BACKEND_URL;

// ==================== CARGAS ====================
async function cargarTabla() {
  const res = await fetch(`${BACKEND_URL}/cargas`);
  const data = await res.json();
  const tbody = document.getElementById("tableCargas");
  tbody.innerHTML = "";
  const cargaSelect = document.getElementById("cargaSelect");
  cargaSelect.innerHTML = "";
  data.cargas.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${c.id}</td><td>${c.cliente}</td><td>${c.tipo_carga}</td><td>${c.estado}</td><td>${c.alertas}</td><td>${c.files.join(", ")}</td>`;
    tbody.appendChild(tr);
    const option = document.createElement("option");
    option.value = c.id;
    option.text = `${c.cliente} (${c.id})`;
    cargaSelect.appendChild(option);
  });
}

async function crearCarga() {
  const cliente = prompt("Nombre del cliente:");
  if(!cliente) return;
  const tipo = prompt("Tipo de carga:", "Perishables");
  const fd = new FormData();
  fd.append("cliente", cliente);
  fd.append("tipo_carga", tipo);
  await fetch(`${BACKEND_URL}/cargas`, {method:"POST", body:fd});
  cargarTabla();
}

// ==================== UPLOAD ====================
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const cargaId = document.getElementById("cargaSelect").value;
  if(!fileInput.files.length || !cargaId) return alert("Selecciona archivo y carga");
  const fd = new FormData();
  fd.append("file", fileInput.files[0]);
  fd.append("carga_id", cargaId);
  const res = await fetch(`${BACKEND_URL}/upload`, {method:"POST", body:fd});
  const j = await res.json();
  document.getElementById("uploadResult").innerText = j.filename;
  cargarTabla();
}

// ==================== SIMULACION ====================
async function runSimulation() {
  const tipo = document.getElementById("simTipo").value;
  const count = parseInt(document.getElementById("simCount").value || "0");
  const res = await fetch(`${BACKEND_URL}/simulacion/${tipo}/${count}`);
  const j = await res.json();
  document.getElementById("simResult").innerText = `Riesgo: ${j.riesgo_rechazo}`;
}

// ==================== ASSISTANT ====================
async function askAssistant() {
  const q = document.getElementById("qInput").value;
  if(!q) return;
  document.getElementById("chat").innerHTML += `<div class="msg-user">Tú: ${q}</div>`;
  const fd = new FormData();
  fd.append("question", q);
  const res = await fetch(`${BACKEND_URL}/advisory`, {method:"POST", body:fd});
  const j = await res.json();
  document.getElementById("chat").innerHTML += `<div class="msg-aipa">AIPA: ${j.data}</div>`;
  document.getElementById("qInput").value = "";
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
}

// ==================== PAGOS SIMULADOS ====================
function generarPagos() {
  const container = document.getElementById("serviceButtons");
  const servicios = [
    {name:"Upload & Verify Cargo", price:10},
    {name:"Advanced Simulation", price:15},
    {name:"Report PDF/Excel", price:12}
  ];
  servicios.forEach(s => {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-primary m-1";
    btn.innerText = `$${s.price} ${s.name}`;
    btn.onclick = ()=>alert(`Pago simulado: ${s.name} - $${s.price}`);
    container.appendChild(btn);
  });
}

// ==================== INIT ====================
cargarTabla();
generarPagos();

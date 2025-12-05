import {
    AWB_MANDATORY_FIELDS,
    ISPM_15_STANDARD,
    UNIVERSAL_LABELS
} from "./cargo_standards.js";

import { CORE_LEGAL_DISCLAIMER } from "./legal_warning.js";

import { ELEGANT_SERVICE_TIERS } from "./pricing.js";

/* ================= CONFIG ================= */
const BACKEND_URL = "<https://smartcargo-aipa.onrender.com>";
const BACKEND_MODE = "free"; // cambia a "pay" para activar cobro
document.getElementById('backendUrlDisplay').innerText = BACKEND_URL;

/* ================= PANEL SWITCH ================= */
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ================= LANGUAGES ================= */
const LANGS = {en:{cargas:"Active Shipments"},es:{cargas:"Cargas activas"}};
let LANG='en';
function setLang(l){ 
  LANG=l; 
  document.getElementById('titleCargas').innerText = LANGS[l]?.cargas || LANGS['en'].cargas; 
}

/* ================= CARGAS ================= */
async function refreshCargas(){
  try{
    const res = await fetch(`${BACKEND_URL}/cargas`);
    const cargas = await res.json();
    const tbody = document.querySelector('#tableCargas tbody');
    tbody.innerHTML = '';
    (Array.isArray(cargas)?cargas:cargas.cargas||[]).forEach(c=>{
      const id = c.id??c[0], client=c.cliente??c.client_name??c[1]??'', tipo=c.tipo_carga??c.tipo??c[2]??'', estado=c.estado??c[3]??'En revisión', alertas=c.alertas??c[4]??0;
      const tr = document.createElement('tr');
      tr.innerHTML=`<td>${id}</td><td>${client}</td><td>${tipo}</td><td>${estado}</td>
      <td>${alertas>0?`<span style="color:#d9534f;font-weight:700">${alertas}</span>`:alertas}</td>
      <td><button class="btn btn-sm btn-outline-secondary" onclick="viewCarga(${id})">View</button></td>`;
      tbody.appendChild(tr);
    });
  } catch(e){console.error(e); alert("Unable to load cargas. Check backend.");}
}
function viewCarga(id){ alert("Open carga details: "+id); }

/* ================= NEW CARGA ================= */
function openNewCargaModal(){
  const client = prompt("Client name:"); if(!client) return;
  const tipo = prompt("Cargo type:","Perishables");
  createCarga({cliente: client, tipo_carga: tipo});
}
async function createCarga(payload){
  try{
    const res = await fetch(`${BACKEND_URL}/cargas`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    const data = await res.json();
    alert("Carga created id: "+(data.id||'OK'));
    refreshCargas();
  } catch(e){console.error(e); alert("Error creating carga.");}
}

/* ================= DOCUMENTS ================= */
async function uploadDoc(){
  const input=document.getElementById('docFile'); if(!input.files.length){alert("Choose file"); return;}
  const fd = new FormData(); fd.append('file', input.files[0]);
  try{
    const res = await fetch(`${BACKEND_URL}/upload`,{method:'POST',body:fd});
    const j = await res.json();
    alert("File uploaded: "+(j.data?.filename||''));
  }catch(e){console.error(e);alert("Upload failed");}
}

/* ================= SIMULATION ================= */
async function runSimulation(){
  const tipo=document.getElementById('simTipo').value;
  const count=parseInt(document.getElementById('simCount').value||'0');
  try{
    const res = await fetch(`${BACKEND_URL}/simulacion/${encodeURIComponent(tipo)}/${count}`);
    const j = await res.json();
    alert(`Risk: ${j.riesgo_rechazo||j.risk||'N/A'}`);
  }catch(e){console.error(e); alert("Simulation failed");}
}

/* ================= ASSISTANT ================= */
async function askAssistant(){
  const q=document.getElementById('qInput').value.trim(); if(!q) return;
  const chat=document.getElementById('chat');
  chat.innerHTML+=`<div class="msg-user">You: ${q}</div>`; document.getElementById('qInput').value='';
  try{
    const res = await fetch(`${BACKEND_URL}/advisory`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({question:q})});
    const j = await res.json();
    chat.innerHTML+=`<div class="msg-aipa">AIPA: ${JSON.stringify(j.data||j).slice(0,800)}</div>`;
    chat.scrollTop = chat.scrollHeight;
  }catch(e){chat.innerHTML+=`<div class="msg-aipa"><i>Assistant unavailable.</i></div>`;}
}

/* ================= PAYMENTS ================= */
function generatePaymentButtons(){
  const subsContainer = document.getElementById('subscriptionButtons');
  const servContainer = document.getElementById('serviceButtons');

  // Suscripciones
  ELEGANT_SERVICE_TIERS.forEach(t=>{
    const btn = document.createElement('button');
    btn.className = BACKEND_MODE==="pay" ? "btn btn-primary" : "btn btn-outline-secondary";
    btn.innerText = `${t.name} — ${t.price}`;
    btn.onclick = ()=>startPayment(parseFloat(t.price.replace(/\$/,'')), t.name);
    subsContainer.appendChild(btn);
  });

  // Servicios individuales
  const services = [
    {name:"Upload & Verify Cargo", price:10},
    {name:"Advanced Simulation", price:15},
    {name:"Report PDF/Excel", price:12}
  ];
  services.forEach(s=>{
    const btn = document.createElement('button');
    btn.className = BACKEND_MODE==="pay" ? "btn btn-sm btn-outline-primary" : "btn btn-sm btn-outline-secondary";
    btn.innerText = `$${s.price} ${s.name}`;
    btn.onclick = ()=>startPayment(s.price, s.name);
    servContainer.appendChild(btn);
  });
}

async function startPayment(amount, desc){
  if(BACKEND_MODE==="free"){ alert(`Pago simulado: ${desc} — Gratis`); return; }
  const fd=new FormData(); fd.append('amount',parseInt(amount*100)); fd.append('description',desc);
  try{
    const res = await fetch(`${BACKEND_URL}/create-payment`,{method:'POST',body:fd});
    const j = await res.json();
    if(j.url) window.location.href=j.url; else alert(j.message||"Payment completed");
  }catch(e){console.error(e); alert("Payment error");}
}

/* ================= INIT ================= */
(function(){
  setLang('en'); 
  refreshCargas(); 
  generatePaymentButtons();
})();

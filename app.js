const BACKEND_URL = "<REPLACE_WITH_YOUR_SMARTCARGO-AIPA_URL>";

// Modo de pago detectado desde backend
let BACKEND_MODE = "free"; // por defecto
async function detectBackendMode(){
  try{
    const res = await fetch(`${BACKEND_URL}/mode`);
    const j = await res.json();
    BACKEND_MODE = j.mode || "free";
    renderPaymentButtons();
  }catch(e){
    console.error("No se pudo detectar modo backend:", e);
    renderPaymentButtons(); // usa default
  }
}

// Renderiza botones según modo free o pay
function renderPaymentButtons(){
  const subs = [
    {amount:29, desc:"Basic Monthly"},
    {amount:59, desc:"Premium Monthly"},
    {amount:295, desc:"Basic Annual"},
    {amount:595, desc:"Premium Annual"}
  ];
  const perService = [
    {amount:10, desc:"Upload & Verify Cargo"},
    {amount:15, desc:"Advanced Simulation"},
    {amount:12, desc:"Report PDF/Excel"}
  ];

  const subDiv = document.getElementById("subscriptionButtons");
  const svcDiv = document.getElementById("serviceButtons");
  subDiv.innerHTML = "";
  svcDiv.innerHTML = "";

  subs.forEach(p=>{
    const btn = document.createElement("button");
    btn.className = `btn ${BACKEND_MODE==="pay"?"btn-primary":"btn-outline-secondary"}`;
    btn.textContent = `${p.desc} — $${p.amount}`;
    btn.onclick = ()=>startPayment(p.amount,p.desc);
    subDiv.appendChild(btn);
  });

  perService.forEach(p=>{
    const btn = document.createElement("button");
    btn.className = `btn btn-sm ${BACKEND_MODE==="pay"?"btn-primary":"btn-outline-secondary"}`;
    btn.textContent = `$${p.amount} ${p.desc}`;
    btn.onclick = ()=>startPayment(p.amount,p.desc);
    svcDiv.appendChild(btn);
  });
}

// Llamada al backend para crear pago
async function startPayment(amount,desc){
  if(BACKEND_MODE==="free"){
    alert(`Simulación gratuita: ${desc}`);
    return;
  }
  try{
    const fd = new FormData();
    fd.append("amount", parseInt(amount*100));
    fd.append("description", desc);
    const res = await fetch(`${BACKEND_URL}/create-payment`,{method:"POST",body:fd});
    const j = await res.json();
    if(j.url) window.location.href = j.url;
    else alert("Error al iniciar pago");
  }catch(e){ console.error(e); alert("Error en pago"); }
}

// Init
detectBackendMode();

const BASE_URL = "https://smartcargo-aipa.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    // Verificación de Acceso
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "granted" || localStorage.getItem("sc_auth") === "true") {
        localStorage.setItem("sc_auth", "true");
        document.getElementById("mainApp").style.opacity = "1";
        document.getElementById("mainApp").style.pointer_events = "all";
    }

    // Auditoría Rápida
    document.getElementById("auditForm").onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/cargas`, { method: "POST", body: fd });
        const data = await res.json();
        const out = document.getElementById("auditResponse");
        out.innerHTML = "<h4>DIAGNÓSTICO:</h4>";
        data.forEach(item => {
            out.innerHTML += `<div class="risk-${item.lvl}"><strong>${item.msg}</strong><br>🛠️ SOLUCIÓN: ${item.sol}</div>`;
        });
    };

    // Asesor Virtual - Soluciones Rectificativas
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        out.innerHTML = "<h4>🔍 CONSULTANDO PROTOCOLOS TSA/IATA...</h4>";
        
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
        const data = await res.json();
        
        out.innerHTML = `<div id="report"><h2 style="color:#01579b;">REPORTE DE ASESORÍA TÉCNICA</h2>${data.data}</div>`;
        document.getElementById("actionBtns").style.display = "block";
    };
});

async function handlePayment() {
    const awb = document.getElementsByName("awb")[0].value;
    const amount = document.getElementById("priceSelect").value;
    const user = prompt("ADMIN USER (Opcional):");
    const pass = prompt("ADMIN PASS (Opcional):");

    const fd = new FormData();
    fd.append("awb", awb || "N/A");
    fd.append("amount", amount);
    if(user) fd.append("user", user);
    if(pass) fd.append("password", pass);

    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: fd });
    const data = await res.json();
    if(data.url) window.location.href = data.url;
}

document.getElementById("payBtn").onclick = handlePayment;

function downloadPDF() {
    const element = document.getElementById("report");
    html2pdf().from(element).save("SmartCargo_Reporte.pdf");
}

function shareWA() {
    const text = document.getElementById("report").innerText;
    window.open(`https://wa.me/?text=${encodeURIComponent("⭐ SOLUCIÓN SMARTCARGO:\n\n" + text)}`, '_blank');
}

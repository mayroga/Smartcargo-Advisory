const BASE_URL = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
    // Verificación de acceso por URL o Memoria
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "granted" || localStorage.getItem("sc_auth") === "true") {
        localStorage.setItem("sc_auth", "true");
        document.getElementById("mainApp").style.opacity = "1";
        document.getElementById("mainApp").style.pointerEvents = "all";
    }

    // Validador de Reglas Técnicas
    document.getElementById("auditForm").onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/cargas`, { method: "POST", body: fd });
        const data = await res.json();
        
        const out = document.getElementById("auditResponse");
        out.innerHTML = "<h4>📋 DIAGNÓSTICO DE CUMPLIMIENTO:</h4>";
        data.forEach(item => {
            out.innerHTML += `<div class="risk-${item.lvl}" style="padding:10px; margin:5px; border-radius:5px; border-left:5px solid;">
                                <strong>${item.msg}</strong><br>🛠️ SOLUCIÓN: ${item.sol}</div>`;
        });
    };

    // Asesor Virtual (Inspección Visual 3 Fotos)
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        out.innerHTML = "<p>🔍 ANALIZANDO BAJO ESTÁNDARES IATA/TSA...</p>";
        
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
        const data = await res.json();
        
        out.innerHTML = `<div id="report" style="background:white; color:black; padding:20px; border:1px solid #000;">
                            <h3>SOLUCIÓN TÉCNICA SMARTCARGO</h3>
                            <div style="white-space: pre-wrap;">${data.data}</div>
                         </div>`;
        document.getElementById("actionBtns").style.display = "block";
    };
});

// Función de Pago y Acceso Admin
async function handlePayment() {
    const awb = document.getElementsByName("awb")[0].value || "N/A";
    const amount = document.getElementById("priceSelect").value;
    const user = prompt("USUARIO ADMINISTRADOR:");
    const pass = prompt("CONTRASEÑA:");

    const fd = new FormData();
    fd.append("awb", awb);
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
    html2pdf().from(element).save("Reporte_SmartCargo.pdf");
}

function shareWA() {
    const text = document.getElementById("report").innerText;
    window.open(`https://wa.me/?text=${encodeURIComponent("⭐ ASESORÍA SMARTCARGO:\n\n" + text)}`, '_blank');
}

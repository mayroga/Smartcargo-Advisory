// Usar ruta relativa para evitar bloqueos de CORS en Render
const API_PATH = ""; 

function setLang(lang) {
    localStorage.setItem("user_lang", lang);
    const t = {
        en: { act: "1. Service Activation", sol: "2. Solution Center" },
        es: { act: "1. Activación de Servicio", sol: "2. Centro de Soluciones" }
    };
    const sel = t[lang] || t['en'];
    document.getElementById("t_act").innerText = sel.act;
    document.getElementById("t_sol").innerText = sel.sol;
}

document.addEventListener("DOMContentLoaded", () => {
    setLang(localStorage.getItem("user_lang") || "es");

    // Verificar si ya tiene acceso para desbloquear
    if (localStorage.getItem("smartcargo_auth") === "true") {
        unlockSystem();
    }

    // BOTÓN DE ACTIVACIÓN (ADMIN O STRIPE)
    document.getElementById("activateBtn").onclick = async () => {
        const awb = document.getElementById("awbField").value || "N/A";
        const price = document.getElementById("servicePrice").value;
        
        const user = prompt("ADMIN USER (Opcional):");
        const pass = prompt("ADMIN PASSWORD (Opcional):");

        const fd = new FormData();
        fd.append("awb", awb);
        fd.append("amount", price);
        if(user) fd.append("user", user);
        if(pass) fd.append("password", pass);

        try {
            const res = await fetch(`${API_PATH}/create-payment`, { method: "POST", body: fd });
            const data = await res.json();
            if(data.url) {
                window.location.href = data.url;
            } else {
                alert("Error en la respuesta del servidor.");
            }
        } catch (err) {
            alert("No se pudo conectar con el servidor. Revise su conexión.");
        }
    };

    // FORMULARIO DE ASESORÍA
    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        out.innerHTML = "<h3>🔍 Analizando múltiples soluciones...</h3>";
        
        const fd = new FormData(e.target);
        fd.append("lang", localStorage.getItem("user_lang") || "es");

        try {
            const res = await fetch(`${API_PATH}/advisory`, { method: "POST", body: fd });
            const data = await res.json();
            out.innerHTML = `<div id="finalReport"><h3>REPORTE TÉCNICO</h3>${data.data}</div>`;
            document.getElementById("actionBtns").style.display = "flex";
        } catch (err) {
            out.innerHTML = "<h3>⚠️ Error al generar soluciones.</h3>";
        }
    };

    // Detectar acceso desde la URL después del pago
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "granted") {
        localStorage.setItem("smartcargo_auth", "true");
        unlockSystem();
    }
});

function unlockSystem() {
    const main = document.getElementById("mainApp");
    main.style.opacity = "1";
    main.style.pointerEvents = "all";
    document.getElementById("accessSection").style.display = "none";
}

function downloadPDF() { html2pdf().from(document.getElementById("finalReport")).save("Reporte_SmartCargo.pdf"); }
function shareWA() { window.open(`https://wa.me/?text=${encodeURIComponent(document.getElementById("finalReport").innerText)}`, '_blank'); }

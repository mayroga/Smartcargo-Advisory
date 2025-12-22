const BASE_URL = "https://smartcargo-aipa.onrender.com";

// 1. Manejo de Pagos y Acceso Admin
async function handlePaymentClick() {
    const awbValue = document.getElementsByName("awb")[0]?.value || "Unknown";
    const amount = 65;
    const description = `SmartCargo Audit AWB: ${awbValue}`;

    const user = prompt("Admin User (Dejar en blanco para pagar con tarjeta):");
    let pass = null;
    if (user) pass = prompt("Admin Password:");

    try {
        const formData = new URLSearchParams();
        formData.append("amount", amount);
        formData.append("description", description);
        formData.append("awb", awbValue);

        if (user && pass) {
            formData.append("user", user);
            formData.append("password", pass);
        }

        const response = await fetch(`${BASE_URL}/create-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        const result = await response.json();
        if (result.url) {
            window.location.href = result.url;
            // Guardamos sesión temporal si es admin para habilitar el botón al volver
            if (user) localStorage.setItem("admin_active", "true");
        } else {
            alert("Error al procesar el pago");
        }
    } catch (err) { alert("Error de conexión con el servidor"); }
}

// 2. Validación de Carga con Semáforo de Colores
async function handleCargoValidation(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cargoData = Object.fromEntries(formData);
    
    const userEmail = prompt("¿A qué email enviamos el reporte de cumplimiento?");
    if (userEmail) cargoData.email = userEmail;

    try {
        const response = await fetch(`${BASE_URL}/cargas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cargoData)
        });
        const result = await response.json();
        
        const scoreDisplay = document.getElementById("alertaScoreDisplay");
        const score = result.alertaScore;

        // --- SISTEMA DE COLORES (SEMÁFORO) ---
        scoreDisplay.innerText = `${score}% RISK`;
        if (score < 30) {
            scoreDisplay.className = "mt-4 text-center text-3xl font-black text-green-600";
        } else if (score >= 30 && score < 70) {
            scoreDisplay.className = "mt-4 text-center text-3xl font-black text-amber-500";
        } else {
            scoreDisplay.className = "mt-4 text-center text-3xl font-black text-red-600 animate-pulse";
        }

        document.getElementById("alertsList").innerHTML = result.alerts.length === 0 ? 
            "<p class='text-green-600 font-bold'>✓ Compliance OK</p>" : 
            result.alerts.map(a => `<p>🛑 ${a}</p>`).join("");
        
        alert(userEmail ? "Auditoría completada. Reporte enviado." : "Auditoría completada.");
    } catch (err) { alert("Error en la validación"); }
}

// 3. Asesoría IA con Soporte de Visión (Fotos)
async function handleAdvisory(e) {
    e.preventDefault();
    const promptValue = document.getElementById("advisoryPrompt").value;
    const photoFile = document.getElementById("cargoPhoto")?.files[0];
    const output = document.getElementById("advisory_response");

    if (!promptValue && !photoFile) return;

    output.innerText = "Consultando asesor bilingüe y analizando imagen...";
    
    // Usamos FormData para enviar texto e imagen simultáneamente
    const formData = new FormData();
    formData.append("prompt", promptValue || "Analiza esta imagen de carga para seguridad aérea.");
    if (photoFile) {
        formData.append("image", photoFile);
    }

    try {
        const response = await fetch(`${BASE_URL}/advisory`, {
            method: "POST",
            body: formData // FETCH detecta automáticamente que es multipart/form-data
        });
        const result = await response.json();
        output.innerText = result.data;
    } catch (err) { 
        output.innerText = "Error: El asesor no está disponible en este momento."; 
    }
}

// 4. Inicialización y Control de Acceso
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("paymentButton")?.addEventListener("click", handlePaymentClick);
    document.getElementById("cargoValidationForm")?.addEventListener("submit", handleCargoValidation);
    document.getElementById("advisoryForm")?.addEventListener("submit", handleAdvisory);

    // Habilitar el botón de validación si regresamos de un pago exitoso o somos admin
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("access") === "granted" || localStorage.getItem("admin_active")) {
        const validateBtn = document.getElementById("validateBtn");
        if (validateBtn) {
            validateBtn.disabled = false;
            validateBtn.classList.remove("opacity-50");
            validateBtn.classList.add("hover:bg-blue-700", "cursor-pointer");
        }
    }
});

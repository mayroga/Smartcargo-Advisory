const BASE_URL = "https://smartcargo-aipa.onrender.com";

async function handlePaymentClick() {
    const awbValue = document.getElementsByName("awb")[0]?.value || "Unknown";
    const amount = 65;
    const description = `SmartCargo Audit AWB: ${awbValue}`;

    const user = prompt("Admin User (Leave blank to pay):");
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
        if (result.url) window.location.href = result.url;
        else alert("Payment error");
    } catch (err) { alert("Server connection failed"); }
}

async function handleCargoValidation(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cargoData = Object.fromEntries(formData);
    
    // Opcional: Pedir email para el reporte
    const userEmail = prompt("¿A qué email enviamos el reporte de cumplimiento?");
    if (userEmail) cargoData.email = userEmail;

    try {
        const response = await fetch(`${BASE_URL}/cargas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cargoData)
        });
        const result = await response.json();
        
        // Mostrar resultados en pantalla
        document.getElementById("alertaScoreDisplay").innerText = `${result.alertaScore}% RISK`;
        alert(userEmail ? "Auditoría completada. Reporte enviado a su correo." : "Auditoría completada.");
        
    } catch (err) { alert("Error en la validación"); }
}

    try {
        const response = await fetch(`${BASE_URL}/cargas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cargoData)
        });
        const result = await response.json();
        document.getElementById("alertaScoreDisplay").innerText = `${result.alertaScore}% RISK`;
        document.getElementById("alertsList").innerHTML = result.alerts.length === 0 ? 
            "<p>Compliance OK</p>" : result.alerts.map(a => `<p>🛑 ${a}</p>`).join("");
    } catch (err) { alert("Validation failed"); }
}

async function handleAdvisory(e) {
    e.preventDefault();
    const promptValue = document.getElementById("advisoryPrompt").value;
    const output = document.getElementById("advisory_response");
    if (!promptValue) return;

    output.innerText = "Consulting advisor...";
    try {
        const response = await fetch(`${BASE_URL}/advisory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: promptValue })
        });
        const result = await response.json();
        output.innerText = result.data;
    } catch (err) { output.innerText = "Advisor error"; }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("paymentButton")?.addEventListener("click", handlePaymentClick);
    document.getElementById("cargoValidationForm")?.addEventListener("submit", handleCargoValidation);
    document.getElementById("advisoryForm")?.addEventListener("submit", handleAdvisory);
});

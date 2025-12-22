// =====================================================
// SMARTCARGO AIPA - FRONTEND
// =====================================================

const BASE_URL = "https://smartcargo-aipa.onrender.com";
let LANG = "en";

// =====================================================
// PAGO STRIPE + BYPASS ADMIN
// =====================================================
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
        formData.append("awb", awbValue); // <--- Enviamos el AWB

        if (user && pass) {
            formData.append("user", user);
            formData.append("password", pass);
        }
        // ... resto del fetch igual

        const response = await fetch(`${BASE_URL}/create-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        const result = await response.json();

        if (result.url) {
            window.location.href = result.url;
        } else {
            alert("Payment error");
        }
    } catch (err) {
        console.error(err);
        alert("Server connection failed");
    }
}

// =====================================================
// VALIDACIÓN DE CARGA
// =====================================================
async function handleCargoValidation(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const cargoData = {};

    formData.forEach((value, key) => {
        cargoData[key] = isNaN(value) ? value : Number(value);
    });

    try {
        const response = await fetch(`${BASE_URL}/cargas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cargoData)
        });

        const result = await response.json();

        document.getElementById("alertaScoreDisplay").innerText =
            `${result.alertaScore}% RISK`;

        document.getElementById("alertsList").innerHTML =
            result.alerts.length === 0
                ? "<p>Compliance OK</p>"
                : result.alerts.map(a => `<p>${a}</p>`).join("");

    } catch (err) {
        console.error(err);
        alert("Validation failed");
    }
}

// =====================================================
// ASESOR IA
// =====================================================
async function handleAdvisory(e) {
    e.preventDefault();

    const prompt = document.getElementById("advisoryPrompt").value;
    const output = document.getElementById("advisory_response");

    if (!prompt) return;

    output.innerText = "Consulting advisor...";

    try {
        const response = await fetch(`${BASE_URL}/advisory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const result = await response.json();
        output.innerText = result.data;

    } catch (err) {
        console.error(err);
        output.innerText = "Advisor error";
    }
}

// =====================================================
// LISTENERS
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    const payBtn = document.getElementById("paymentButton");
    const cargoForm = document.getElementById("cargoValidationForm");
    const advisoryForm = document.getElementById("advisoryForm");

    if (payBtn) payBtn.addEventListener("click", handlePaymentClick);
    if (cargoForm) cargoForm.addEventListener("submit", handleCargoValidation);
    if (advisoryForm) advisoryForm.addEventListener("submit", handleAdvisory);
});

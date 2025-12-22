const BASE_URL = "https://smartcargo-aipa.onrender.com";
let qCount = 0;

async function checkConfig() {
    try {
        const res = await fetch(`${BASE_URL}/config`);
        const config = await res.json();
        if (config.free_mode) {
            console.log("Modo Free Activo");
            document.getElementById("payBtn").innerText = "ACCESO GRATUITO ACTIVO";
        }
    } catch (e) { console.log("Backend offline"); }
}

async function handlePayment() {
    const awb = document.getElementsByName("awb")[0].value || "000";
    const user = prompt("ADMIN USER (Opcional):");
    let pass = null;
    if (user) pass = prompt("ADMIN PASS:");

    const formData = new URLSearchParams({ amount: 65, awb: awb });
    if (user) { formData.append('user', user); formData.append('password', pass); }

    const res = await fetch(`${BASE_URL}/create-payment`, { method: 'POST', body: formData });
    const result = await res.json();
    
    if (result.url) {
        // Guardamos acceso si es modo free o admin
        if (result.url.includes("access=granted")) {
            localStorage.setItem("auth_aipa", "true");
        }
        window.location.href = result.url;
    }
}

// ... (Aquí va el resto de la lógica de Auditoría y Asesor IA que ya tienes) ...

document.addEventListener("DOMContentLoaded", () => {
    checkConfig(); // Revisar si es gratis al cargar
    
    const isAuth = window.location.search.includes("access=granted") || localStorage.getItem("auth_aipa") === "true";
    if (isAuth) {
        localStorage.setItem("auth_aipa", "true");
        const btn = document.getElementById("valBtn");
        btn.disabled = false;
        btn.classList.remove("opacity-50", "btn-disabled");
    }
    
    document.getElementById("payBtn").onclick = handlePayment;
});

// =====================================================
// Configuración inicial
// =====================================================
const BACKEND_URL = "https://smartcargo-aipa.onrender.com";

// Elementos del DOM
const cargasTable = document.getElementById("cargasTableBody");
const alertasTable = document.getElementById("alertasTableBody");
const uploadForm = document.getElementById("uploadForm");
const advisoryForm = document.getElementById("advisoryForm");
const advisoryQuestion = document.getElementById("advisoryQuestion");
const advisoryResponse = document.getElementById("advisoryResponse");
const paymentForm = document.getElementById("paymentForm");

// =====================================================
// FUNCIONES DE CARGAS
// =====================================================
async function fetchCargas() {
    try {
        const res = await fetch(`${BACKEND_URL}/cargas`);
        const data = await res.json();
        cargasTable.innerHTML = "";
        data.cargas.forEach(carga => {
            const row = `<tr>
                <td>${carga.id}</td>
                <td>${carga.cliente}</td>
                <td>${carga.tipo_carga}</td>
                <td>${carga.estado}</td>
                <td>${carga.alertas}</td>
            </tr>`;
            cargasTable.innerHTML += row;
        });
    } catch (err) {
        console.error("Error cargando cargas:", err);
    }
}

// =====================================================
// FUNCIONES DE ALERTAS
// =====================================================
async function fetchAlertas() {
    try {
        const res = await fetch(`${BACKEND_URL}/alertas`);
        const data = await res.json();
        alertasTable.innerHTML = "";
        data.alertas.forEach(alerta => {
            const row = `<tr>
                <td>${alerta.id}</td>
                <td>${alerta.tipo_carga}</td>
                <td>${alerta.nivel}</td>
                <td>${alerta.mensaje}</td>
                <td>${alerta.fecha}</td>
            </tr>`;
            alertasTable.innerHTML += row;
        });
    } catch (err) {
        console.error("Error cargando alertas:", err);
    }
}

// =====================================================
// FUNCIONES DE SUBIDA DE DOCUMENTOS / FOTOS
// =====================================================
uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (!file) return alert("Selecciona un archivo primero.");

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${BACKEND_URL}/upload`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        alert("Archivo subido: " + data.data.filename);
        fileInput.value = "";
    } catch (err) {
        console.error("Error subiendo archivo:", err);
    }
});

// =====================================================
// FUNCIONES DE ADVISORY (GEMINI_API_KEY)
// =====================================================
advisoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = advisoryQuestion.value.trim();
    if (!question) return alert("Escribe tu consulta primero.");

    const formData = new FormData();
    formData.append("question", question);

    try {
        const res = await fetch(`${BACKEND_URL}/advisory`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.error) {
            advisoryResponse.innerText = "Error: " + data.error;
        } else {
            advisoryResponse.innerText = data.data;
        }
    } catch (err) {
        console.error("Error en advisory:", err);
        advisoryResponse.innerText = "Error conectando con el backend.";
    }
});

// =====================================================
// FUNCIONES DE PAGOS SIMULADOS
// =====================================================
paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = document.getElementById("paymentAmount").value;
    const description = document.getElementById("paymentDesc").value;
    if (!amount || !description) return alert("Completa todos los campos.");

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("description", description);

    try {
        const res = await fetch(`${BACKEND_URL}/create-payment`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        window.open(data.url, "_blank");
    } catch (err) {
        console.error("Error creando pago:", err);
        alert("Error creando el pago.");
    }
});

// =====================================================
// INICIALIZACIÓN
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    fetchCargas();
    fetchAlertas();
});

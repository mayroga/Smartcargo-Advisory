const BASE_URL = window.location.origin;

const translations = {
    en: { title: "SmartCargo Advisor", t1: "1. Activation", t2: "2. Solution Center", p1: "Describe issue or upload 3 photos." },
    es: { title: "Asesor SmartCargo", t1: "1. Activación", t2: "2. Centro de Soluciones", p1: "Describa el problema o suba 3 fotos." },
    fr: { title: "Conseiller SmartCargo", t1: "1. Activation", t2: "2. Centre de Solutions", p1: "Décrivez le problème ou téléchargez 3 photos." },
    pt: { title: "Consultor SmartCargo", t1: "1. Ativação", t2: "2. Centro de Soluções", p1: "Descreva o problema ou envie 3 fotos." },
    zh: { title: "SmartCargo 顾问", t1: "1. 激活", t2: "2. 解决方案中心", p1: "描述问题或上传 3 张照片。" }
};

function setLang(lang) {
    localStorage.setItem("lang", lang);
    const t = translations[lang];
    document.getElementById("title").innerText = t.title;
    document.getElementById("t1").innerText = t.t1;
    document.getElementById("t2").innerText = t.t2;
    document.getElementById("p1").innerText = t.p1;
}

document.addEventListener("DOMContentLoaded", () => {
    // Configurar idioma inicial
    setLang(localStorage.getItem("lang") || "en");

    // DESBLOQUEO DEL SISTEMA
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "granted" || localStorage.getItem("sc_auth") === "true") {
        localStorage.setItem("sc_auth", "true");
        document.getElementById("mainApp").style.opacity = "1";
        document.getElementById("mainApp").style.pointerEvents = "all";
        document.getElementById("access").style.display = "none";
    }

    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        out.innerHTML = "<h4>🔍 Analyzing technical options...</h4>";
        
        const fd = new FormData(e.target);
        fd.append("lang", localStorage.getItem("lang") || "en");

        try {
            const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
            const data = await res.json();
            out.innerHTML = `<div id="report"><h3>REPORT</h3>${data.data}</div>`;
            document.getElementById("actionBtns").style.display = "block";
        } catch (err) {
            out.innerHTML = "<h4>Error connecting to Advisor.</h4>";
        }
    };
});

document.getElementById("payBtn").onclick = async () => {
    const awb = document.getElementById("awbInput").value || "N/A";
    const user = prompt("ADMIN USER (Optional):");
    const pass = prompt("ADMIN PASS (Optional):");
    
    const fd = new FormData();
    fd.append("awb", awb);
    fd.append("amount", "35");
    if(user) fd.append("user", user);
    if(pass) fd.append("password", pass);

    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: fd });
    const data = await res.json();
    if(data.url) window.location.href = data.url;
};

function downloadPDF() { html2pdf().from(document.getElementById("report")).save("SmartCargo_Report.pdf"); }
function shareWA() { window.open(`https://wa.me/?text=${encodeURIComponent(document.getElementById("report").innerText)}`, '_blank'); }

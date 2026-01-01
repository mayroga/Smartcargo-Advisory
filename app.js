const BASE_URL = window.location.origin;

// Diccionario Simple para Traducción de Interfaz
const translations = {
    en: { t1: "1. Service Activation", t2: "2. Quick Compliance Check", t3: "3. Solution Center", b1: "CHECK LEGAL RULES", b2: "GENERATE ACTION PLAN", l1: "ISPM-15 Wood Stamp?", l2: "Dangerous Goods (DG)?", p1: "Describe the issue or upload up to 3 photos.", b3: "📄 SAVE PDF", b4: "📱 SEND TO WHATSAPP" },
    es: { t1: "1. Activación de Servicio", t2: "2. Verificación Técnica", t3: "3. Centro de Soluciones", b1: "VALIDAR REGLAS", b2: "GENERAR PLAN DE ACCIÓN", l1: "¿Sello Madera ISPM-15?", l2: "¿Carga Peligrosa (DG)?", p1: "Describa el problema o suba hasta 3 fotos.", b3: "📄 GUARDAR PDF", b4: "📱 ENVIAR A WHATSAPP" },
    fr: { t1: "1. Activation du Service", t2: "2. Contrôle Technique", t3: "3. Centre de Solutions", b1: "VÉRIFIER LES RÈGLES", b2: "GÉNÉRER LE PLAN D'ACTION", l1: "Timbre Bois NIMP-15?", l2: "Marchandises Dangereuses?", p1: "Décrivez le problème ou téléchargez 3 photos.", b3: "📄 ENREGISTRER PDF", b4: "📱 ENVOYER WHATSAPP" },
    pt: { t1: "1. Ativação do Serviço", t2: "2. Verificação Técnica", t3: "3. Centro de Soluções", b1: "VERIFICAR REGRAS", b2: "GERAR PLANO DE AÇÃO", l1: "Selo Madeira ISPM-15?", l2: "Carga Perigosa (DG)?", p1: "Descreva o problema ou envie 3 fotos.", b3: "📄 SALVAR PDF", b4: "📱 ENVIAR WHATSAPP" },
    zh: { t1: "1. 服务激活", t2: "2. 快速合规检查", t3: "3. 解决方案中心", b1: "检查法律规则", b2: "生成行动计划", l1: "ISPM-15 木材印章？", l2: "危险品 (DG)？", p1: "描述问题或上传最多 3 张照片。", b3: "📄 保存 PDF", b4: "📱 发送到 WHATSAPP" }
};

function changeLanguage() {
    const lang = document.getElementById("langSelect").value;
    const t = translations[lang];
    for (let key in t) {
        const el = document.getElementById(key);
        if (el) el.innerText = t[key];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "granted" || localStorage.getItem("sc_auth") === "true") {
        localStorage.setItem("sc_auth", "true");
        document.getElementById("mainApp").style.opacity = "1";
        document.getElementById("mainApp").style.pointerEvents = "all";
    }

    document.getElementById("auditForm").onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = await fetch(`${BASE_URL}/cargas`, { method: "POST", body: fd });
        const data = await res.json();
        const out = document.getElementById("auditResponse");
        out.innerHTML = "<h4>RESULTS:</h4>";
        data.forEach(item => {
            out.innerHTML += `<div class="risk-high"><strong>${item.msg}</strong><br>${item.sol}</div>`;
        });
    };

    document.getElementById("advForm").onsubmit = async (e) => {
        e.preventDefault();
        const out = document.getElementById("advResponse");
        const lang = document.getElementById("langSelect").value;
        out.innerHTML = "<h4>🔍 ANALYZING OPTIONS...</h4>";
        
        const fd = new FormData(e.target);
        fd.append("lang", lang); // Enviamos el idioma al Asesor
        const res = await fetch(`${BASE_URL}/advisory`, { method: "POST", body: fd });
        const data = await res.json();
        
        out.innerHTML = `<div id="report"><h2 style="color:#01579b;">TECHNICAL ADVISORY REPORT</h2><div style="white-space: pre-wrap;">${data.data}</div></div>`;
        document.getElementById("actionBtns").style.display = "block";
    };
});

async function handlePayment() {
    const awb = document.getElementById("awbInput").value || "N/A";
    const amount = document.getElementById("priceSelect").value;
    const user = prompt("ADMIN USER:");
    const pass = prompt("ADMIN PASS:");
    const fd = new FormData();
    fd.append("awb", awb); fd.append("amount", amount);
    if(user) fd.append("user", user); if(pass) fd.append("password", pass);
    const res = await fetch(`${BASE_URL}/create-payment`, { method: "POST", body: fd });
    const data = await res.json();
    if(data.url) window.location.href = data.url;
}
document.getElementById("payBtn").onclick = handlePayment;

function downloadPDF() { html2pdf().from(document.getElementById("report")).save("SmartCargo_Report.pdf"); }
function shareWA() { window.open(`https://wa.me/?text=${encodeURIComponent(document.getElementById("report").innerText)}`, '_blank'); }

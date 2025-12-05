// ... (código previo)

// ================================= ALERTAS Y SIMULACIÓN (PALPABLE) =================================
async function refreshAlertas() {
    try {
        const res = await fetch(`${BACKEND_URL}/alertas`);
        const data = await res.json();
        const tbody = document.querySelector('#alertasTableBody');
        tbody.innerHTML = '';
        
        // 1. Cargar alertas
        (Array.isArray(data.alertas) ? data.alertas : []).forEach(a => {
            const tr = document.createElement('tr');
            let colorClass = '';
            let emoji = '✅';
            if (a.nivel === 'CRITICAL') { colorClass = 'alert-critical'; emoji = '❌'; }
            else if (a.nivel === 'WARNING') { colorClass = 'alert-warning'; emoji = '⚠️'; }
            else { colorClass = 'alert-info'; emoji = '💡'; }

            tr.innerHTML = `
                <td onclick="viewCarga('${a.carga_id}')">${a.carga_id.substring(0, 8)}...</td>
                <td class="${colorClass}">${a.nivel} ${emoji}</td>
                <td>${a.mensaje}</td>
                <td>${new Date(a.fecha).toLocaleDateString()}</td>`;
            tbody.appendChild(tr);
        });

        // 2. Ejecutar Simulación de Riesgo General y Ahorros
        const simRes = await fetch(`${BACKEND_URL}/simulacion/GENERAL/${data.alertas.length}`); 
        const simData = await simRes.json();
        const scoreDiv = document.getElementById('alertaScore');
        const t = LANGS[LANG];
        
        const riskValue = parseInt(simData.riesgo_rechazo.replace('%', ''));
        
        // CÁLCULO Y VISUALIZACIÓN DE AHORROS
        const totalTimeSaved = data.summary?.total_time_saved || 0;
        const totalCostSaved = data.summary?.total_cost_saved || 0;
        
        // FEEDBACK VISUAL MEJORADO
        let scoreColor = '#d4edda'; // Bajo Riesgo (Verde)
        let scoreIcon = '👍';
        if (riskValue >= 70) {
            scoreColor = '#f8d7da'; // CRÍTICO (Rojo claro)
            scoreIcon = '🚨';
        } else if (riskValue >= 40) {
            scoreColor = '#fff3cd'; // ALTO RIESGO (Amarillo claro)
            scoreIcon = '🔔';
        }

        scoreDiv.style.backgroundColor = scoreColor;
        scoreDiv.style.color = 'black'; 
        scoreDiv.style.border = `1px solid ${riskValue >= 70 ? '#f5c6cb' : riskValue >= 40 ? '#ffeeba' : '#c3e6cb'}`;
        
        // Incorporamos el ahorro de Tiempo y Dinero
        scoreDiv.innerHTML = `
            ${scoreIcon} ${t.riesgo}: <strong>${simData.riesgo_rechazo}</strong> 
            <p style="margin-top: 5px; font-weight: normal;">Sugerencia AIPA: <em>${simData.sugerencia}</em></p>
            <hr style="margin: 5px 0; border-top: 1px solid #ccc;">
            <p style="font-weight: bold; color: #007bff;">
                💰 Ahorro Proactivo: $${totalCostSaved.toLocaleString()} USD | ⏱️ Tiempo Ganado: ${totalTimeSaved} Hrs
            </p>`;

    } catch (e) { console.error("Error loading alertas:", e); }
}

// ... (resto del código sin cambios)

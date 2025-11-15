// services/calculationService.js
// Modulo de lógica para calcular pesos y volumenes

/**
 * Calcula el Peso Volumétrico y el Peso Cobrable basado en las dimensiones y peso.
 * * @param {object} data - Datos de la medición.
 * @param {number} data.largo - Largo total de la carga.
 * @param {number} data.ancho - Ancho total de la carga.
 * @param {number} data.alto - Alto total de la carga.
 * @param {number} data.peso - Peso real total de la carga.
 * @param {number} data.cantidad - Cantidad de cajas.
 * @param {string} data.unidad - Unidad de medida ('cm' o 'in').
 * @param {string} data.pesoUnidad - Unidad de peso ('kg' o 'lb').
 * @returns {object} Resultado del cálculo incluyendo pesos y recomendaciones.
 */
export const calculateCharge = (data) => {
    const { largo, ancho, alto, peso, cantidad, unidad, pesoUnidad } = data;

    // Convertir a numeros y asegurar que no haya valores nulos o cero
    const L = parseFloat(largo) || 0;
    const W = parseFloat(ancho) || 0;
    const H = parseFloat(alto) || 0;
    const P = parseFloat(peso) || 0;
    const Q = parseInt(cantidad) || 1; // Asumir al menos 1 caja si no se especifica

    // 1. Calcular Volumen Total
    const volumenTotal = L * W * H * Q;

    // 2. Determinar Divisor y Unidad de Densidad
    let divisor = 6000; // IATA standard: cm a kg (dividir por 6000)
    let volumenUnidad = 'm³';
    let pesoVolumetrico;

    if (unidad === 'in' && pesoUnidad === 'lb') {
        divisor = 166; // IATA standard: in a lb (dividir por 166)
        volumenUnidad = 'ft³';
        pesoVolumetrico = volumenTotal / divisor;
    } else if (unidad === 'cm' && pesoUnidad === 'kg') {
        divisor = 6000;
        volumenUnidad = 'cm³'; // Se usa cm³ internamente, pero el resultado es en kg/6000
        pesoVolumetrico = volumenTotal / divisor;
    } else {
        // En un sistema real, se añadirían conversiones complejas si las unidades no coinciden.
        // Por simplicidad, asumimos pares comunes (cm/kg o in/lb). Usamos cm/kg como default.
        pesoVolumetrico = volumenTotal / divisor;
    }

    // Redondear el peso volumétrico a dos decimales para el cobro
    const pesoVolumetricoRedondeado = parseFloat(pesoVolumetrico.toFixed(2));

    // 3. Determinar Peso Cobrable (Chargeable Weight)
    // La aerolínea cobra por el MAYOR entre el Peso Real (P) y el Peso Volumétrico.
    const pesoCobro = Math.max(P, pesoVolumetricoRedondeado);
    
    // 4. Generar Sugerencias Educativas (Sección 1, 7)
    const delta = pesoCobro - P;
    let recomendacion = "¡Excelente! Tu carga está muy bien presentada. El peso real y el volumétrico son similares. Estás optimizando tu envío.";
    let etiquetaVolumen = "Peso Real (Bruto)";

    if (delta > 0.05) { // Si el peso volumétrico es significativamente mayor
        etiquetaVolumen = "Peso Volumétrico";
        const porcentajeAhorro = ((delta / pesoCobro) * 100).toFixed(1);
        recomendacion = `**Aviso Educativo (Cuidado con el HOLD):** La aerolínea te cobrará por el **Peso Volumétrico** (${pesoCobro.toFixed(2)} ${pesoUnidad}). Esto es ${delta.toFixed(2)} ${pesoUnidad} más que tu peso real. ¡Podrías ahorrar hasta un ${porcentajeAhorro}% si reduces el volumen!`;
    } else if (P > pesoVolumetricoRedondeado * 1.05) { // Si el peso real es significativamente mayor
        recomendacion = "Tu carga es densa (mucho peso en poco volumen). Estás aprovechando bien el espacio de las cajas. ¡No hay problemas de volumen!";
    }

    return {
        pesoReal: P,
        pesoVolumetrico: pesoVolumetricoRedondeado,
        pesoCobro: parseFloat(pesoCobro.toFixed(2)),
        unidadPesoCobro: pesoUnidad,
        cobroPor: etiquetaVolumen,
        recomendacionAhorro: recomendacion,
    };
};

// ==============================================================================
// SMARTCARGO-ADVISORY FRONTEND - DATOS FIJOS DE PRECIOS Y SERVICIOS
// Presentación en la UI.
// ==============================================================================

// --- NIVELES DE SERVICIO Y PRECIOS ELEGANTES ---
export const ELEGANT_SERVICE_TIERS = [
    {
        level: "Básico",
        name: "Revisión Esencial",
        price: "$35",
        features: [
            "Validación AWB y Carga Real",
            "Análisis Básico de Embalaje (Peso/Volumen)",
            "Verificación de Etiquetas Obligatorias",
            "Confirmación Pallets y Certificación ISPM-15",
            "PDF con Diagnóstico Simple"
        ],
        perceived_value: "Refleja responsabilidad y prevención."
    },
    {
        level: "Profesional",
        name: "Optimización Completa",
        price: "$65",
        features: [
            "Todo Básico Incluido",
            "Validación Fotográfica con IA",
            "Detección de Inconsistencias AWB/Fotos",
            "Sugerencias de Optimización para Ahorro",
            "Identificación de Riesgos DG Informativa",
            "PDF Detallado Listo para Courier"
        ],
        perceived_value: "Precio justo por la protección y reducción de riesgos."
    },
    {
        level: "Premium",
        name: "Asesoría Integral",
        price: "$120",
        features: [
            "Todo Profesional Incluido",
            "Evaluación de Temperatura y Sensibilidad",
            "Alertas de Riesgos DG y Legales (Informativo)",
            "Sugerencias Avanzadas de Materiales Certificados",
            "Asesoría Completa Documentos y AWB",
            "Reporte PDF Avanzado (Riesgos, Sugerencias y Legales)"
        ],
        perceived_value: "Refleja servicio VIP, prevención total y asesoría integral."
    }
];

// --- EXTRAS OPCIONALES Y SU PERCEPCIÓN ---
export const OPTIONAL_ADDONS_DISPLAY = [
    { name: "Revisión Avanzada DG (Informativa)", price: "$25" },
    { name: "Optimización Múltiple de Pallets o Cajas", price: "$30" },
    { name: "Alertas Personalizadas de Carga de Riesgo", price: "$15" }
];

// --- MENSAJE LEGAL ADICIONAL FIJO ---
export const PRICE_LEGAL_DISCLAIMER = (
    "SmartCargo ofrece asesoría informativa. No se responsabiliza por información falsa o incompleta subida por el usuario."
);

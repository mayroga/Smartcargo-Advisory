// ==============================================================================
// SMARTCARGO-ADVISORY — CONSTANTES OFICIALES (VERSIÓN FINAL)
// ESTE ES EL ÚNICO ARCHIVO QUE NECESITA EL FRONTEND
// ==============================================================================

// ------------------------------------------------------------------------------
// CAMPOS OBLIGATORIOS DEL AWB (WAYBILL)
// ------------------------------------------------------------------------------
export const AWB_MANDATORY_FIELDS = [
    { key: "SHIPPER", description: "Dueño real de la mercancía (responsable legal)" },
    { key: "CONSIGNEE", description: "Destinatario final" },
    { key: "ADDRESS", description: "Dirección completa (no PO Boxes)" },
    { key: "INTERNATIONAL_PHONE", description: "Número telefónico internacional válido" },
    { key: "WEIGHT_REAL_VOLUMETRIC", description: "Peso real vs peso volumétrico" },
    { key: "DIMENSIONS_EXACT", description: "Dimensiones exactas" },
    { key: "COMMODITY_TYPE", description: "Tipo específico de mercancía" },
    { key: "AIRPORT_CODE", description: "Código IATA del aeropuerto" },
    { key: "PERMITTED_STATUS", description: "Si está permitido transportarlo" }
];

// ------------------------------------------------------------------------------
// NORMATIVA INTERNACIONAL ISPM-15 PARA PALLETS DE MADERA
// ------------------------------------------------------------------------------
export const ISPM_15_STANDARD = {
    NORMA: "ISPM-15 (Norma Internacional de Medidas Fitosanitarias)",
    SELLOS_OBLIGATORIOS: [
        "HT - Heat Treated (tratamiento térmico)",
        "Fumigación certificada",
        "Timbre internacional visible"
    ]
};

// ------------------------------------------------------------------------------
// VALIDACIONES OBLIGATORIAS DE AVIACIÓN
// ------------------------------------------------------------------------------
export const MANDATORY_VALIDATION_POINTS = [
    "Etiquetas IATA",
    "Etiquetas de orientación",
    "Etiquetas de temperatura",
    "Documentación correcta",
    "Embalaje firme",
    "Cajas en buen estado",
    "No mezclar mercancías incompatibles",
    "No usar cinta negra",
    "Carga seca (sin humedad visible)",
    "Pallets certificados ISPM-15",
    "Sello de fumigación visible (si aplica)",
    "Declarar Dry Ice (si aplica)"
];

// ------------------------------------------------------------------------------
// ETIQUETAS UNIVERSALES UTILIZADAS EN CARGA AÉREA INTERNACIONAL
// ------------------------------------------------------------------------------
export const UNIVERSAL_LABELS = [
    "THIS SIDE UP",
    "FRAGILE",
    "PERISHABLE",
    "TEMPERATURE CONTROL",
    "DRY ICE",
    "LIVE ANIMALS",
    "BATTERIES",
    "CARGO AIRCRAFT ONLY",
    "ORIENTACIÓN",
    "ADVERTENCIA"
];

// ------------------------------------------------------------------------------
// MENSAJES LEGALES (OBLIGATORIOS PARA EVITAR DEMANDAS)
// ------------------------------------------------------------------------------
export const CORE_LEGAL_DISCLAIMER =
    "SmartCargo ofrece asesoría informativa. No es un servicio certificado IATA/TSA/FAA/DOT. No clasifica mercancía peligrosa. Para DG consulte un especialista certificado o la aerolínea.";

export const PRICE_LEGAL_DISCLAIMER =
    "SmartCargo no se responsabiliza por información falsa o incompleta proporcionada por el usuario.";

// ------------------------------------------------------------------------------
// PLANES, PRECIOS Y BENEFICIOS (INTERFAZ DEL FRONTEND)
// ------------------------------------------------------------------------------
export const ELEGANT_SERVICE_TIERS = [
    {
        level: "Básico",
        name: "Revisión Esencial",
        price: "$35",
        features: [
            "Validación AWB",
            "Análisis básico de embalaje",
            "Verificación de etiquetas IATA",
            "Confirmación de ISPM-15",
            "PDF diagnóstico simple"
        ]
    },
    {
        level: "Profesional",
        name: "Optimización Completa",
        price: "$65",
        features: [
            "Todo el plan Básico",
            "Validación fotográfica con IA",
            "Detección de inconsistencias AWB vs fotos",
            "Optimización de pallets",
            "PDF avanzado"
        ]
    },
    {
        level: "Premium",
        name: "Asesoría Integral",
        price: "$120",
        features: [
            "Todo el plan Profesional",
            "Evaluación de temperatura",
            "Alertas informativas DG",
            "Sugerencias avanzadas de materiales",
            "Reporte avanzado completo (PDF)"
        ]
    }
];

// ------------------------------------------------------------------------------
// ADDONS OPCIONALES (SERVICIOS EXTRA)
// ------------------------------------------------------------------------------
export const OPTIONAL_ADDONS_DISPLAY = [
    { name: "Revisión Avanzada DG (informativa)", price: "$25" },
    { name: "Optimización múltiple de pallets o cajas", price: "$30" },
    { name: "Alertas personalizadas para carga de riesgo", price: "$15" }
];

// ==============================================================================
// FIN DEL ARCHIVO - SMARTCARGO-ADVISORY (VERSIÓN FINAL)
// ==============================================================================


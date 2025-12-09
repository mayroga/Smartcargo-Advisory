// ==============================================================================
// SMARTCARGO-ADVISORY — CONSTANTES OFICIALES (VERSIÓN FINAL)
// ESTE ES EL ÚNICO ARCHIVO QUE NECESITA EL FRONTEND
// ==============================================================================

// ------------------------------------------------------------------------------
// CONSTANTES DE SERVICIO (USADAS PARA PRECIOS Y DESCRIPCIONES)
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

export const ISPM_15_STANDARD = {
    NORMA: "ISPM-15 (Norma Internacional de Medidas Fitosanitarias)",
    SELLOS_OBLIGATORIOS: [
        "HT - Heat Treated (tratamiento térmico)",
        "Fumigación certificada",
        "Timbre internacional visible"
    ]
};

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

export const CORE_LEGAL_DISCLAIMER =
    "SmartCargo ofrece asesoría informativa. No es un servicio certificado IATA/TSA/FAA/DOT. No clasifica mercancía peligrosa. Para DG consulte un especialista certificado o la aerolínea.";

export const PRICE_LEGAL_DISCLAIMER =
    "SmartCargo no se responsabiliza por información falsa o incompleta proporcionada por el usuario.";

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

export const OPTIONAL_ADDONS_DISPLAY = [
    { name: "Revisión Avanzada DG (informativa)", price: "$25" },
    { name: "Optimización múltiple de pallets o cajas", price: "$30" },
    { name: "Alertas personalizadas para carga de riesgo", price: "$15" }
];


// ------------------------------------------------------------------------------
// 🚨 CORRECCIÓN CRÍTICA: DATABASE DE ALERTAS PARA LA CONSOLA OPERACIONAL
// ESTE OBJETO ES NECESARIO para que app.js pueda mostrar los mensajes (R001, R002, etc.)
// ------------------------------------------------------------------------------
const standards = {
    ALERTS_DB: {
        "R001": { "msg": "Pallet de madera sin sello ISPM-15.", "desc": "Alto riesgo fitosanitario. Necesita tratamiento." },
        "R002": { "msg": "Altura excede límite de ULD estándar (180cm).", "desc": "Riesgo de rechazo por sobredimensión." },
        "R003": { "msg": "Embalaje CRÍTICO (Roto/Fuga).", "desc": "Violación TSA/IATA. Rechazo inmediato en rampa." },
        "R004": { "msg": "Etiquetas DG/Frágil Faltantes.", "desc": "Incumplimiento de placarding (TSA/IATA)." },
        "R005": { "msg": "Segregación DG CRÍTICA (Mezcla con NO DG).", "desc": "Peligro de incompatibilidad química/incendio." },
        "R006": { "msg": "Discrepancia de Peso AWB/Físico.", "desc": "Alto riesgo de HOLD y re-facturación." },
        "R007": { "msg": "Contenido DG requiere documento Shipper's Declaration.", "desc": "Documento obligatorio DG faltante." }
    }
};

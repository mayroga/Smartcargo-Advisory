// ==============================================================================
// SMARTCARGO-ADVISORY — CONSTANTES GLOBALES
// ==============================================================================

// --- Campos AWB Obligatorios ---
export const AWB_MANDATORY_FIELDS = [
    { key: "SHIPPER", description: "Dueño real de la mercancía" },
    { key: "CONSIGNEE", description: "Destinatario final" },
    { key: "ADDRESS", description: "Dirección completa (no PO Boxes)" },
    { key: "INTERNATIONAL_PHONE", description: "Teléfono internacional válido" },
    { key: "WEIGHT_REAL_VOLUMETRIC", description: "Peso real vs volumétrico" },
    { key: "DIMENSIONS_EXACT", description: "Dimensiones exactas" },
    { key: "COMMODITY_TYPE", description: "Tipo exacto de mercancía" },
    { key: "AIRPORT_CODE", description: "Código IATA del aeropuerto" },
    { key: "PERMITTED_STATUS", description: "Si está permitido transportarlo" }
];

// --- Normativa ISPM-15 ---
export const ISPM_15_STANDARD = {
    NORMA: "ISPM-15 (Norma Internacional de Medidas Fitosanitarias)",
    SELLOS_OBLIGATORIOS: [
        "HT - Heat Treated",
        "Fumigación certificada",
        "Timbre internacional visible"
    ]
};

// --- Validaciones Obligatorias de Aviación ---
export const MANDATORY_VALIDATION_POINTS = [
    "Etiquetas IATA",
    "Etiquetas de orientación",
    "Embalaje firme",
    "No usar cinta negra",
    "Carga seca",
    "Pallets certificados ISPM-15",
    "Declaración de Dry Ice (si aplica)",
    "No mezclar incompatibles",
    "Documentos completos"
];

// --- Etiquetas universales ---
export const UNIVERSAL_LABELS = [
    "THIS SIDE UP",
    "FRAGILE",
    "PERISHABLE",
    "TEMPERATURE CONTROL",
    "DRY ICE",
    "LIVE ANIMALS",
    "BATTERIES",
    "CARGO AIRCRAFT ONLY"
];

// --- Mensajes legales ---
export const CORE_LEGAL_DISCLAIMER =
    "SmartCargo ofrece asesoría informativa. No es un servicio certificado IATA/TSA/FAA/DOT. No clasifica mercancía peligrosa. Para DG, consulte un especialista certificado.";

export const PRICE_LEGAL_DISCLAIMER =
    "SmartCargo no se responsabiliza por información falsa o incompleta subida por el usuario.";

// --- Precios y Planes ---
export const ELEGANT_SERVICE_TIERS = [
    {
        level: "Básico",
        name: "Revisión Esencial",
        price: "$35",
        features: [
            "Validación AWB",
            "Análisis básico de embalaje",
            "Verificación etiquetas IATA",
            "Confirmación ISPM-15",
            "PDF simple"
        ]
    },
    {
        level: "Profesional",
        name: "Optimización Completa",
        price: "$65",
        features: [
            "Todo el Básico",
            "Validación Fotográfica IA",
            "Optimización de pallets",
            "Detección de inconsistencias AWB",
            "PDF avanzado"
        ]
    },
    {
        level: "Premium",
        name: "Asesoría Integral",
        price: "$120",
        features: [
            "Todo Profesional",
            "Evaluación temperatura",
            "Alertas DG informativas",
            "Reporte avanzado completo"
        ]
    }
];

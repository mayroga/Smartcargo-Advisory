// ==============================================================================
// SMARTCARGO-ADVISORY FRONTEND - CAMPOS FIJOS Y ESTÁNDARES
// ==============================================================================

// --- CAMPOS OBLIGATORIOS DE AWB ---
export const AWB_MANDATORY_FIELDS = [
    { key: "SHIPPER", description: "Dueño real de la carga (responsable legal)" },
    { key: "CONSIGNEE", description: "Destinatario final" },
    { key: "ADDRESS", description: "Dirección completa (no PO Boxes)" },
    { key: "INTERNATIONAL_PHONE", description: "Teléfono internacional válido" },
    { key: "WEIGHT_REAL_VOLUMETRIC", description: "Peso real y volumétrico" },
    { key: "DIMENSIONS_EXACT", description: "Dimensiones exactas" },
    { key: "COMMODITY_TYPE", description: "Tipo de mercancía" },
    { key: "AIRPORT_CODE", description: "Código de aeropuerto (MIA, BOG, LIM, etc.)" },
    { key: "PERMITTED_STATUS", description: "Si está permitido o no enviarlo" }
];

// --- ESTÁNDAR ISPM-15 ---
export const ISPM_15_STANDARD = {
    NORMA: "ISPM-15 - Norma Internacional de Medidas Fitosanitarias",
    SELLOS_OBLIGATORIOS: [
        "HT - Heat Treated",
        "Fumigación certificada",
        "Timbre internacional visible"
    ]
};

// --- IDIOMAS OBLIGATORIOS ---
export const MINIMUM_LANGUAGES = [
    { code: "en", name: "Inglés" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Francés" },
    { code: "pt", name: "Portugués" },
    { code: "ko", name: "Coreano" },
    { code: "zh", name: "Chino (Simplificado)" },
    { code: "hi", name: "Hindi" }
];

// --- VALIDACIONES DE AVIACIÓN ---
export const MANDATORY_VALIDATION_POINTS = [
    "Etiquetas IATA",
    "Etiquetas de orientación",
    "Etiquetas de temperatura",
    "Documentación correcta",
    "Embalaje firme",
    "Cajas en buen estado",
    "No mezclar incompatibles",
    "No usar cinta negra",
    "Carga seca",
    "Pallets ISPM-15 (madera)",
    "Sello de fumigación (si aplica)",
    "Dry Ice declarado"
];

// --- ETIQUETAS UNIVERSALES ---
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

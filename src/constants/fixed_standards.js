// ==============================================================================
// SMARTCARGO-ADVISORY FRONTEND - CONSTANTES FIJAS DE ESTÁNDARES
// Estas definen la interfaz y los requisitos de validación visual.
// ==============================================================================

// --- IDIOMAS MÍNIMOS OBLIGATORIOS (Sección 4) ---
export const MINIMUM_LANGUAGES = [
    { code: "en", name: "Inglés" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Francés" },
    { code: "pt", name: "Portugués" },
    { code: "ko", name: "Coreano" },
    { code: "zh", name: "Chino (Simplificado)" },
    { code: "hi", name: "Hindi" }
    // Incluir todos los idiomas adicionales posibles
];

// --- REQUISITOS OBLIGATORIOS FIJOS DE AVIACIÓN (Sección 8) ---
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
    "Pallets ISPM-15 (si son de madera)",
    "Sello visible de fumigación (si aplica)",
    "Dry Ice declarado (si aplica)"
];

// --- ETIQUETAS Y SÍMBOLOS FIJOS (Sección 6.3) ---
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

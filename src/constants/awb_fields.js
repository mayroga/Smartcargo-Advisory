// ==============================================================================
// SMARTCARGO-ADVISORY FRONTEND - CAMPOS DE DOCUMENTACIÓN AWB FIJOS (SECCIÓN 7)
// Estos campos son obligatorios para la enseñanza.
// ==============================================================================

export const AWB_MANDATORY_FIELDS = [
    { key: "SHIPPER", description: "Dueño real de la carga (quien paga y es responsable legal)" },
    { key: "CONSIGNEE", description: "Destinatario final" },
    { key: "ADDRESS", description: "Dirección completa (no PO boxes)" },
    { key: "INTERNATIONAL_PHONE", description: "Teléfono internacional" },
    { key: "WEIGHT_REAL_VOLUMETRIC", description: "Peso real y volumétrico" },
    { key: "DIMENSIONS_EXACT", description: "Dimensiones exactas" },
    { key: "COMMODITY_TYPE", description: "Tipo de mercancía" },
    { key: "AIRPORT_CODE", description: "Código del aeropuerto (ej. MIA, BOG, LIM, UIO, etc.)" },
    { key: "PERMITTED_STATUS", description: "Si está permitido o no enviarlo" }
];

// --- ESTÁNDAR ISPM-15 FIJO (Sección 6.7) ---
export const ISPM_15_STANDARD = {
    NORMA: "ISPM-15 (Norma Internacional para Medidas Fitosanitarias N° 15)",
    SELLOS_OBLIGATORIOS: [
        "🔥 HT (Heat Treated)",
        "🐞 Fumigación certificada",
        "🌐 Timbre oficial internacional"
    ]
};

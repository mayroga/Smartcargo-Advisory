import {
    AWB_MANDATORY_FIELDS,
    ISPM_15_STANDARD,
    UNIVERSAL_LABELS
} from "./cargo_standards.js";

import { CORE_LEGAL_DISCLAIMER } from "./legal_warning.js";

import { ELEGANT_SERVICE_TIERS } from "./pricing.js";

document.getElementById("app").innerHTML = `
    <h2>Asistente SmartCargo</h2>

    <p>${CORE_LEGAL_DISCLAIMER}</p>

    <h3>Campos AWB Obligatorios</h3>
    <ul>${AWB_MANDATORY_FIELDS.map(f => `<li>${f.key}: ${f.description}</li>`).join("")}</ul>

    <h3>Planes Disponibles</h3>
    <ul>${ELEGANT_SERVICE_TIERS.map(t => `<li>${t.name} – ${t.price}</li>`).join("")}</ul>
`;

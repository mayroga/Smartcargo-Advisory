// server/services/dgService.js
// Provee asesoría preliminar sobre DG basada en reglas públicas (IATA reference style)
// **NO** certifica ni reemplaza personal certificado.

const DG_BASIC_REFERENCE = {
  '3': { name: 'Flammable liquids', note: 'Keep away from oxidizers. Label Class 3.' },
  '6.1': { name: 'Toxic substances', note: 'Separate from foodstuffs; packaging must be secure.' },
  '8': { name: 'Corrosives', note: 'Use corrosion-resistant packaging. Label Class 8.' },
  // add more classes as needed
};

/**
 * getDGReference returns a short advisory string based on class or UN
 */
export function getDGReference(unNumber, primaryClass) {
    if (!unNumber && !primaryClass) return { advisory: 'No DG data provided.' };
    if (primaryClass && DG_BASIC_REFERENCE[primaryClass]) {
        const ref = DG_BASIC_REFERENCE[primaryClass];
        return {
            advisory: `⚠️ Preliminary reference: ${ref.name}. ${ref.note} This is informational only.`,
            mustDeclare: true
        };
    }
    return {
        advisory: '⚠️ Verify UN and IATA Class. Preliminary DG reference only.',
        mustDeclare: !!unNumber
    };
}

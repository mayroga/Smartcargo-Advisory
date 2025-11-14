// server/services/optimizerService.js
// Lógica central para cálculos y recomendaciones

/**
 * parseDimensions expects "LxWxH" in cm (numbers). Returns [l,w,h] in meters and cm as needed.
 */
export function parseDimensions(dimStr) {
    const parts = dimStr.split('x').map(p => Number(p.trim()));
    if (parts.length !== 3 || parts.some(isNaN)) throw new Error('Invalid dimensions format. Use LxWxH in cm e.g. 80x60x40');
    // keep cm for dim weight formula; convert to meters when calculating volume in m^3 if needed
    return parts; // [L_cm, W_cm, H_cm]
}

/**
 * calculateDimWeight: using IATA formula L*W*H / 6000 (cm)
 * dimWeight in kg
 */
export function calculateDimWeightCm(L_cm, W_cm, H_cm, pieces = 1) {
    const volumeCm = L_cm * W_cm * H_cm * pieces;
    const dimWeight = volumeCm / 6000; // kg
    return dimWeight;
}

/**
 * estimatePallets: simple pallet stowage using usable pallet footprint and height
 * Pallet footprint: 120cm x 100cm, usable height default 160cm
 */
export function estimatePallets(L_cm, W_cm, H_cm, pieces = 1) {
    const palletFootprintCm2 = 120 * 100; // cm^2 base
    const pieceBaseArea = L_cm * W_cm; // cm^2
    // approximate stacking layers per pallet = floor(usable height / H_cm)
    const usableHeight = 160; // cm
    const layers = Math.max(1, Math.floor(usableHeight / H_cm));
    const piecesPerLayer = Math.max(1, Math.floor(palletFootprintCm2 / pieceBaseArea));
    const capacityPerPallet = piecesPerLayer * layers;
    const pallets = Math.ceil(pieces / capacityPerPallet);
    return Math.max(1, pallets);
}

/**
 * calculateFee: $60 flat + commission % of savings between 15% - 30% depending on amount saved
 */
export function calculateFee(savingsUSD) {
    const base = 60; // fixed fee per shipment
    let commissionRate = 0.15;
    if (savingsUSD > 500) commissionRate = 0.20;
    if (savingsUSD > 2000) commissionRate = 0.25;
    if (savingsUSD > 5000) commissionRate = 0.30;
    const commission = savingsUSD * commissionRate;
    const fee = Math.max(25, base + commission); // ensure minimum reasonable fee
    return { fee, commissionRate, commission };
}

/**
 * main optimize function receives data and returns computed results + suggestions
 */
export function runOptimizationEngine(data) {
    // Ensure numeric parsing and validation
    const pieces = Number(data.pieces || 1);
    const [L_cm, W_cm, H_cm] = parseDimensions(data.dimensions);
    const realWeight = Number(data.realWeight);

    const dimWeight = calculateDimWeightCm(L_cm, W_cm, H_cm, pieces);
    const billingWeight = Math.max(realWeight, dimWeight);

    // Estimate pallets
    const estimatedPallets = estimatePallets(L_cm, W_cm, H_cm, pieces);

    // Estimate potential savings: naive simulation $5/kg * difference
    const pricePerKg = 5; // USD assumed for simulation; can be made dynamic in future
    const potentialFleteCost = billingWeight * pricePerKg;
    // Suppose we can reduce dim weight by 10% normal; only estimate when dimWeight > realWeight
    const expectedReductionKg = dimWeight > realWeight ? dimWeight * 0.10 : 0;
    const savingsEstimate = expectedReductionKg * pricePerKg;

    const { fee, commissionRate, commission } = calculateFee(savingsEstimate);

    let suggestions = `Documentación inicial validada. Estimated pallets: ${estimatedPallets}. `;
    if (savingsEstimate > 0) {
        suggestions += `Possible savings approx $${savingsEstimate.toFixed(2)} USD by reducing dimensional volume. Commission rate ${Math.round(commissionRate*100)}% applied.`;
    } else {
        suggestions += `No dimensional savings detected. Consider repacking to reduce empty space.`;
    }

    return {
        calculatedDimWeight: dimWeight,
        billingWeight,
        calculatedPallets: estimatedPallets,
        savingsEstimate,
        feeCharged: Number(fee.toFixed(2)),
        optimizationSuggestions: suggestions
    };
}

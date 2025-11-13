const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const { sendValidationEmail } = require('../services/emailService');
const { generateValidationPDF } = require('../services/pdfService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Función de Simulación de Validación (Aquí va tu LÓGICA DE NEGOCIO REAL)
const runOptimizationEngine = (data) => {
    const [l, w, h] = data.dimensions.split('x').map(Number);
    // Fórmula Aérea IATA: L*W*H / 6000
    const dimWeight = (l * w * h) / 6000;
    const realWeight = parseFloat(data.realWeight);
    const billingWeight = Math.max(realWeight, dimWeight); // Siempre se cobra el mayor
    
    // Lógica de Ahorro: Asume que se puede ahorrar 15% del flete estimado si se optimiza
    const potentialFleteCost = billingWeight * 5; // Simulación: $5 USD por kg cobrable
    const savingsEstimate = (dimWeight > realWeight) ? (potentialFleteCost * 0.15) : 0;
    
    // Tarifa de SmartCargo: 25% de la comisión sobre el ahorro (o tarifa fija si ahorro=0)
    const feeCharged = Math.max(25, savingsEstimate * 0.25); // Mínimo $25 USD
    
    let suggestions = "Documentación inicial validada y completa.";
    if (savingsEstimate > 0) {
        suggestions += ` Recomendación: Reducir dimensiones para ahorrar $${savingsEstimate.toFixed(2)}.`;
    }
    
    return {
        billingWeight: billingWeight,
        savingsEstimate: savingsEstimate,
        feeCharged: feeCharged,
        optimizationSuggestions: suggestions,
        documentsValid: true // Simulación. Aquí iría la validación documental real.
    };
};

// POST /api/submit-shipment: Procesa la solicitud del cliente
router.post('/submit-shipment', async (req, res) => {
    try {
        const data = req.body;
        
        // Ejecutar el motor de validación
        const optimizationResults = runOptimizationEngine(data);
        
        const newShipment = new Shipment({
            ...data,
            ...optimizationResults,
            // Disclaimer legal: No se valida en persona
            optimizationSuggestions: optimizationResults.optimizationSuggestions + " Aviso Legal: La asesoría se basa en datos proporcionados y no incluye inspección física de la mercancía." 
        });

        await newShipment.save();
        
        // Generar el Payment Intent de Stripe
        const amountInCents = Math.round(newShipment.feeCharged * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            metadata: { shipmentId: newShipment._id.toString() }
        });
        
        newShipment.stripePaymentIntentId = paymentIntent.id;
        await newShipment.save();
        
        // Generación del PDF (el PDF contiene el botón de pago)
        const pdfBuffer = await generateValidationPDF(newShipment);
        
        // Enviar Email con el PDF adjunto y el URL expirable
        await sendValidationEmail(newShipment, pdfBuffer, paymentIntent.client_secret);

        res.status(200).json({ 
            message: 'Envío procesado, revisa tu correo. El informe expira en 72 horas.',
            token: newShipment.pdfToken
        });

    } catch (error) {
        console.error('Error CRÍTICO al procesar el envío:', error);
        res.status(500).json({ message: 'Error interno del servidor. Por favor, revisa logs.' });
    }
});

module.exports = router;

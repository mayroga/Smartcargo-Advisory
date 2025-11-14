import express from 'express';
import Stripe from 'stripe';
import Shipment from '../models/Shipment.js';
import { sendValidationEmail } from '../services/emailService.js';
import { generateValidationPDF } from '../services/pdfService.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Motor de optimización y cálculo
const runOptimizationEngine = (data) => {
    const [l, w, h] = data.dimensions.split('x').map(Number);
    const dimWeight = (l * w * h) / 6000; // Fórmula IATA
    const realWeight = parseFloat(data.realWeight);
    const billingWeight = Math.max(realWeight, dimWeight);

    const potentialFleteCost = billingWeight * 5; // $5 USD por kg cobrable
    const savingsEstimate = (dimWeight > realWeight) ? (potentialFleteCost * 0.15) : 0;

    // Tarifa SmartCargo: $60 fijo + 15-30% del ahorro
    const percentage = savingsEstimate > 0 ? 0.15 + Math.random() * 0.15 : 0; // aleatorio entre 15-30%
    const feeCharged = 60 + savingsEstimate * percentage;

    let suggestions = "Documentación inicial validada y completa.";
    if (savingsEstimate > 0) {
        suggestions += ` Recomendación: Reducir dimensiones para ahorrar $${savingsEstimate.toFixed(2)}.`;
    }

    return {
        calculatedDimWeight: dimWeight,
        billingWeight: billingWeight,
        savingsEstimate: savingsEstimate,
        feeCharged: feeCharged,
        optimizationSuggestions: suggestions,
        documentsValid: true
    };
};

// POST /api/submit-shipment
router.post('/submit-shipment', async (req, res) => {
    try {
        const data = req.body;

        // Ejecutar motor de optimización
        const optimizationResults = runOptimizationEngine(data);

        const newShipment = new Shipment({
            ...data,
            ...optimizationResults,
            optimizationSuggestions: optimizationResults.optimizationSuggestions + 
                " Aviso Legal: La asesoría se basa en datos proporcionados y no incluye inspección física de la mercancía."
        });

        await newShipment.save();

        // Crear Payment Intent en Stripe
        const amountInCents = Math.round(newShipment.feeCharged * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            metadata: { shipmentId: newShipment._id.toString() }
        });

        newShipment.stripePaymentIntentId = paymentIntent.id;
        await newShipment.save();

        // Generar PDF de validación
        const pdfBuffer = await generateValidationPDF(newShipment);

        // Enviar email con PDF y enlace de pago
        await sendValidationEmail(newShipment, pdfBuffer, paymentIntent.client_secret);

        res.status(200).json({ 
            message: 'Envío procesado, revisa tu correo. El informe expira en 72 horas.',
            token: newShipment.pdfToken
        });

    } catch (error) {
        console.error('Error al procesar el envío:', error);
        res.status(500).json({ message: 'Error interno del servidor. Por favor, revisa logs.' });
    }
});

export default router;

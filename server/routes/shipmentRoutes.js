import express from 'express';
import Stripe from 'stripe';
import Shipment from '../models/Shipment.js';
import { sendValidationEmail } from '../services/emailService.js';
import { generateValidationPDF } from '../services/pdfService.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const runOptimizationEngine = (data) => {
    const [l, w, h] = data.dimensions.split('x').map(Number);
    const dimWeight = (l * w * h) / 6000;
    const realWeight = parseFloat(data.realWeight);
    const billingWeight = Math.max(realWeight, dimWeight);

    const potentialFleteCost = billingWeight * 5;
    const savingsEstimate = (dimWeight > realWeight) ? (potentialFleteCost * 0.15) : 0;

    const feeCharged = 60 + (savingsEstimate > 0 ? savingsEstimate * 0.25 : 0);

    let suggestions = "Documentación inicial validada y completa.";
    if(savingsEstimate>0) suggestions += ` Recomendación: Reducir dimensiones para ahorrar $${savingsEstimate.toFixed(2)}.`;

    return {
        calculatedDimWeight: dimWeight,
        billingWeight,
        savingsEstimate,
        feeCharged,
        optimizationSuggestions: suggestions,
        documentsValid: true
    };
};

router.post('/submit-shipment', async (req, res) => {
    try {
        const data = req.body;
        const optimizationResults = runOptimizationEngine(data);

        const newShipment = new Shipment({
            ...data,
            ...optimizationResults,
            optimizationSuggestions: optimizationResults.optimizationSuggestions + " Aviso Legal: Asesoría basada en datos proporcionados."
        });

        await newShipment.save();

        const amountInCents = Math.round(newShipment.feeCharged * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            metadata: { shipmentId: newShipment._id.toString() }
        });

        newShipment.stripePaymentIntentId = paymentIntent.id;
        await newShipment.save();

        const pdfBuffer = await generateValidationPDF(newShipment);
        await sendValidationEmail(newShipment, pdfBuffer, paymentIntent.client_secret);

        res.status(200).json({
            message: 'Envío procesado, revisa tu correo. El informe expira en 72 horas.',
            token: newShipment.pdfToken
        });

    } catch(error) {
        console.error('Error crítico:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

export default router;

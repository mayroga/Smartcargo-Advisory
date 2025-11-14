// server/routes/shipmentRoutes.js
import express from 'express';
import Shipment from '../models/Shipment.js';
import { runOptimizationEngine } from '../services/optimizerService.js';
import { generateValidationPDF } from '../services/pdfService.js';
import { sendValidationEmail } from '../services/emailService.js';
import Stripe from 'stripe';
import 'dotenv/config';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || ''); // will warn if empty

// POST /api/submit-shipment
router.post('/submit-shipment', async (req, res) => {
    try {
        const data = req.body;

        // Validate required fields
        if (!data.clientEmail || !data.destination || !data.dimensions || !data.realWeight) {
            return res.status(400).json({ message: 'Faltan datos obligatorios: clientEmail, destination, dimensions, realWeight' });
        }

        // Default pieces if not provided
        data.pieces = Number(data.pieces || 1);

        // Run optimizer
        const optimization = runOptimizationEngine(data);

        // Create DB record
        const newShipment = new Shipment({
            ...data,
            ...optimization,
            optimizationSuggestions: optimization.optimizationSuggestions + " Aviso Legal: Basado en datos proporcionados; no incluye inspección física."
        });

        await newShipment.save();

        // Create Stripe PaymentIntent for fee
        const amountInCents = Math.round(newShipment.feeCharged * 100);
        let paymentIntent = null;
        if (process.env.STRIPE_SECRET_KEY) {
            paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: 'usd',
                metadata: { shipmentId: newShipment._id.toString() }
            });
            newShipment.stripePaymentIntentId = paymentIntent.id;
            await newShipment.save();
        } else {
            console.warn('[WARN] STRIPE_SECRET_KEY missing; skipping PaymentIntent creation.');
        }

        // Generate PDF
        const pdfBuffer = await generateValidationPDF(newShipment);

        // Send email with PDF and payment link (if client_secret present)
        const clientSecret = paymentIntent?.client_secret || null;
        await sendValidationEmail(newShipment, pdfBuffer, clientSecret);

        res.status(200).json({
            message: 'Envío procesado. Revisa tu correo (incluye PDF e instrucciones de pago).',
            token: newShipment.pdfToken
        });

    } catch (error) {
        console.error('Error processing shipment:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el envío.' });
    }
});

// GET endpoint to download PDF (simple, checks token)
router.get('/download/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const shipment = await Shipment.findOne({ pdfToken: token });
        if (!shipment) return res.status(404).send('Informe no encontrado o token inválido.');

        // For simplicity, regenerate PDF on download (could store buffer in future)
        const pdfBuffer = await generateValidationPDF(shipment);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=SmartCargo_Report_${shipment._id.toString().slice(-6)}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        console.error('PDF download error:', err);
        res.status(500).send('Error generando documento PDF.');
    }
});

export default router;

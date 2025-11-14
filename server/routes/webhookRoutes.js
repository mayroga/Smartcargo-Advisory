// server/routes/webhookRoutes.js
import express from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import Shipment from '../models/Shipment.js';
import 'dotenv/config';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// IMPORTANT: this route expects raw body; mounted in server.js BEFORE express.json()

router.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const pi = event.data.object;
        const shipmentId = pi.metadata?.shipmentId;
        if (shipmentId) {
            await Shipment.findByIdAndUpdate(shipmentId, { paymentStatus: 'PAID' });
            console.log(`✅ Pago exitoso para el envío: ${shipmentId}`);
        }
    }

    res.json({ received: true });
});

export default router;

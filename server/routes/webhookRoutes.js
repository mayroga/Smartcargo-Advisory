import express from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import Shipment from '../models/Shipment.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', bodyParser.raw({ type:'application/json' }), async (req,res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try{
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }catch(err){
        console.log(`❌ Error al verificar Webhook: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if(event.type === 'payment_intent.succeeded'){
        const paymentIntent = event.data.object;
        const shipmentId = paymentIntent.metadata.shipmentId;
        await Shipment.findByIdAndUpdate(shipmentId,{ paymentStatus:'PAID' });
        console.log(`✅ Pago exitoso para el envío: ${shipmentId}`);
    }

    res.json({ received:true });
});

export default router;

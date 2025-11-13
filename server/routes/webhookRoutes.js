const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const Shipment = require('../models/Shipment');

// Stripe necesita el cuerpo de la petición sin procesar
router.post('/', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    // Verifica la firma para asegurar que el evento viene de Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`❌ Error al verificar Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Maneja el evento de pago exitoso
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const shipmentId = paymentIntent.metadata.shipmentId;
    
    // Actualiza el estado de la DB
    await Shipment.findByIdAndUpdate(shipmentId, { paymentStatus: 'PAID' });
    console.log(`✅ Pago exitoso para el envío: ${shipmentId}`);
    // Aquí podrías enviar un email de confirmación de pago final
  }

  res.json({ received: true });
});

module.exports = router;

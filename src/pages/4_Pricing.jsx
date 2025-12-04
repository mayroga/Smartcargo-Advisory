// src/pages/4_Pricing.jsx
import React, { useState, useEffect } from 'react';
import { ELEGANT_SERVICE_TIERS } from '../requirements/pricing_data';
import { PRICE_LEGAL_DISCLAIMER } from '../requirements/legal_warning';
import apiClient from '../api/api_client';
import { loadStripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_KEY } from '../../config/env_keys';

const stripePromise = loadStripe(PUBLIC_STRIPE_KEY);

const PricingPage = ({ shipmentId, userId, navigate }) => {
  const [basicTier, setBasicTier] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const basic = ELEGANT_SERVICE_TIERS.find(t => t.level === "Básico") || ELEGANT_SERVICE_TIERS[0];
    setBasicTier(basic);
  }, []);

  const handleCheckout = async () => {
    if (!shipmentId || !userId) {
      alert('Falta información para proceder al pago.');
      return;
    }
    setProcessing(true);
    try {
      const response = await apiClient.post('/payment/create-checkout', { shipment_id: shipmentId, user_id: userId });
      const sessionId = response.data.id;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error(error);
        alert('Error de pago: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error al iniciar el proceso de pago.');
    } finally {
      setProcessing(false);
    }
  };

  if (!basicTier) return <p>Cargando precios...</p>;

  return (
    <div className="pricing-container">
      <h2>{basicTier.name} — {basicTier.price}</h2>
      <p>Plan esencial para evitar rechazos y proteger su envío.</p>

      <ul>
        {basicTier.features.map((f) => <li key={f}>{f}</li>)}
      </ul>

      <p style={{ fontStyle: 'italic', color: '#666' }}>{basicTier.perceived_value}</p>

      <p className="legal-warning-small">{PRICE_LEGAL_DISCLAIMER}</p>

      <button onClick={handleCheckout} disabled={processing}>
        {processing ? 'Redirigiendo al pago...' : 'Proceder al Pago Seguro'}
      </button>
    </div>
  );
};

export default PricingPage;

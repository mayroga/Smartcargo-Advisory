// Smartcargo-Advisory/src/pages/4_Pricing.jsx

import { ELEGANT_SERVICE_TIERS } from '../requirements/pricing_data';
import { PUBLIC_STRIPE_KEY } from '../../config/env_keys'; 
import { loadStripe } from '@stripe/stripe-js';
import apiClient from '../api/api_client'; 

const stripePromise = loadStripe(PUBLIC_STRIPE_KEY);

const PricingPage = ({ shipmentId, userId }) => {
    
    // FASE 1 MVP: Solo se muestra y se permite comprar el Nivel Básico (Revisión Esencial)
    const basicTier = ELEGANT_SERVICE_TIERS.find(t => t.level === "Básico");

    const handleCheckout = async () => {
        const stripe = await stripePromise;
        
        try {
            // Llamada al Endpoint Fijo de creación de sesión en el backend
            const response = await apiClient.post('/payment/create-checkout', { shipment_id: shipmentId, user_id: userId });
            const sessionId = response.data.id;

            // Redirigir a Stripe Checkout
            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                console.error(result.error.message);
                alert("Error de pago: " + result.error.message);
            }
        } catch (error) {
            alert("Error al iniciar el proceso de pago.");
        }
    };

    return (
        <div className="pricing-container">
            <h2>{basicTier.name} ({basicTier.price})</h2>
            <p>El plan esencial para asegurar el cumplimiento legal y evitar rechazos.</p>
            <ul>
                {basicTier.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <p className="legal-perception">{basicTier.perceived_value}</p>
            
            {/* Mensaje Legal del Precio (Cláusula de no responsabilidad) */}
            <p className="legal-warning-small">{PRICE_LEGAL_DISCLAIMER}</p> 

            <button onClick={handleCheckout}>Proceder al Pago Seguro</button>
        </div>
    );
};

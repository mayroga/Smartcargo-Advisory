// server/models/Shipment.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const shipmentSchema = new mongoose.Schema({
    clientEmail: { type: String, required: true },
    destination: { type: String, required: true },
    realWeight: { type: Number, required: true },
    dimensions: { type: String, required: true }, // "LxWxH" in cm

    // Results & optimization
    calculatedDimWeight: { type: Number, default: 0 },
    billingWeight: { type: Number, default: 0 },
    savingsEstimate: { type: Number, default: 0 },
    optimizationSuggestions: { type: String, default: 'Documentación validada.' },

    // DG flags (informational only)
    isDangerousGoods: { type: Boolean, default: false },
    unNumber: { type: String, default: '' },
    dgClassPrimary: { type: String, default: '' },

    // Security / PDF token
    pdfToken: { type: String, default: () => uuidv4(), unique: true },
    pdfExpiresAt: { type: Date, default: () => Date.now() + 72 * 60 * 60 * 1000 },

    // Payments
    feeCharged: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'PENDING' }, // PENDING | PAID
    stripePaymentIntentId: { type: String, default: '' }
}, {
    timestamps: true
});

export default mongoose.model('Shipment', shipmentSchema);

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const shipmentSchema = new mongoose.Schema({
    clientEmail: { type: String, required: true },
    destination: { type: String, required: true },
    realWeight: { type: Number, required: true },
    dimensions: { type: String, required: true },

    calculatedDimWeight: { type: Number, default: 0 },
    billingWeight: { type: Number, default: 0 },
    savingsEstimate: { type: Number, default: 0 },
    optimizationSuggestions: { type: String, default: 'Documentación validada.' },
    isDangerousGoods: { type: Boolean, default: false },

    documentsValid: { type: Boolean, default: false },
    pdfToken: { type: String, default: uuidv4, unique: true },
    pdfExpiresAt: { type: Date, default: () => Date.now() + 72*60*60*1000 },

    feeCharged: { type: Number, default: 60 },
    paymentStatus: { type: String, default: 'PENDING' },
    stripePaymentIntentId: { type: String }

}, { timestamps: true });

export default mongoose.model('Shipment', shipmentSchema);

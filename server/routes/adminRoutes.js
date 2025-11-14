// server/routes/adminRoutes.js
import express from 'express';
import Shipment from '../models/Shipment.js';
import 'dotenv/config';

const router = express.Router();

// Simple admin auth (improvisada) using env variables
const authenticateAdmin = (req, res, next) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        return next();
    }
    return res.status(401).json({ message: 'Credenciales de administrador inválidas.' });
};

router.post('/login', authenticateAdmin, (req, res) => {
    res.json({ success: true, message: 'Autenticación exitosa.' });
});

router.get('/dashboard', async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ createdAt: -1 }).lean();
        const totalSavings = shipments.reduce((sum, s) => sum + (s.savingsEstimate || 0), 0);
        const totalRevenue = shipments.filter(s => s.paymentStatus === 'PAID').reduce((sum, s) => sum + (s.feeCharged || 0), 0);
        res.json({ shipments, stats: { totalShipments: shipments.length, totalSavings, totalRevenue } });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Error al cargar el dashboard.' });
    }
});

export default router;

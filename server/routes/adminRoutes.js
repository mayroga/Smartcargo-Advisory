const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// Middleware simple de autenticación (¡DEBES MEJORAR ESTO!)
const authenticateAdmin = (req, res, next) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ message: 'Credenciales de administrador inválidas.' });
    }
};

// POST /api/admin/login
router.post('/login', authenticateAdmin, (req, res) => {
    res.json({ success: true, message: 'Autenticación exitosa.' });
});

// GET /api/admin/dashboard (Requiere autenticación previa)
router.get('/dashboard', async (req, res) => {
    try {
        // En un sistema real, verificarías la sesión del admin aquí
        const shipments = await Shipment.find().sort({ createdAt: -1 });

        const totalSavings = shipments.reduce((sum, s) => sum + s.savingsEstimate, 0);
        const totalRevenue = shipments.filter(s => s.paymentStatus === 'PAID').reduce((sum, s) => sum + s.feeCharged, 0);

        res.json({
            shipments,
            stats: {
                totalShipments: shipments.length,
                totalSavings,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar el dashboard.' });
    }
});

module.exports = router;

// routes/measurementRoutes.js
import express from 'express';
import { handleCalculation } from '../controllers/calculationController.js';

const router = express.Router();

// POST /api/v1/measurements/calculate
// Endpoint para que el Frontend solicite el calculo de pesos.
router.post('/calculate', handleCalculation);

export default router;

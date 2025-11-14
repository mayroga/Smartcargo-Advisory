import express from 'express';
const router = express.Router();

// Ruta raíz
router.get("/", (req, res) => {
  res.json({
    service: "SmartCargo Advisory Web Service",
    status: "✅ Operativo",
    version: "1.0.0",
    uptime: process.uptime().toFixed(0) + "s",
    timestamp: new Date().toISOString(),
  });
});

router.get("/health", (req, res) => {
  res.status(200).json({ message: "OK", uptime: process.uptime() });
});

export default router;

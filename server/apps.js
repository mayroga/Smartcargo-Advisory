// server/apps.js
const express = require("express");
const router = express.Router();

// 🔹 Ruta raíz (Render la usa para saber si el servicio está activo)
router.get("/", (req, res) => {
  res.json({
    service: "SmartCargo Advisory Web Service",
    status: "✅ Operativo",
    version: "1.0.0",
    uptime: process.uptime().toFixed(0) + "s",
    timestamp: new Date().toISOString(),
  });
});

// 🔹 Ruta secundaria para chequeos o integraciones futuras
router.get("/health", (req, res) => {
  res.status(200).json({ message: "OK", uptime: process.uptime() });
});

module.exports = router;

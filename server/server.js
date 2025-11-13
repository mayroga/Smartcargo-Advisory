// Carga las variables de entorno
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------
// 1. MIDDLEWARE GLOBAL
// ------------------------------------
app.use(cors());
app.use(bodyParser.json());

// ------------------------------------
// 2. CONEXIÓN A MONGODB
// ------------------------------------
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado correctamente.'))
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });

// ------------------------------------
// 3. RUTAS DE LA API
// ------------------------------------
const shipmentRoutes = require('./routes/shipmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

app.use('/api', shipmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/webhook', webhookRoutes);

// Ruta simple de prueba
app.get('/api/status', (req, res) => {
  res.send({ message: '✅ SmartCargo API activa y funcionando.' });
});

// ------------------------------------
// 4. SERVIR FRONTEND (Render Web Service)
// ------------------------------------
const clientPath = path.join(__dirname, '../client/dist');

// Servir archivos estáticos del frontend compilado por Vite
app.use(express.static(clientPath));

// Cualquier ruta no-API devuelve el index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// ------------------------------------
// 5. INICIAR SERVIDOR
// ------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor SmartCargo ejecutándose en puerto ${PORT}`);
});

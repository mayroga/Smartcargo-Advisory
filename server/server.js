require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ------------------------------------
// CONEXIÓN A MONGODB ATLAS
// ------------------------------------
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado.'))
  .catch(err => {
    console.error('❌ Error CRÍTICO de conexión a MongoDB:', err.message);
    process.exit(1); 
  });

// ------------------------------------
// RUTAS Y MIDDLEWARE
// ------------------------------------
const shipmentRoutes = require('./routes/shipmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webhookRoutes = require('./routes/webhookRoutes'); // Para Stripe

app.use('/api', shipmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/webhook', webhookRoutes); // Stripe Webhook debe ser una ruta abierta

app.get('/', (req, res) => {
    res.send('SmartCargo Advisory API activa. Estado: Operacional.');
});

// ------------------------------------
// INICIAR SERVIDOR
// ------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});

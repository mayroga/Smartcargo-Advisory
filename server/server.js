// Carga las variables de entorno al inicio
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Se agrega para servir archivos estáticos

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (body-parser para JSON, cors)
app.use(cors());
app.use(bodyParser.json());

// ------------------------------------
// 1. CONEXIÓN A MONGODB ATLAS
// ------------------------------------
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado.'))
  .catch(err => {
    console.error('❌ Error CRÍTICO de conexión a MongoDB:', err.message);
    process.exit(1); 
  });

// ------------------------------------
// 2. IMPORTAR Y USAR RUTAS DE LA API
// ------------------------------------
// Nota: Asegúrate de que estos archivos existan y estén nombrados correctamente:
// ./routes/shipmentRoutes.js, ./routes/adminRoutes.js, ./routes/webhookRoutes.js

const shipmentRoutes = require('./routes/shipmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

app.use('/api', shipmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/webhook', webhookRoutes); 

// Ruta de prueba
app.get('/api/status', (req, res) => {
    res.send('SmartCargo API activa y funcionando.');
});

// ------------------------------------
// 3. SERVIR EL FRONTEND COMPILADO (PRODUCCIÓN)
// ------------------------------------
// ESTE BLOQUE ES CRÍTICO para que Render sirva React
if (process.env.NODE_ENV === 'production') {
  // Asegúrate de que 'dist' es la carpeta de compilación de tu Frontend
  const frontendPath = path.join(__dirname, '../client/dist');
  
  // Servir los archivos estáticos (JS, CSS, imágenes) desde la carpeta 'dist'
  app.use(express.static(frontendPath)); 

  // Cualquier ruta que no sea de la API debe servir el index.html de React
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  // Ruta de prueba para desarrollo si no es producción
  app.get('/', (req, res) => {
    res.send('SmartCargo Advisory API activa. Estado: Operacional.');
  });
}


// ------------------------------------
// 4. INICIAR SERVIDOR
// ------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});

// Carga las variables de entorno al inicio
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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
import shipmentRoutes from './routes/shipmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

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
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../client/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
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

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Importación de rutas
import shipmentRoutes from './routes/shipmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js'; 

const app = express();
const PORT = process.env.PORT || 10000;

// Configuración para usar ES Modules y simular __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware Setup ---
// 1. Webhooks deben usar el cuerpo RAW (sin procesar) y deben ir primero
app.use('/api/webhooks', webhookRoutes); 

// 2. Middleware estándar para el resto de rutas
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas conectado.'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// --- API Routes ---
app.use('/api/shipments', shipmentRoutes);
app.use('/api/admin', adminRoutes);

// --- STATIC FILE SERVING FIX (CRITICAL) ---
// Resolve el error ENOENT: no such file or directory.
// Apuntamos al directorio 'client' (un nivel arriba del directorio 'server').
const clientPath = path.join(__dirname, '..', 'client'); 
console.log(`[Express] Sirviendo archivos estáticos desde: ${clientPath}`);
app.use(express.static(clientPath));

// Fallback: Para todas las demás peticiones GET, enviamos el index.html principal (comportamiento de SPA)
// Esto asegura que la aplicación cargue correctamente independientemente de la ruta.
app.get('*', (req, res) => {
    // Apunta directamente a 'index.html' dentro del directorio 'client'
    res.sendFile(path.join(clientPath, 'index.html'));
});


// --- Server Start ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});

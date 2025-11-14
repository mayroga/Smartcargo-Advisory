// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Routes
import shipmentRoutes from './routes/shipmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import appsRouter from './apps.js';

const app = express();
const PORT = process.env.PORT || 10000;

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- IMPORTANT: webhook raw body must be mounted BEFORE express.json() ---
app.use('/api/webhooks', webhookRoutes); // webhook route expects raw body

// Standard middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.warn('[WARN] MONGODB_URI not set. DB connection will likely fail.');
}
mongoose.connect(process.env.MONGODB_URI || '', {
  // options if necessary
}).then(() => console.log('✅ MongoDB Atlas conectado.'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// API routes
app.use('/api/shipments', shipmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/apps', appsRouter); // health routes etc.

// Serve client static files (production)
// We expect client build output in ../client/dist
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
console.log(`[Express] Serving static from: ${clientDistPath}`);
app.use(express.static(clientDistPath));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Error loading client app');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});

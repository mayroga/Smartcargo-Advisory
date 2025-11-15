// index.js
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import measurementRoutes from './routes/measurementRoutes.js';

// Cargar variables de entorno (para desarrollo local, Render las usa directamente)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'; // BASE_URL del Frontend

// --- Configuraciones de Seguridad y Middleware ---

// 1. Helmet para Headers de Seguridad
app.use(helmet());

// 2. CORS: Permite la comunicación con el Frontend de SmartCargo AIPA
const corsOptions = {
    origin: BASE_URL, 
    optionsSuccessStatus: 200 // Para compatibilidad con navegadores antiguos
};
app.use(cors(corsOptions));

// 3. Middleware de Express para parsear JSON en el cuerpo de la peticion
app.use(express.json());


// --- Rutas de la API ---

// Ruta de Salud (Health Check) - Importante para Render
app.get('/api/v1/health', (req, res) => {
    res.status(200).send({ status: 'API SmartCargo-Advisory está en línea y lista.' });
});

// Rutas de Medición y Cálculos
app.use('/api/v1/measurements', measurementRoutes);


// --- Inicialización del Servidor ---

app.listen(PORT, () => {
    console.log(`🚀 Servidor SmartCargo-Advisory corriendo en puerto ${PORT}`);
    console.log(`🌐 Base URL esperada para Frontend: ${BASE_URL}`);
    console.log("Nota: Variables de entorno como GEMINI_API_KEY, STRIPE_SECRET_KEY, etc., estan cargadas y listas para ser usadas en los modulos de IA y pagos.");
});

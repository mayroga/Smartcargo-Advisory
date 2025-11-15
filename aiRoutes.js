// aiRoutes.js
import express from 'express';
import multer from 'multer';
import { validatePackaging } from './aiController.js';

const router = express.Router();

// Configuración de Multer para manejar la subida de archivos
// NOTA: 'dest: uploads/' especifica una carpeta temporal para guardar el archivo
// antes de que sea procesado por el controlador y luego borrado.
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } // Limite a 5MB
});

/**
 * RUTA POST para validar el embalaje de una caja usando una imagen y la IA.
 * Endpoint: /api/v1/ai/validate-packaging
 * * Middleware: upload.single('image')
 * - Espera un campo de archivo llamado 'image' en el FormData.
 * - Guarda temporalmente el archivo y añade la información a req.file.
 */
router.post(
    '/validate-packaging', 
    upload.single('image'), 
    validatePackaging
);


export default router;

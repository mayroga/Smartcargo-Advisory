// aiController.js
import fetch from 'node-fetch';
import fs from 'fs';
import { promisify } from 'util';

// Promisify fs.readFile and fs.unlink for async/await usage
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

// IMPORTANT: Use the Gemini 2.5 Flash Image Preview model for multimodal tasks
const MODEL_NAME = "gemini-2.5-flash-image-preview";

// Helper function to convert local file path to base64
async function fileToGenerativePart(path, mimeType) {
  const fileData = await readFile(path);
  return {
    inlineData: {
      data: fileData.toString("base64"),
      mimeType
    },
  };
}

/**
 * Validates the packaging of a shipment using the Gemini Multimodal Model.
 * Analiza una imagen de embalaje basándose en la mercancía declarada.
 * * @param {object} req - Express request object (must contain file and body)
 * @param {object} res - Express response object
 */
export const validatePackaging = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha subido ningún archivo de imagen para la validación." });
  }

  const { path: imagePath, mimetype: mimeType } = req.file;
  const { commodity, originalAdvice } = req.body;

  // Retrieve API Key (set in the server's environment)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Clean up the uploaded file before erroring out
    await unlink(imagePath).catch(err => console.error("Error al borrar archivo:", err));
    return res.status(500).json({ error: "Error de configuración: GEMINI_API_KEY no está definida." });
  }
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  try {
    // 1. Convert the image file to a Gemini Part object
    const imagePart = await fileToGenerativePart(imagePath, mimeType);

    // 2. Define the structured output schema for the AI result
    const responseSchema = {
      type: "OBJECT",
      properties: {
        summaryReport: {
          type: "STRING",
          description: "A concise, single-sentence summary of the validation (e.g., 'Aprobado: El embalaje es óptimo y la etiqueta está visible.' or 'Rechazado: La caja tiene daño estructural y requiere reembalaje.')."
        },
        boxCondition: {
          type: "STRING",
          description: "Integrity check of the external box. (Values: 'Good', 'Minor Damage', 'Severe Damage', 'Wet/Compromised')."
        },
        tapeQuality: {
          type: "STRING",
          description: "Quality of the sealing tape application. (Values: 'Adequate', 'Insufficient Tape', 'Poor Sealing', 'Incorrect Tape Type')."
        },
        labelPlacement: {
          type: "STRING",
          description: "Assessment of the shipping label (visibility, placement). (Values: 'Clear and Visible', 'Partially Obscured', 'Missing', 'Incorrect Placement')."
        },
        dimentionalCompliance: {
          type: "BOOLEAN",
          description: "Is the box visibly cuboid/rectangular and not misshapen (which would lead to dimensional penalty)? True/False."
        },
        hazmatAlert: {
          type: "BOOLEAN",
          description: "Does the image contain any visible Dangerous Goods (DG) markings or hazmat symbols (e.g., flammable, corrosive, toxic)? True/False."
        },
        actionRequired: {
          type: "STRING",
          description: "Specific immediate action required based on the findings, or 'None'. E.g., 'Reforzar el sellado con más cinta' or 'Reemplazar la caja dañada'."
        }
      },
      required: ["summaryReport", "boxCondition", "tapeQuality", "labelPlacement", "dimentionalCompliance", "hazmatAlert", "actionRequired"]
    };

    // 3. Craft the prompt for the AI
    const userPrompt = `
      Analiza la siguiente imagen de una caja de envío aéreo.
      
      **Mercancía Declarada:** ${commodity}.
      **Reglas de Embalaje Aplicables:** ${originalAdvice}.
      
      Usando estas reglas como contexto, evalúa la imagen para determinar si el embalaje es seguro, cumple con los requisitos mínimos de transporte aéreo (IATA) y si la etiqueta es legible. 
      
      Proporciona el resultado **EXCLUSIVAMENTE** en el formato JSON estructurado que se te ha solicitado. NO añadas texto explicativo fuera del campo 'summaryReport' del JSON.
    `;

    // 4. Construct the API payload
    const payload = {
      contents: [{
        parts: [{ text: userPrompt }, imagePart]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      },
    };

    // 5. Make the API call (with Exponential Backoff logic)
    let apiResponse;
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        const backoffDelay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        try {
            apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (apiResponse.ok) {
                break; // Exit loop on success
            } else if (i === maxRetries - 1) {
                const errorText = await apiResponse.text();
                throw new Error(`Fallo final de la API de Gemini: ${apiResponse.status} - ${errorText}`);
            }
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.warn(`Intento ${i + 1} fallido. Reintentando en ${backoffDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
    }
    
    // Check for API errors again after loop
    if (!apiResponse || !apiResponse.ok) {
        throw new Error("La API de Gemini falló después de múltiples reintentos.");
    }

    const result = await apiResponse.json();
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonText) {
      throw new Error("La respuesta de la IA no contiene un resultado JSON estructurado.");
    }
    
    // Parse the JSON string received from the model
    const validationResult = JSON.parse(jsonText);
    
    // 6. Send success response
    res.status(200).json({ 
        message: "Validación de embalaje con IA completada exitosamente.",
        validationResult 
    });

  } catch (error) {
    console.error("Error en el proceso de validación de IA:", error);
    res.status(500).json({ error: `Error en la validación de IA: ${error.message}` });
  } finally {
    // 7. ALWAYS clean up the temporary file created by Multer
    await unlink(imagePath).catch(err => console.error("Error al limpiar archivo temporal:", err));
  }
};

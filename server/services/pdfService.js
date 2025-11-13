import puppeteer from 'puppeteer';
// Importamos el BrowserFetcher de Puppeteer para obtener la ruta exacta del binario
import { BrowserFetcher, supportedProducts } from 'puppeteer/lib/esm/puppeteer/node/BrowserFetcher.js';


/**
 * @description Genera el contenido HTML para el informe de validación de SmartCargo.
 * El estilo está intencionalmente en línea o dentro de <style> para simplificar la generación de PDF.
 * @param {object} shipment - Objeto con los datos del envío (e.g., _id, createdAt, billingWeight, etc.).
 * @returns {string} El contenido HTML completo como una cadena.
 */
const generateHtmlContent = (shipment) => {
    // Nota: Se asume que shipment.createdAt es un objeto Date válido.
    const dateString = shipment.createdAt instanceof Date 
        ? shipment.createdAt.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) 
        : new Date().toLocaleDateString('es-ES');
    
    // Se asegura de que _id exista antes de intentar .toString() y .slice()
    const referenceId = shipment._id ? shipment._id.toString().slice(-6) : 'N/A';

    return `
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; line-height: 1.6; color: #333; }
                .header { 
                    background-color: #e0f2f1; 
                    padding: 25px; /* Más espacio */
                    border-radius: 10px; 
                    text-align: center; 
                    border-bottom: 5px solid #047857; /* Línea más gruesa */
                    margin-bottom: 40px; 
                }
                .header h1 { margin: 0; color: #047857; font-size: 2em; }
                .section { 
                    margin-top: 40px; 
                    padding-bottom: 20px; 
                }
                .section h3 {
                    color: #1f2937;
                    border-bottom: 2px solid #a3a3a3; /* Separador limpio */
                    padding-bottom: 8px;
                    margin-bottom: 20px; /* Espacio para el título */
                }
                /* Nueva clase para filas de datos limpias */
                .data-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px dashed #e5e7eb; 
                }
                .data-row:last-child {
                    border-bottom: none;
                }
                .label {
                    font-weight: 500;
                    color: #555;
                }
                .value {
                    font-weight: 700;
                    color: #047857;
                }
                .savings { 
                    color: #b91c1c; /* Color rojo para el potencial de ahorro */
                    font-weight: bold; 
                    font-size: 1.6em; 
                }
                .cost-box { 
                    border: 3px solid #3b82f6; /* Borde más grueso */
                    padding: 30px; /* Más padding */
                    border-radius: 12px; 
                    background-color: #eff6ff; 
                    margin-top: 35px; 
                }
                .cost-box h3, .cost-box h4 { 
                    margin-top: 0; 
                    margin-bottom: 20px; 
                }
                .disclaimer { 
                    font-size: 0.8em; 
                    color: #b91c1c; 
                    margin-top: 50px; 
                    border: 1px solid #fca5a5; 
                    padding: 15px; 
                    border-radius: 8px; 
                    background-color: #fef2f2; 
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 1px solid #ccc;
                    font-size: 0.75em;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SMARTCARGO ADVISORY</h1>
                <p style="font-size: 1.1em; color: #10B981;">INFORME DE VALIDACIÓN Y OPTIMIZACIÓN DE CARGA AÉREA</p>
                <p style="font-size: 0.9em;">**Ref: #${referenceId}** | **Fecha: ${dateString}**</p>
            </div>

            <div class="section">
                <h3>1. Resultados Clave y Optimización de Peso</h3>
                
                <div class="data-row">
                    <span class="label">Peso Real Declarado (Kg):</span>
                    <span class="value">${shipment.realWeight.toFixed(2)}</span>
                </div>
                <div class="data-row">
                    <span class="label">Peso Volumétrico Calculado (Kg):</span>
                    <span class="value">${shipment.calculatedDimWeight.toFixed(2)}</span>
                </div>
                <!-- Resaltado de la métrica clave -->
                <div class="data-row" style="background-color: #ccfbf1; border-radius: 4px; padding: 15px 10px;">
                    <span class="label" style="font-size: 1.1em; color: #047857;">PESO COBRABLE (Billing Weight):</span>
                    <span class="value" style="font-size: 1.3em; color: #047857;">${shipment.billingWeight.toFixed(2)} kg</span>
                </div>
                
                <div class="data-row" style="margin-top: 20px; border-top: 2px solid #fca5a5; padding-top: 15px;">
                    <span class="label">Ahorro Potencial Estimado por Optimización:</span>
                    <span class="savings">$${shipment.savingsEstimate.toFixed(2)} USD</span>
                </div>
            </div>
            
            <div class="cost-box">
                <h3 style="color: #3b82f6; margin-top: 0;">2. Detalles de la Asesoría y Documentación</h3>
                <div class="data-row" style="border-bottom: none;">
                    <span class="label">Estado Documental:</span>
                    <span class="value" style="color: ${shipment.documentsValid ? '#059669' : '#b91c1c'};">${shipment.documentsValid ? '✅ Documentos OK' : '❌ Documentos Pendientes de Revisión'}</span>
                </div>
                <p style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #93c5fd;"><strong>Sugerencias de SmartCargo:</strong></p>
                <p style="margin-top: 5px; color: #3b82f6; font-style: italic;">${shipment.optimizationSuggestions || 'No se encontraron sugerencias de optimización adicionales.'}</p>
                
                <h4 style="color: #3b82f6; margin-top: 30px; border-top: 2px dashed #93c5fd; padding-top: 15px; text-align: right;">
                    Tarifa de Asesoría (PAGO ÚNICO): <span class="savings" style="color: #3b82f6;">$${shipment.feeCharged.toFixed(2)} USD</span>
                </h4>
            </div>

            <div class="disclaimer">
                <h3>⚠️ CLÁUSULA LEGAL (CERO RIESGO OPERATIVO)</h3>
                <p>SmartCargo Advisory (May Roga LLC) proporciona <strong>ÚNICAMENTE ASESORÍA DIGITAL</strong> y cálculos volumétricos. NO se realiza ninguna manipulación, inspección física o embalaje de la mercancía. La responsabilidad legal por la documentación, el embalaje físico y el cumplimiento de normativas IATA/aduaneras recae **exclusivamente en el exportador/importador.**</p>
                <p style="margin-top: 15px; font-weight: bold;">Al realizar el pago, usted acepta estos términos de asesoría no física.</p>
            </div>
            
            <div class="footer">
                <p>SmartCargo Advisory | Contacto: advisory@smartcargo.com</p>
                <p>Confidencial - ${dateString}</p>
            </div>
        </body>
        </html>
    `;
};

/**
 * @description Inicia un navegador Puppeteer, genera un PDF a partir del HTML y lo devuelve como Buffer.
 * Incluye manejo de errores para garantizar que el navegador se cierre.
 * @param {object} shipment - Los datos del envío a incluir en el PDF.
 * @returns {Promise<Buffer>} El Buffer del PDF generado.
 * @throws {Error} Si Puppeteer falla al lanzar el navegador o generar el PDF.
 */
export const generateValidationPDF = async (shipment) => {
    let browser; 
    let executablePath;

    try {
        // Obtenemos la ruta exacta del binario de Chrome que instalamos en el paso 'build'
        const browserFetcher = new BrowserFetcher({ product: supportedProducts.chrome });
        // Usamos la revisión específica reportada en el error: 127.0.6533.88
        const revision = '127.0.6533.88'; 
        const revisionInfo = await browserFetcher.resolveBuildId(revision);
        
        // Si no se encuentra la revisión, volvemos a la ruta por defecto o lanzamos error
        if (revisionInfo && revisionInfo.executablePath) {
            executablePath = revisionInfo.executablePath;
        } else {
            console.warn(`No se encontró la revisión ${revision}. Usando ruta predeterminada.`);
            executablePath = puppeteer.executablePath(); 
        }

        // Configuración para la ejecución sin errores en entornos sin GUI (como Render o Docker)
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--single-process',
                '--disable-dev-shm-usage',
                '--disable-gpu' 
            ],
            executablePath: executablePath, // Usamos la ruta resuelta
            headless: 'new' 
        });
        
        const page = await browser.newPage();
        
        const htmlContent = generateHtmlContent(shipment);
        
        // Carga el contenido HTML
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Genera el PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, 
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
        });

        return pdfBuffer;

    } catch (error) {
        console.error('Error CRÍTICO al generar el PDF con Puppeteer:', error);
        throw new Error(`Fallo en la generación del PDF: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

import puppeteer from 'puppeteer';
// Importamos el BrowserFetcher de Puppeteer para obtener la ruta exacta del binario
import { BrowserFetcher, supportedProducts } from 'puppeteer/lib/esm/puppeteer/node/BrowserFetcher.js';


/**
 * @description Genera el contenido HTML para el informe de validación de SmartCargo.
 * El estilo está intencionalmente en línea o dentro de <style> para simplificar la generación de PDF.
 * El contenido se presenta de forma bilingüe (Inglés/Español) para cumplir con los estándares oficiales y la comodidad del cliente.
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

    // --- Lógica de procesamiento de sugerencias ---
    // El campo optimizationSuggestions ahora contiene la asesoría detallada separada por '|'
    const suggestionsString = shipment.optimizationSuggestions || '';
    
    // Separamos por '|', filtramos el aviso legal al final (separado por '||'), y generamos la lista HTML.
    const advisoryPoints = suggestionsString.split(' || ')[0].split(' | ');

    const advisoryHtml = advisoryPoints.map(s => {
        // Reemplaza los '**' para negritas que vienen del motor y envuelve en <li>
        return `<li>${s.replace(/\*\*/g, '<strong>')}</li>`;
    }).join('');
    // --- Fin de la lógica de procesamiento ---

    return `
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; line-height: 1.6; color: #333; }
                .header { 
                    background-color: #e0f2f1; 
                    padding: 25px; 
                    border-radius: 10px; 
                    text-align: center; 
                    border-bottom: 5px solid #047857; 
                    margin-bottom: 30px; 
                }
                .header h1 { margin: 0; color: #047857; font-size: 2em; }
                .header .subtitle-en { font-size: 1.1em; color: #10B981; margin-bottom: 5px; }
                .header .subtitle-es { font-size: 0.9em; color: #555; margin-top: 0; }
                
                .section { 
                    margin-top: 40px; 
                    padding-bottom: 20px; 
                }
                .section h3 {
                    color: #1f2937;
                    border-bottom: 2px solid #a3a3a3; 
                    padding-bottom: 8px;
                    margin-bottom: 20px; 
                }
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
                    color: #b91c1c; 
                    font-weight: bold; 
                    font-size: 1.6em; 
                }
                .cost-box { 
                    border: 3px solid #3b82f6; 
                    padding: 30px; 
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
                .value-prop-box {
                    background-color: #fce7f3; 
                    border: 3px solid #db2777; 
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .value-prop-box h2 {
                    color: #9d174d; 
                    margin-top: 0;
                    font-size: 1.5em;
                }
                .value-prop-box p {
                    font-weight: 600;
                    color: #4a044e;
                }

                .risk-section {
                    margin-top: 40px;
                    padding: 25px;
                    background-color: #fffbe6; 
                    border: 2px solid #fbbf24;
                    border-radius: 10px;
                }
                .risk-section h3 {
                    color: #b45309;
                    border-bottom: 2px solid #fbbf24;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                }
                .risk-section ul {
                    list-style: none;
                    padding: 0;
                }
                .risk-section li {
                    margin-bottom: 10px;
                    font-size: 0.95em;
                }
                .risk-section li::before {
                    content: "🛑"; 
                    margin-right: 10px;
                }
                
                .advisory-list {
                    list-style: none;
                    padding-left: 0;
                    margin-top: 15px;
                }
                .advisory-list li {
                    background-color: #e3f2fd; 
                    border-left: 4px solid #3b82f6; 
                    padding: 10px 15px;
                    margin-bottom: 8px;
                    border-radius: 4px;
                    line-height: 1.4;
                    font-size: 0.9em;
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
                <p class="subtitle-en">VALIDATION AND OPTIMIZATION REPORT</p>
                <p class="subtitle-es">(INFORME DE VALIDACIÓN Y OPTIMIZACIÓN DE CARGA AÉREA)</p>
                <p style="font-size: 0.9em;">**Ref: #${referenceId}** | **Date / Fecha: ${dateString}**</p>
            </div>

            <!-- SECCIÓN DE VALOR CENTRAL: Enfoque en la Seguridad -->
            <div class="value-prop-box">
                <h2>✅ ZERO OPERATIONAL RISK GUARANTEE: YOUR INVESTMENT IS PROTECTED</h2>
                <p>SmartCargo goes beyond weight. **Buy total peace of mind and efficiency** by eliminating the most expensive problems: fines, detentions, and cargo rejection at the ramp.</p>
                <p style="font-size: 0.8em; color: #9d174d; font-weight: 500;">
                    (GARANTÍA CERO RIESGO OPERACIONAL: SU INVERSIÓN ESTÁ PROTEGIDA. Compre tranquilidad y eficiencia total.)
                </p>
            </div>

            <div class="section">
                <h3>1. Key Results and Weight Optimization</h3>
                <p style="font-size: 0.9em; color: #555;">(Resultados Clave y Optimización de Peso)</p>
                
                <div class="data-row">
                    <span class="label">Declared Actual Weight (Kg) / Peso Real Declarado (Kg):</span>
                    <span class="value">${shipment.realWeight.toFixed(2)}</span>
                </div>
                <div class="data-row">
                    <span class="label">Calculated Dimensional Weight (Kg) / Peso Volumétrico Calculado (Kg):</span>
                    <span class="value">${shipment.calculatedDimWeight.toFixed(2)}</span>
                </div>
                <!-- Resaltado de la métrica clave -->
                <div class="data-row" style="background-color: #ccfbf1; border-radius: 4px; padding: 15px 10px;">
                    <span class="label" style="font-size: 1.1em; color: #047857;">CHARGEABLE WEIGHT (Billing Weight) / PESO COBRABLE:</span>
                    <span class="value" style="font-size: 1.3em; color: #047857;">${shipment.billingWeight.toFixed(2)} kg</span>
                </div>
                
                <div class="data-row" style="margin-top: 20px; border-top: 2px solid #fca5a5; padding-top: 15px;">
                    <span class="label">Estimated Potential Savings for Optimization / Ahorro Potencial Estimado por Optimización:</span>
                    <span class="savings">$${shipment.savingsEstimate.toFixed(2)} USD</span>
                </div>
            </div>
            
            <div class="cost-box">
                <h3>2. 360 Logistics Advisory and Documentation</h3>
                <p style="font-size: 0.9em; color: #555;">(Asesoría Logística 360 y Documentación)</p>
                <div class="data-row" style="border-bottom: none;">
                    <span class="label">SmartCargo Document Status / Estado Documental SmartCargo:</span>
                    <span class="value" style="color: ${shipment.documentsValid ? '#059669' : '#b91c1c'};">${shipment.documentsValid ? '✅ Documents OK' : '❌ Documents Pending Review'}</span>
                </div>

                <p style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #93c5fd;"><strong>Detailed SmartCargo Analysis:</strong> (Análisis Detallado de SmartCargo:)</p>
                <!-- Lista de Sugerencias Detalladas (Embalaje, Consolidación, DG) - Contenido del motor en español. -->
                <ul class="advisory-list">
                    ${advisoryHtml}
                </ul>

                <h4 style="color: #3b82f6; margin-top: 30px; border-top: 2px dashed #93c5fd; padding-top: 15px; text-align: right;">
                    Advisory Fee (ONE TIME PAYMENT): <span class="savings" style="color: #3b82f6;">$${shipment.feeCharged.toFixed(2)} USD</span>
                </h4>
                 <p style="font-size: 0.8em; color: #3b82f6; text-align: right;">(Tarifa de Asesoría - PAGO ÚNICO)</p>
            </div>

            <div class="risk-section">
                <h3>3. Warning: What you AVOIDED by using SmartCargo</h3>
                <p style="font-size: 0.9em; color: #555;">(Advertencia: Lo que ha EVITADO al usar SmartCargo)</p>
                <p>Our validation **protects your operation and the airline's** (e.g., Avianca Cargo, LATAM Cargo) against the 4 major risks:</p>
                <ul>
                    <li>**🛑 Loss of Money due to Fines:** (Pérdida de Dinero por Multas) Unexpected charges due to incorrect documentation or misclassification.</li>
                    <li>**🛑 Cargo Detention (HOLD):** (Retención de Carga) Eliminating the main cause of delays at customs and ramp, ensuring **on-time delivery**.</li>
                    <li>**🛑 Freight Rejection/Diversion:** (Rechazo/Viraje del Flete) Preventing merchandise from being returned to origin for non-compliance with IATA regulations.</li>
                    <li>**🛑 DG Risk:** (Riesgo DG) Key advisory to avoid disasters and penalties for improper handling of Dangerous Goods.</li>
                </ul>
            </div>
            

            <div class="disclaimer">
                <h3>⚠️ LEGAL CLAUSE (ZERO OPERATIONAL RISK)</h3>
                <p>SmartCargo Advisory (May Roga LLC) provides <strong>ONLY DIGITAL ADVISORY</strong> and volumetric calculations. **NO physical handling or inspection** is performed on the merchandise.</p>
                <p>La responsabilidad legal por la documentación, el embalaje físico y el cumplimiento de normativas IATA/aduaneras recae **exclusivamente en el exportador/importador.**</p>
                <p style="margin-top: 15px; font-weight: bold;">By making the payment, you accept these terms of non-physical advisory. (Al realizar el pago, usted acepta estos términos de asesoría no física.)</p>
            </div>
            
            <div class="footer">
                <p>SmartCargo Advisory | Contact: advisory@smartcargo.com</p>
                <p>Confidential / Confidencial - ${dateString}</p>
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

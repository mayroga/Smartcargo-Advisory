import puppeteer from 'puppeteer';

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
                .header { background-color: #e0f2f1; padding: 20px; border-radius: 8px; text-align: center; border-bottom: 4px solid #047857; }
                .header h1 { margin: 0; color: #047857; }
                .section { margin-top: 35px; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px; }
                .savings { color: #059669; font-weight: bold; font-size: 1.6em; display: block; margin-top: 5px; }
                .cost-box { border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; background-color: #eff6ff; margin-top: 25px; }
                .cost-box h3, .cost-box h4 { margin-top: 5px; margin-bottom: 15px; }
                .disclaimer { font-size: 0.85em; color: #b91c1c; margin-top: 40px; border: 2px solid #fca5a5; padding: 20px; border-radius: 8px; background-color: #fef2f2; }
                strong { color: #1f2937; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SMARTCARGO ADVISORY</h1>
                <p style="font-size: 1.1em;">INFORME DE VALIDACIÓN Y OPTIMIZACIÓN DE CARGA AÉREA</p>
                <p style="font-size: 0.9em;">**Ref: #${referenceId}** | **Fecha: ${dateString}**</p>
            </div>

            <div class="section">
                <h3 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px;">1. Resultados de Optimización</h3>
                <p><strong>Peso Cobrable (Final):</strong> ${shipment.billingWeight.toFixed(2)} kg</p>
                <p><strong>Peso Volumétrico Calculado:</strong> ${shipment.calculatedDimWeight.toFixed(2)} kg</p>
                <p><strong>Ahorro Estimado Logrado (por Asesoría):</strong> <span class="savings">$${shipment.savingsEstimate.toFixed(2)} USD</span></p>
            </div>
            
            <div class="cost-box">
                <h3 style="color: #3b82f6;">2. Detalles del Servicio de Asesoría</h3>
                <p><strong>Estado Documental:</strong> ${shipment.documentsValid ? '✅ Documentos OK' : '❌ Documentos Pendientes de Revisión'}</p>
                <p><strong>Sugerencias de SmartCargo:</strong> ${shipment.optimizationSuggestions || 'No se encontraron sugerencias de optimización adicionales.'}</p>
                <h4 style="color: #3b82f6; margin-top: 20px; border-top: 1px dashed #3b82f6; padding-top: 10px;">Tarifa de Asesoría (PAGO ÚNICO): $${shipment.feeCharged.toFixed(2)} USD</h4>
            </div>

            <div class="disclaimer">
                <h3>⚠️ DISPONIBILIDAD Y CLÁUSULA LEGAL (CERO RIESGO OPERATIVO)</h3>
                <p>SmartCargo Advisory (May Roga LLC) proporciona <strong>ÚNICAMENTE ASESORÍA DIGITAL</strong> y cálculos volumétricos. NO se realiza ninguna manipulación, inspección física o embalaje de la mercancía. La responsabilidad legal por la documentación, el embalaje físico y el cumplimiento de normativas IATA/aduaneras recae **exclusivamente en el exportador/importador.**</p>
                <p style="margin-top: 15px; font-weight: bold;">Al realizar el pago, usted acepta estos términos de asesoría no física.</p>
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
    let browser; // Declarado fuera del try para que sea accesible en finally

    try {
        // Configuración para la ejecución sin errores en entornos sin GUI (como Render o Docker)
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--single-process', // A veces ayuda en entornos de bajos recursos
                '--disable-dev-shm-usage' // Importante para entornos limitados como Render
            ],
            headless: 'new' // 'new' es el modo headless más reciente
        });
        
        const page = await browser.newPage();
        
        const htmlContent = generateHtmlContent(shipment);
        
        // Carga el contenido HTML y espera hasta que no haya conexiones de red durante 500ms
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Genera el PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Importante para que los colores de fondo se muestren
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
        });

        // Devuelve el Buffer del PDF
        return pdfBuffer;

    } catch (error) {
        console.error('Error CRÍTICO al generar el PDF con Puppeteer:', error);
        // Propaga el error para que la función que llama lo maneje
        throw new Error(`Fallo en la generación del PDF: ${error.message}`);
    } finally {
        // Asegura que el navegador se cierre SIEMPRE, incluso después de un error.
        if (browser) {
            await browser.close();
        }
    }
};

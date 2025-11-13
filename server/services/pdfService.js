const puppeteer = require('puppeteer');

// HTML altamente enfocado en el Disclaimer Legal y los resultados.
const generateHtmlContent = (shipment) => {
    return `
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; line-height: 1.6; }
                .header { background-color: #e0f2f1; padding: 20px; border-radius: 8px; text-align: center; }
                .section { margin-top: 25px; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px; }
                .savings { color: #059669; font-weight: bold; font-size: 1.5em; }
                .cost-box { border: 2px solid #3b82f6; padding: 15px; border-radius: 6px; background-color: #eff6ff; }
                .disclaimer { font-size: 0.8em; color: #b91c1c; margin-top: 30px; border: 2px solid #fca5a5; padding: 15px; border-radius: 6px; background-color: #fef2f2; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="color: #047857;">SMARTCARGO ADVISORY</h1>
                <p>INFORME DE VALIDACIÓN Y OPTIMIZACIÓN DE CARGA AÉREA</p>
                <p>Ref: #${shipment._id.toString().slice(-6)} | Fecha: ${shipment.createdAt.toLocaleDateString()}</p>
            </div>

            <div class="section">
                <h3 style="color: #333;">1. Resultados de Optimización</h3>
                <p><strong>Peso Cobrable (Final):</strong> ${shipment.billingWeight.toFixed(2)} kg</p>
                <p><strong>Peso Volumétrico Calculado:</strong> ${shipment.calculatedDimWeight.toFixed(2)} kg</p>
                <p><strong>Ahorro Estimado Logrado (por Asesoría):</strong> <span class="savings">$${shipment.savingsEstimate.toFixed(2)} USD</span></p>
            </div>
            
            <div class="section cost-box">
                <h3 style="color: #3b82f6;">2. Detalles del Servicio de Asesoría</h3>
                <p><strong>Estado Documental:</strong> ${shipment.documentsValid ? '✅ Documentos OK' : '❌ Documentos Pendientes de Revisión'}</p>
                <p><strong>Sugerencias de SmartCargo:</strong> ${shipment.optimizationSuggestions}</p>
                <h4 style="color: #3b82f6; margin-top: 10px;">Tarifa de Asesoría (PAGO ÚNICO): $${shipment.feeCharged.toFixed(2)} USD</h4>
            </div>

            <div class="disclaimer">
                <h3>⚠️ DISPONIBILIDAD Y CLÁUSULA LEGAL (CERO RIESGO OPERATIVO)</h3>
                <p>SmartCargo Advisory (May Roga LLC) proporciona <strong>ÚNICAMENTE ASESORÍA DIGITAL</strong> y cálculos volumétricos. NO se realiza ninguna manipulación, inspección física o embalaje de la mercancía. La responsabilidad legal por la documentación, el embalaje físico y el cumplimiento de normativas IATA/aduaneras recae **exclusivamente en el exportador/importador.**</p>
                <p>Al realizar el pago, usted acepta estos términos de asesoría no física.</p>
            </div>
        </body>
        </html>
    `;
};

const generateValidationPDF = async (shipment) => {
    // Configuración para la ejecución sin errores en Render (Linux)
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: 'new' 
    });
    const page = await browser.newPage();
    
    const htmlContent = generateHtmlContent(shipment);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });

    await browser.close();
    return pdfBuffer;
};

module.exports = { generateValidationPDF };

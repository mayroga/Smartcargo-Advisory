const puppeteer = require('puppeteer');

// Función que genera el HTML del informe (simplificado)
const generateHtmlContent = (shipment) => {
    return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; }
                .section { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
                .savings { color: #059669; font-weight: bold; font-size: 1.2em; }
                .disclaimer { font-size: 0.75em; color: #ef4444; margin-top: 30px; border: 1px dashed #ef4444; padding: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>SMARTCARGO ADVISORY - INFORME DE VALIDACIÓN</h2>
                <p>Referencia: #${shipment._id.toString().slice(-6)} | Cliente: ${shipment.clientEmail}</p>
            </div>

            <div class="section">
                <h3>1. Resumen de Optimización</h3>
                <p><strong>Ahorro Estimado:</strong> <span class="savings">$${shipment.savingsEstimate.toFixed(2)} USD</span></p>
                <p><strong>Peso Cobrable (Final):</strong> ${shipment.billingWeight.toFixed(2)} kg</p>
                <p><strong>Sugerencias:</strong> ${shipment.optimizationSuggestions}</p>
            </div>
            
            <div class="section">
                <h3>2. Estado Documental</h3>
                <p><strong>Verificación:</strong> ${shipment.documentsValid ? '✅ OK' : '❌ PENDIENTE DE CORRECCIÓN'}</p>
                <p><strong>Tarifa de Asesoría:</strong> $${shipment.feeCharged.toFixed(2)} USD</p>
            </div>

            <div class="disclaimer">
                ⚠️ **DISCLAIMER LEGAL Y CERO CONTACTO FÍSICO:** SmartCargo Advisory (May Roga LLC) proporciona ÚNICAMENTE asesoría documental y de cálculo volumétrico en base a los datos proporcionados por el cliente. NO se manipula, inspecciona físicamente, ni se certifica la carga peligrosa. La responsabilidad del embalaje y cumplimiento de normativas aduaneras recae totalmente en el cliente.
            </div>
        </body>
        </html>
    `;
};

const generateValidationPDF = async (shipment) => {
    // Usar 'launch' para Render (que es un entorno Linux)
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // headless: 'new' // Usar modo headless para producción
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

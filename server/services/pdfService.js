import puppeteer from 'puppeteer-core'; // <--- ¡CRÍTICO! DEBE SER -CORE

// CRITICAL FIX: Use the environment variable to point to the Chromium binary path.
// This is essential for deployment environments like Render where the default path is not found.
const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || null; 

/**
 * Generates a professional validation PDF report for the cargo shipment.
 * @param {object} shipmentData - The validated shipment data containing calculation results.
 * @returns {Buffer} - The generated PDF buffer.
 */
export async function generateValidationPDF(shipmentData) {
    let browser;
    try {
        if (!executablePath) {
            console.warn('[PDF Service] PUPPETEER_EXECUTABLE_PATH is not set. Relying on default discovery (may fail in production).');
        }
        
        console.log(`[PDF Service] Attempting to launch browser using path: ${executablePath || 'default'}`);

        // Launch Puppeteer with necessary arguments for a headless Linux environment (Render)
        browser = await puppeteer.launch({
            executablePath: executablePath, // Pass the system-configured path
            headless: 'new', // Use the 'new' headless mode
            args: [
                '--no-sandbox',             // CRITICAL: Required in shared/containerized environments
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage', // Helps prevent memory issues
                '--single-process'         // Optional: May help stability
            ],
            ignoreDefaultArgs: ['--disable-extensions'],
        });

        const page = await browser.newPage();
        
        // --- PDF HTML Content Generation (Mockup for Report) ---
        // In a real application, this would format the report data beautifully.
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { background-color: #047857; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                    .disclaimer { border: 2px solid #ef4444; padding: 10px; color: #b91c1c; border-radius: 6px; margin-top: 20px; font-size: 0.8em; }
                    h1 { font-size: 1.5em; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SmartCargo Validation Report - Compliance Check</h1>
                </div>
                <h2>Shipment Details</h2>
                <p><strong>Client Email:</strong> ${shipmentData.clientEmail}</p>
                <p><strong>Destination:</strong> ${shipmentData.destination}</p>
                <p><strong>Pieces:</strong> ${shipmentData.pieces}</p>

                <h2>Operational Results (ZERO ERROR)</h2>
                <p><strong>Actual Weight:</strong> ${shipmentData.realWeight} Kg</p>
                <p><strong>Dimensional Weight:</strong> ${shipmentData.dimWeight.toFixed(2)} Kg</p>
                <p><strong>Billable Weight:</strong> ${shipmentData.billingWeight.toFixed(2)} Kg (Chargeable)</p>
                <p><strong>Estimated Pallets Needed:</strong> ${shipmentData.calculatedPallets}</p>

                ${shipmentData.isDangerousGoods ? `
                    <h2>Preliminary DG Guidance (REFERENCE ONLY)</h2>
                    <p><strong>UN Number:</strong> UN ${shipmentData.unNumber}</p>
                    <p><strong>Primary Class:</strong> ${shipmentData.dgClassPrimary}</p>
                    <div class="disclaimer">
                        <strong>⚠️ LIABILITY WARNING:</strong> This DG information is preliminary and informational only. 
                        It does not replace a certified Shipper's Declaration or the inspection by certified DG personnel. 
                        The user assumes full responsibility for IATA and customs compliance.
                    </div>
                ` : '<h2>Status: Non-Dangerous Goods Shipment</h2>'}

            </body>
            </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({ 
            format: 'A4',
            printBackground: true, // Ensure colors/styles are included
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
        });

        return pdfBuffer;

    } catch (error) {
        console.error("CRITICAL PDF GENERATION FAILURE:", error);
        // Re-throw the error with better context
        throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

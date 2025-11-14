// server/services/pdfService.js
import puppeteer from 'puppeteer-core'; // use core in containerized env
import 'dotenv/config';

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || null;

export async function generateValidationPDF(shipmentData) {
    let browser;
    try {
        const launchOptions = {
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage'
            ]
        };
        if (executablePath) {
            launchOptions.executablePath = executablePath;
        }

        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        // Ensure safe access to numeric fields
        const dimWeight = Number(shipmentData.calculatedDimWeight || 0);
        const billing = Number(shipmentData.billingWeight || 0);
        const pallets = Number(shipmentData.calculatedPallets || 1);

        const htmlContent = `
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8" />
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
                .header { background:#047857; color:white; padding:12px; border-radius:8px; }
                h1 { margin: 0; font-size: 20px; }
                .section { margin-top:18px; }
                .disclaimer { border:1px solid #f87171; padding:8px; color:#991b1b; border-radius:6px; background:#fee2e2; }
                table { width:100%; border-collapse: collapse; margin-top:10px; }
                td, th { padding:8px; border-bottom:1px solid #eee; text-align:left; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>SmartCargo Advisory - Validation Report</h1>
              </div>

              <div class="section">
                <h2>Shipment</h2>
                <p><strong>Client Email:</strong> ${shipmentData.clientEmail}</p>
                <p><strong>Destination:</strong> ${shipmentData.destination}</p>
                <p><strong>Pieces:</strong> ${shipmentData.pieces || 1}</p>
              </div>

              <div class="section">
                <h2>Operational Results</h2>
                <table>
                  <tr><th>Actual Weight</th><td>${Number(shipmentData.realWeight).toFixed(2)} Kg</td></tr>
                  <tr><th>Dimensional Weight</th><td>${dimWeight.toFixed(2)} Kg</td></tr>
                  <tr><th>Billable Weight</th><td>${billing.toFixed(2)} Kg</td></tr>
                  <tr><th>Estimated Pallets</th><td>${pallets}</td></tr>
                  <tr><th>Estimated Savings</th><td>$${Number(shipmentData.savingsEstimate || 0).toFixed(2)} USD</td></tr>
                  <tr><th>Fee Charged</th><td>$${Number(shipmentData.feeCharged || 0).toFixed(2)} USD</td></tr>
                </table>
              </div>

              <div class="section">
                <h2>Recommendations</h2>
                <p>${shipmentData.optimizationSuggestions}</p>
              </div>

              ${shipmentData.isDangerousGoods ? `
                <div class="section">
                  <h2>Dangerous Goods - Preliminary Reference</h2>
                  <p><strong>UN:</strong> ${shipmentData.unNumber || '---'}</p>
                  <p><strong>Class:</strong> ${shipmentData.dgClassPrimary || '---'}</p>
                  <div class="disclaimer"><strong>⚠️ IMPORTANT:</strong> This is a preliminary, non-certified reference only. Final DG compliance requires certified personnel and Shipper's Declaration.</div>
                </div>
              ` : ''}

              <div style="font-size:11px;color:#666;margin-top:20px;">
                This report expires at: ${new Date(shipmentData.pdfExpiresAt).toLocaleString() || 'N/A'}
              </div>
            </body>
          </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
        });

        return pdfBuffer;

    } catch (err) {
        console.error('PDF generation error:', err);
        throw new Error(`PDF generation failed: ${err.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

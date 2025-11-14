import puppeteer from 'puppeteer-core';

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || null;

export async function generateValidationPDF(shipmentData){
    let browser;
    try{
        browser = await puppeteer.launch({
            executablePath: executablePath,
            headless:'new',
            args:[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage'
            ],
            ignoreDefaultArgs:['--disable-extensions']
        });

        const page = await browser.newPage();

        const htmlContent = `
            <html>
            <head>
                <style>
                    body{font-family:Arial,sans-serif;padding:20px;}
                    .header{background-color:#047857;color:white;padding:15px;border-radius:8px;margin-bottom:20px;}
                    .disclaimer{border:2px solid #ef4444;padding:10px;color:#b91c1c;border-radius:6px;margin-top:20px;font-size:0.8em;}
                </style>
            </head>
            <body>
                <div class="header"><h1>SmartCargo Validation Report</h1></div>
                <h2>Shipment Details</h2>
                <p><strong>Email:</strong> ${shipmentData.clientEmail}</p>
                <p><strong>Destino:</strong> ${shipmentData.destination}</p>
                <p><strong>Peso Real:</strong> ${shipmentData.realWeight} Kg</p>
                <p><strong>Peso Dimensional:</strong> ${shipmentData.calculatedDimWeight.toFixed(2)} Kg</p>
                <p><strong>Peso Facturable:</strong> ${shipmentData.billingWeight.toFixed(2)} Kg</p>
                <p><strong>Tarifa de Asesoría:</strong> $${shipmentData.feeCharged.toFixed(2)}</p>
                ${shipmentData.isDangerousGoods ? `<div class="disclaimer">⚠️ Mercancía Peligrosa. Información preliminar.</div>` : ''}
            </body>
            </html>
        `;

        await page.setContent(htmlContent, { waitUntil:'networkidle0' });

        const pdfBuffer = await page.pdf({
            format:'A4',
            printBackground:true,
            margin:{ top:'1cm', right:'1cm', bottom:'1cm', left:'1cm' }
        });

        return pdfBuffer;

    } catch(error){
        console.error("PDF GENERATION FAILURE:", error);
        throw new Error(`PDF generation failed: ${error.message}`);
    } finally{
        if(browser) await browser.close();
    }
}

import nodemailer from 'nodemailer'; // Importación cambiada
import 'dotenv/config';

// Configuración para SendGrid con Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net', 
    port: 587,
    secure: false, // usa TLS
    auth: {
        user: 'apikey', // SendGrid requiere 'apikey' como usuario
        pass: process.env.SENDGRID_API_KEY
    }
});

/**
 * Envía el email con el informe PDF adjunto y el enlace de descarga/pago.
 */
const sendValidationEmail = async (shipment, pdfBuffer, clientSecret) => {
    // Enlace que activa la descarga del PDF (que contiene la info de pago si aplica)
    const downloadLink = `${process.env.BASE_URL}/download/${shipment.pdfToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: shipment.clientEmail,
        subject: `Informe de Validación SmartCargo #${shipment._id.toString().slice(-6)}`,
        html: `
            <p>Estimado Cliente,</p>
            <p>Adjuntamos el Informe de Validación y Optimización de Carga. Por favor, haz clic para descargar el PDF y ver los resultados, sugerencias de ahorro y la tarifa del servicio.</p>
            <p><strong>Tarifa de Asesoría: $${shipment.feeCharged.toFixed(2)} USD.</strong></p>
            
            <a href="${downloadLink}" style="background-color: #10B981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Ver Informe y Pagar Tarifa de Asesoría
            </a>
            
            <p style="margin-top: 25px; font-size: 13px; color: gray;">
                AVISO LEGAL: Esta asesoría se basa únicamente en los datos proporcionados. SmartCargo Advisory **NO manipula físicamente** la mercancía.
            </p>
            <p style="font-size: 13px; color: red;">
                El enlace de descarga expira en 72 horas.
            </p>
        `,
        attachments: [{
            filename: `SmartCargo_Reporte_${shipment._id.toString().slice(-6)}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
        }]
    };

    // Esto lanzará el email a través de SendGrid
    return transporter.sendMail(mailOptions);
};

export { sendValidationEmail }; // Exportación nombrada cambiada

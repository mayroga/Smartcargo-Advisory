const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Configuración para SendGrid (o cualquier SMTP)
    host: 'smtp.sendgrid.net', 
    port: 587,
    secure: false, // use TLS
    auth: {
        user: 'apikey', // SendGrid requiere 'apikey' como usuario
        pass: process.env.SENDGRID_API_KEY
    }
});

const sendValidationEmail = async (shipment, pdfBuffer, clientSecret) => {
    const downloadLink = `${process.env.BASE_URL}/download/${shipment.pdfToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: shipment.clientEmail,
        subject: `Informe de Validación SmartCargo #${shipment._id.toString().slice(-6)}`,
        html: `
            <p>Estimado Cliente,</p>
            <p>Adjuntamos el Informe de Validación y Optimización de Carga. Encontrará sugerencias de ahorro y la verificación de documentos.</p>
            <p>Para desbloquear el informe y acceder al enlace de pago, por favor haz clic en el botón de pago si la tarifa aplica.</p>
            <p><strong>Tarifa del Servicio: $${shipment.feeCharged.toFixed(2)} USD.</strong></p>
            
            <a href="${downloadLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Informe y Pagar
            </a>
            
            <p style="margin-top: 20px; font-size: 12px; color: gray;">
                AVISO LEGAL: Este informe es una asesoría documental. SmartCargo Advisory no manipula físicamente la mercancía y la responsabilidad por la carga recae en el exportador/importador.
            </p>
            <p style="font-size: 12px; color: red;">
                El enlace expira en 72 horas (${shipment.pdfExpiresAt.toLocaleString()}).
            </p>
        `,
        attachments: [{
            filename: `SmartCargo_Reporte_${shipment._id.toString().slice(-6)}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
        }]
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendValidationEmail };

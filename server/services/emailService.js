import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth:{
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});

const sendValidationEmail = async (shipment, pdfBuffer, clientSecret) => {
    const downloadLink = `${process.env.BASE_URL}/download/${shipment.pdfToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: shipment.clientEmail,
        subject: `Informe SmartCargo #${shipment._id.toString().slice(-6)}`,
        html: `
            <p>Estimado Cliente,</p>
            <p>Adjuntamos el Informe de Validación y Optimización de Carga.</p>
            <p><strong>Tarifa de Asesoría: $${shipment.feeCharged.toFixed(2)} USD</strong></p>
            <a href="${downloadLink}" style="background-color: #10B981; color:white; padding:12px 25px; text-decoration:none; border-radius:6px; font-weight:bold;">Ver Informe y Pagar</a>
            <p style="margin-top:25px; font-size:13px; color:gray;">
                AVISO LEGAL: Asesoría basada en datos proporcionados. SmartCargo **NO manipula físicamente** la mercancía.
            </p>
            <p style="font-size:13px; color:red;">El enlace expira en 72 horas.</p>
        `,
        attachments:[{
            filename:`SmartCargo_Reporte_${shipment._id.toString().slice(-6)}.pdf`,
            content: pdfBuffer,
            contentType:'application/pdf'
        }]
    };

    return transporter.sendMail(mailOptions);
};

export { sendValidationEmail };

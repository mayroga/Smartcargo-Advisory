// server/services/emailService.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

if (!process.env.SENDGRID_API_KEY) {
  console.warn('[WARN] SENDGRID_API_KEY not set. Email sending will likely fail.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

export const sendValidationEmail = async (shipment, pdfBuffer, clientSecret) => {
  const downloadLink = `${process.env.BASE_URL || 'https://yourdomain.example'}/download/${shipment.pdfToken}`;

  const mailOptions = {
    from: process.env.EMAIL_SENDER || 'no-reply@smartcargo.example',
    to: shipment.clientEmail,
    subject: `SmartCargo Validation Report #${shipment._id.toString().slice(-6)}`,
    html: `
      <p>Estimado cliente,</p>
      <p>Adjuntamos su Informe de Validación. Haga clic para descargar y pagar la tarifa de asesoría si aún no lo ha hecho.</p>
      <p><strong>Tarifa de asesoría: $${shipment.feeCharged.toFixed(2)} USD</strong></p>
      <a href="${downloadLink}" style="background:#10B981;color:white;padding:12px 18px;border-radius:6px;text-decoration:none;display:inline-block">Ver Informe y Pagar</a>
      <p style="color:red;font-size:12px;">El enlace expira en 72 horas.</p>
      <p style="font-size:12px;color:gray;">Aviso legal: Asesoría preliminar basada en datos declarados. No inspección física.</p>
    `,
    attachments: [
      {
        filename: `SmartCargo_Report_${shipment._id.toString().slice(-6)}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  return transporter.sendMail(mailOptions);
};

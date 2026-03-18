import nodemailer from 'nodemailer';

/**
 * Configuración del transporte de correo.
 * Se recomienda usar Mailtrap para desarrollo y 
 * servicios como SendGrid, Mailgun o Gmail (con App Password) para producción.
 */
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: false, // true para puerto 465, false para otros (587)
  auth: {
    user: process.env.EMAIL_USER, // Tu correo: ejemplo@gmail.com
    pass: process.env.EMAIL_PASS, // Tu Contraseña de Aplicación de 16 dígitos
  },
  // Esto ayuda a evitar errores de certificados en algunos entornos de desarrollo
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Función opcional para verificar la conexión al arrancar el servidor
 */
export const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log('✅ Mailer: Conexión establecida con éxito');
  } catch (error) {
    console.error('❌ Mailer: Error al conectar con el servidor de correo:', error);
  }
};
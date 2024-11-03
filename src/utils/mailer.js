const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
    try {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    } catch (error) {
        console.error('Error al crear el transportador de correo:', error);
        throw new Error('Error en la configuración del servicio de correo');
    }
};

const emailTemplate = (verificationUrl, deleteUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .delete-button {
            background-color: #f44336;
        }
        .container {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Verificación de Cuenta</h2>
        <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu correo electrónico.</p>
        
        <a href="${verificationUrl}" class="button">
            Verificar mi correo electrónico
        </a>

        <p style="margin-top: 30px;">Si no creaste esta cuenta, puedes eliminarla haciendo clic aquí:</p>
        
        <a href="${deleteUrl}" class="button delete-button">
            Eliminar cuenta
        </a>

        <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            ${verificationUrl}
        </p>

        <p style="font-size: 12px; color: #666;">
            Este enlace expirará en 10 minutos por razones de seguridad.
        </p>
    </div>
</body>
</html>
`;

const sendVerificationEmail = async (email, token) => {
    if (!process.env.BASE_URL || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Variables de entorno no configuradas correctamente');
    }

    try {
        const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
        const deleteUrl = `${process.env.BASE_URL}/delete-user?token=${token}`;
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Verificación de Cuenta" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verifica tu dirección de correo electrónico',
            html: emailTemplate(verificationUrl, deleteUrl),
            text: `Por favor verifica tu correo electrónico visitando: ${verificationUrl}\nPara eliminar tu cuenta visita: ${deleteUrl}`, // Versión texto plano
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado exitosamente:', info.messageId);
        
        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        console.error('Error al enviar el email de verificación:', error);
        throw new Error('Error al enviar el email de verificación');
    }
};

module.exports = {
    sendVerificationEmail
};
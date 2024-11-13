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
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #232557;
            padding:5%;
            text-align: center;
        }
        .logo-text {
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        .logo-text img {
            width: 40px;
            border-radius: 50%;
        }
        .logo-text h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
        }
        .image-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }
        .image-row img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
        .content {
            padding: 20px;
            text-align: center;
            color: #666666;
        }
        .content p {
            font-size: 16px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 10px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .button-confirm {
            color: #ffffff;
            background-color: #4CAF50;
        }
        .button-confirm:hover {
            background-color: #45a049;
        }
        .button-delete {
            color: #ffffff;
            background-color: #f44336;
        }
        .button-delete:hover {
            background-color: #d32f2f;
        }
        .footer {
            font-size: 12px;
            color: #999999;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with logo and text -->
        <div class="header">
            <div class="logo-text">
                <img src="https://res.cloudinary.com/dkwulpnkt/image/upload/v1730681515/logo_u7zvk1.png" alt="Logo">
                <h1>Spike</h1>
            </div>
        </div>
        
        <!-- Content with the confirmation message -->
        <div class="content">
            <p>Gracias por unirte a nuestra comunidad para cuidar a nuestras mascotas.</p>
            <p>Por favor, confirma tu correo electrónico para completar tu registro y empezar a cuidar de tus peludos amigos.</p>
            
            <!-- Confirm Email Button -->
            <a href="${verificationUrl}" class="button button-confirm" style="color: #ffffff;">
                Confirmar mi correo
            </a>

            <!-- Optional delete account section -->
            <p style="margin-top: 30px;">¿No reconoces esta cuenta? Puedes eliminarla haciendo clic aquí:</p>
            <a href="${deleteUrl}" class="button button-delete" style="color: #ffffff;">
                Eliminar cuenta
            </a>

            
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                <a href="${verificationUrl}" style="color: #4CAF50;">${verificationUrl}</a>
            </p>

            <p style="font-size: 12px; color: #999;">
                Este enlace expirará en 10 minutos por razones de seguridad.
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            © ${new Date().getFullYear()} PetCare. Todos los derechos reservados.
        </div>
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
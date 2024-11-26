const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const nodemailer = require("nodemailer");

const crearCita = async (req, res) => {
    try {
        const { veterinaryId, petId, userId, date, hour } = req.body;

        if (!veterinaryId || !petId || !userId || !date || !hour) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        const usuario = await prisma.user.findUnique({ where: { id: userId } });
        if (!usuario) {
            return res.status(404).json({ error: "El usuario no existe" });
        }

        const mascota = await prisma.pet.findUnique({ where: { id: petId } });
        if (!mascota) {
            return res.status(404).json({ error: "La mascota no existe" });
        }

        if (mascota.ownerId !== userId) {
            return res.status(403).json({ error: "La mascota no pertenece al usuario" });
        }

        const appointmentDate = new Date(date);
        const localAppointmentDate = new Date(appointmentDate.getTime() + appointmentDate.getTimezoneOffset() * 60000);
        const dayOfWeek = localAppointmentDate.toLocaleDateString("en-US", { weekday: "long" });

        const horarioDisponible = await prisma.availableHour.findFirst({
            where: { veterinaryId: veterinaryId, day: dayOfWeek, hour: hour },
        });

        if (!horarioDisponible) {
            return res.status(400).json({ error: "El horario seleccionado no está disponible" });
        }

        const citaExistente = await prisma.appointment.findFirst({
            where: { veterinaryId: veterinaryId, date: appointmentDate, hourId: horarioDisponible.id },
        });

        if (citaExistente) {
            return res.status(400).json({ error: "Ya existe una cita para esta fecha y hora" });
        }

        const nuevaCita = await prisma.appointment.create({
            data: {
                veterinaryId: veterinaryId,
                petId: petId,
                userId: userId,
                date: appointmentDate,
                hourId: horarioDisponible.id,
            },
            include: {
                veterinary: true, // Incluimos la información de la veterinaria
            }
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuario.email,
            subject: "Confirmación de Cita para tu Mascota 🐾",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0;">Confirmación de Cita</h1>
                        <p style="margin: 0;">¡Tu cita está confirmada!</p>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hola <strong>${usuario.firstName} ${usuario.lastName}</strong>,</p>
                        <p>
                            Nos complace informarte que tu cita para tu mascota <strong>${mascota.name}</strong> 
                            ha sido confirmada con éxito.
                        </p>
                        <p><strong>Detalles de la Cita:</strong></p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Veterinaria:</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${nuevaCita.veterinary.veterinarieName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Fecha:</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${localAppointmentDate.toDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Hora:</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${hour}</td>
                            </tr>
                        </table>
                        <p style="margin-bottom: 0;">¡Gracias por confiar en nosotros! 🐾</p>
                    </div>
                    <div style="background-color: #f4f4f4; padding: 10px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #555;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Cita creada exitosamente y correo enviado", nuevaCita });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error al crear la cita" });
    }
};

const cancelarCita = async (req, res) => {
    try {
        const { appointmentId, razon } = req.body;

        const cita = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                hour: true,
                veterinary:true,
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true, // Ajusta según el modelo
                    }
                }
            }
        });
        

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        const fechaCita = new Date(cita.date);
        const fechaActual = new Date();
        const diferenciaDias = Math.ceil((fechaCita - fechaActual) / (1000 * 60 * 60 * 24));

        if (diferenciaDias < 3) {
            return res.status(400).json({ message: 'The appointment can only be canceled with at least 3 days notice.' });
        }

        const userName = `${cita.user.firstName} ${cita.user.lastName}`;
        // Eliminar la cita
        await prisma.appointment.delete({
            where: { id: appointmentId }
        });

        // Configurar transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // O cualquier otro servicio SMTP
            auth:  { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });


        // Configurar el mensaje de correo
        const mailOptions = {
            from: process.env.EMAIL_USER, // Reemplaza con tu correo
            to: cita.user.email, // Correo del usuario
            subject: 'Cancelación de cita',
            html: `
  
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                  <!-- Cabecera con el logo -->
                  <header style="text-align: center; margin-bottom: 20px;">
                    <img src="https://res.cloudinary.com/dkwulpnkt/image/upload/v1730681515/logo_u7zvk1.png" alt="Spike Logo" style="max-width: 100px; margin-bottom: 10px;">
                    <h1 style="color: #4CAF50; font-size: 24px; margin: 0;">Cancelación de cita</h1>
                  </header>
                  <!-- Contenido principal -->
                  <main>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                      Hola <strong>${userName || 'Usuario'}</strong>,
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                      Lamentamos informarte que tu cita programada para el día 
                      <strong>${fechaCita.toLocaleDateString()}</strong> a las 
                      <strong>${cita.hour.hour}</strong> en
                      <strong>${cita.veterinary.veterinarieName}</strong> ha sido cancelada.
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5; font-style: italic;">
                      Motivo de cancelación: ${razon || 'Sin especificar'}
                    </p>
                    <p style="color: #555; font-size: 14px; line-height: 1.5;">
                      Si necesitas más información o ayuda, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
                    </p>
                  </main>
                  <!-- Pie de página -->
                  <footer style="margin-top: 20px; text-align: center; padding: 10px; border-top: 1px solid #ddd;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                      Atentamente,<br><strong>Equipo Spike</strong>
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 5px 0;">
                      <em>Tu aliado en el cuidado de tus mascotas</em>
                    </p>
                  </footer>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Cita cancelada exitosamente y el horario ha sido reabierto. Se ha enviado un correo de cancelación al usuario.'
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


const completadaCita = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const cita = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                hour: true,
                veterinary: true,
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        const citaActualizada = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { done: true }
        });

        const userName = `${cita.user.firstName} ${cita.user.lastName}`;
        const fechaCita = new Date(cita.date);

        // Configurar transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        // Configurar el mensaje de correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: cita.user.email,
            subject: '¡Gracias por asistir a tu cita en Spike!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                  <!-- Cabecera con el logo -->
                  <header style="text-align: center; margin-bottom: 20px;">
                    <img src="https://res.cloudinary.com/dkwulpnkt/image/upload/v1730681515/logo_u7zvk1.png" alt="Spike Logo" style="max-width: 100px; margin-bottom: 10px;">
                    <h1 style="color: #4CAF50; font-size: 24px; margin: 0;">¡Gracias por tu visita!</h1>
                  </header>
                  <!-- Contenido principal -->
                  <main>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                      Hola <strong>${userName || 'Usuario'}</strong>,
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                      Queremos agradecerte por asistir a tu cita el día 
                      <strong>${fechaCita.toLocaleDateString()}</strong> a las 
                      <strong>${cita.hour.hour}</strong> en
                      <strong>${cita.veterinary.veterinarieName}</strong>.
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                      Esperamos que tú y tu mascota hayan recibido la mejor atención. Si tienes algún comentario o necesitas programar otra cita, no dudes en contactarnos.
                    </p>
                    <p style="color: #555; font-size: 14px; line-height: 1.5;">
                      ¡Gracias por confiar en Spike para el cuidado de tus mascotas!
                    </p>
                  </main>
                  <!-- Pie de página -->
                  <footer style="margin-top: 20px; text-align: center; padding: 10px; border-top: 1px solid #ddd;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                      Atentamente,<br><strong>Equipo Spike</strong>
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 5px 0;">
                      <em>Tu aliado en el cuidado de tus mascotas</em>
                    </p>
                  </footer>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Appointment marked as made and email sent.', cita: citaActualizada });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


const citasUsuario = async (req, res) => {
    try {
        const ownerId = req.body.ownerId;

        const citas = await prisma.appointment.findMany({
            where: { userId: ownerId },
            include: {
                pet: true, 
                hour: true,
                veterinary: true,
                user: true 
            }
        });

        const citasCompletadas = citas.filter(cita => cita.done === true);
        const citasPendientes = citas.filter(cita => cita.done === false);

        res.json({
            completadas: citasCompletadas,
            pendientes: citasPendientes
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Ocurrió un error al obtener las citas del usuario.' });
    }
};

const citasVet = async (req, res) => {
    try {
        const vetId = req.body.vetId;

        const citas = await prisma.appointment.findMany({
            where: { veterinaryId: vetId },
            include: {
                pet: true, 
                hour: true,
                user: true 
            }
        });

        const citasCompletadas = citas.filter(cita => cita.done === true);
        const citasPendientes = citas.filter(cita => cita.done === false);

        res.json({
            completadas: citasCompletadas,
            pendientes: citasPendientes
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Ocurrió un error al obtener las citas del usuario.' });
    }
};

const cancelarCitaUsuario = async (req, res) => {
    try {
        const { appointmentId, razon } = req.body;

        const cita = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                hour: true,
                veterinary:true,
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true, // Ajusta según el modelo
                    }
                }
            }
        });
        

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        const fechaCita = new Date(cita.date);
        const fechaActual = new Date();
        const diferenciaDias = Math.ceil((fechaCita - fechaActual) / (1000 * 60 * 60 * 24));

        if (diferenciaDias < 3) {
            return res.status(400).json({ message: 'The appointment can only be canceled with at least 3 days notice.' });
        }

        const userName = `${cita.user.firstName} ${cita.user.lastName}`;
        // Eliminar la cita
        await prisma.appointment.delete({
            where: { id: appointmentId }
        });

        // Configurar transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // O cualquier otro servicio SMTP
            auth:  { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });


        // Configurar el mensaje de correo
        const mailOptions = {
            from: process.env.EMAIL_USER, // Reemplaza con tu correo
            to: cita.veterinary.email, // Correo del usuario
            subject: 'Cancelación de cita',
            html: `
  
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                  <!-- Cabecera con el logo -->
                  <header style="text-align: center; margin-bottom: 20px;">
                    <img src="https://res.cloudinary.com/dkwulpnkt/image/upload/v1730681515/logo_u7zvk1.png" alt="Spike Logo" style="max-width: 100px; margin-bottom: 10px;">
                    <h1 style="color: #4CAF50; font-size: 24px; margin: 0;">Cancelación de cita</h1>
                  </header>
                  <!-- Contenido principal -->
                  <main>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                      Hola <strong>${cita.veterinary.veterinarieName || 'Usuario'}</strong>,
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                      Lamentamos informarte que la cita programada para el día 
                      <strong>${fechaCita.toLocaleDateString()}</strong> a las 
                      <strong>${cita.hour.hour}</strong> con el usuario
                      <strong>${userName}</strong> ha sido cancelada.
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5; font-style: italic;">
                      Motivo de cancelación del usuario: ${razon || 'Sin especificar'}
                    </p>
                    <p style="color: #555; font-size: 14px; line-height: 1.5;">
                      Si necesitas más información o ayuda, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
                    </p>
                  </main>
                  <!-- Pie de página -->
                  <footer style="margin-top: 20px; text-align: center; padding: 10px; border-top: 1px solid #ddd;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                      Atentamente,<br><strong>Equipo Spike</strong>
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 5px 0;">
                      <em>Tu aliado en el cuidado de tus mascotas</em>
                    </p>
                  </footer>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Cita cancelada exitosamente y el horario ha sido reabierto. Se ha enviado un correo de cancelación al usuario.'
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    crearCita,
    cancelarCita,
    completadaCita,
    citasUsuario,
    citasVet,
    cancelarCitaUsuario
};

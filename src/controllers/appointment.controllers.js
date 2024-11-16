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
        const { appointmentId } = req.body;

        const cita = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { hour: true } 
        });

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        const fechaCita = new Date(cita.date);
        const fechaActual = new Date();
        const diferenciaDias = Math.ceil((fechaCita - fechaActual) / (1000 * 60 * 60 * 24));

        if (diferenciaDias < 3) {
            return res.status(400).json({ message: 'La cita solo se puede cancelar con al menos 3 días de anticipación' });
        }
        await prisma.appointment.delete({
            where: { id: appointmentId }
        });

        res.status(200).json({ message: 'Cita cancelada exitosamente y el horario ha sido reabierto' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const completadaCita = async(req,res) => {
    try {
        const { appointmentId } = req.body;

        const cita = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        const citaActualizada = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { done: true }
        });

        res.status(200).json({ message: 'Cita marcada como realizada', cita: citaActualizada });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

const citasUsuario = async (req, res) => {
    try {
        const ownerId = req.body.ownerId;

        const citas = await prisma.appointment.findMany({
            where: { userId: ownerId },
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

module.exports = {
    crearCita,
    cancelarCita,
    completadaCita,
    citasUsuario,
    citasVet
};

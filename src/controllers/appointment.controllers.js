const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearCita = async (req, res) => {
    try {
        const { veterinaryId, petId, userId, date, hour } = req.body;

        // Validar datos de entrada
        if (!veterinaryId || !petId || !userId || !date || !hour) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Verificar que el usuario exista
        const usuario = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!usuario) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }

        // Verificar que la mascota exista
        const mascota = await prisma.pet.findUnique({
            where: { id: petId }
        });
        if (!mascota) {
            return res.status(404).json({ error: 'La mascota no existe' });
        }

        // Verificar que la mascota pertenece al usuario
        if (mascota.ownerId !== userId) {
            return res.status(403).json({ error: 'La mascota no pertenece al usuario' });
        }

        // Convertir la fecha a la zona horaria local y obtener el día de la semana
        const appointmentDate = new Date(date);
        const localAppointmentDate = new Date(appointmentDate.getTime() + appointmentDate.getTimezoneOffset() * 60000);
        const dayOfWeek = localAppointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

        console.log(`Veterinary ID: ${veterinaryId}, Day: ${dayOfWeek}, Hour: ${hour}`);

        // Verificar que el horario esté disponible en `AvailableHour`
        const horarioDisponible = await prisma.availableHour.findFirst({
            where: {
                veterinaryId: veterinaryId,
                day: dayOfWeek,
                hour: hour
            }
        });

        if (!horarioDisponible) {
            return res.status(400).json({ error: 'El horario seleccionado no está disponible' });
        }

        // Verificar que no exista una cita para la misma veterinaria, día y hora
        const citaExistente = await prisma.appointment.findFirst({
            where: {
                veterinaryId: veterinaryId,
                date: appointmentDate,
                hourId: horarioDisponible.id
            }
        });

        if (citaExistente) {
            return res.status(400).json({ error: 'Ya existe una cita para esta fecha y hora' });
        }

        // Crear la nueva cita en `Appointment`
        const nuevaCita = await prisma.appointment.create({
            data: {
                veterinaryId: veterinaryId,
                petId: petId,
                userId: userId,
                date: appointmentDate,
                hourId: horarioDisponible.id
            }
        });

        res.status(201).json({ message: 'Cita creada exitosamente', nuevaCita });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al crear la cita' });
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
                hour: true 
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
                hour: true 
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

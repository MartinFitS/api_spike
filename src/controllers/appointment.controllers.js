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

module.exports = {
    crearCita
};

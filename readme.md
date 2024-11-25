# Spike

- 1._ ```git clone https://github.com/MartinFitS/api_spike.git ```

- 2._ ```git branch nuevarama```
- 3._ ```git checkout nuevarama```
- 4._ ```git pull origin main```
- 5._ ```npm i```


### For Migrations:
```bash
npx prisma migrate dev --name init
```
# API de Gestión de Veterinarias

API Spike para la gestión de veterinarias, que permite crear y administrar datos relacionados con clínicas veterinarias. Perteneciente a  [Spike App](https://github.com/Paco-Taco/SpikeNative)

# URL api

https://api-spikeapp.vercel.app/

## Endpoints

### 1. Crear Usuario

- **Endpoint:** `POST /createUser`
- **Descripción:** Crea un nuevo usuario en la base de datos.
- **Parámetros del cuerpo de la solicitud:**
- **FORMDATA!!!!**

```json
    
{
    "firstName": "Martin",
    "lastName": "Serna",
    "email": "msd@gmail.com",
    "phone": "3143386885",
    "password": "Martinsd2004?",
    "role": "PET_OWNER",
    "city": "New York",
    "number_int": 45,
    "cp": 10002,
    "img": (png,jpg,jpeg),
}

```
### 2. Crear Veterinaria

- **Endpoint:** `POST /createVeterinary`
- **Descripción:** Crea una nueva veterinaria en la base de datos.
- **Parámetros del cuerpo de la solicitud:**
- **FORMDATA!!!!**

```json
    
{
    "veterinarieName": "Veterinaria perracos",
    "street": "Calle Falsa 123",
    "email": "veterinarisdsdsa@example.com",
    "phone": "1234567891",
    "password": "martinSd2004?",
    "role": "VETERINARY_OWNER",
    "city": "New York",
    "locality": "Manhattan",
    "cologne": "Central",
    "number_int": 42,
    "cp": 10001,
    "rfc": "ABC123456789",
    "img": (png,jpg,jpeg),
     "token": "asdasd..",
     "category": "CARE",
     "horaInicio": "9",
     "horaFin": "22",
     "diasSemana": "Sunday",
     "diasSemana": "Monday"
}

```


### 3. Editar usuarios

- **Endpoint:** `POST /updateUser/:id`
- **Descripción:** Editar un usuario
- **Parámetros del cuerpo de la solicitud:**
- **FORMDATA!!!**

```json
    
{

    "phone": "3143386885",
     "token": "asdasd..",
        "img": imagen jpeg, png o jpeg
    ...
}

{
    "rfc": "" vacio si es un usaurio normal y con el rfc si es una veterinaria,
    "phone": "3143386885",
     "token": "asdasd..",
     "removeCategories": "" opciones["CARE", "NUTRITION", "RECREATION"],
     "newCategories": "",
     "img": imagen jpeg, png o jpeg
    ...
}

```

### 4. Eliminar usuarios

- **Endpoint:** `POST /deleteUser/:id`
- **Descripción:** Eliminar un usuario
- **Parámetros del cuerpo de la solicitud:**

```json
    
{
    "rfc": "" vacio si es un usaurio normal y con el rfc si es una veterinaria,
     "token": "asdasd.."
}

```



### 5. Listar usuarios

- **Endpoint:** `POST /getUsers`
- **Descripción:** Listar usuarios de veterinarias y usuarios.
- **Parámetros del cuerpo de la solicitud:**

```json
    {
        "token": "asdasd.."
    }
```

### 5. Login

- **Endpoint:** `POST /login`
- **Descripción:** Crear una sesión y almacenar el JWT.
- **Parámetros del cuerpo de la solicitud:**
```json
    {
   "email":"usuario@gmail.com",
   "password": "User2024?" 
    }  

```


### 5. Crear una pet

- **Endpoint:** `POST /createpet`
- **Descripción:** Crear una mascota.
- **Parámetros del cuerpo de la solicitud:**
- **FORMDATA!!!**
```json
    {
        "ownerId": 123,(Tiene que existir un usuario con ese id)
        "name": "Firulais",
        "gender": "0",(0 = masculino, 1 = femenino)
        "weight": "12.5",
        "height": "1", (1 = pequeño, 2 = mediano, 3 = grande, 4 = gigante)
        "animal":  "1", (1 = Perro, 2 = gato, 3 = conejo, 4 = aves, 5 = reptiles, 6 = otros)
        "age": 3,
        "img": file
    }
```

### 5. Crear una Cita

- **Endpoint:** `POST /crearCita`
- **Descripción:** Crear una cita.
- **Parámetros del cuerpo de la solicitud:**

```json

    {
        "veterinaryId": 1,
        "petId": 1,
        "userId": 1,
        "date": "2024-11-04T00:00:00.000Z",
        "hour": "10:00"
    }

```

### 6. Cancelar Cita

- **Endpoint:** `POST /cancelarCita`
- **Descripción:** Cancelar una cita.
- **Parámetros del cuerpo de la solicitud:**

```json

    {
        "appointmentId": 1
    }

```

### 7. Marcar Cita como completada

- **Endpoint:** `POST /citaCompletada`
- **Descripción:** Marcar como completada una cita.
- **Parámetros del cuerpo de la solicitud:**

```json

    {
        "appointmentId": 1
    }

```


### 8. Citas usuario

- **Endpoint:** `POST /citasUsuario`
- **Descripción:** tare citas hechas y pendientes.
- **Parámetros del cuerpo de la solicitud:**

```json

    {
        "ownerId": 1
    }

```

### 9. Citas veterianaria

- **Endpoint:** `POST /citasVet`
- **Descripción:** tare citas hechas y pendientes.
- **Parámetros del cuerpo de la solicitud:**

```json

    {
        "vetId": 1
    }

    respuesta

    {
        {
    "completadas": [],
    "pendientes": [
        {
            "id": 4,
            "veterinaryId": 1,
            "petId": 11,
            "userId": 2,
            "date": "2024-11-26T00:00:00.000Z",
            "hourId": 1,
            "done": false,
            "createdAt": "2024-11-09T02:45:55.836Z",
            "pet": {
                "id": 11,
                "ownerId": 2,
                "name": "Djej",
                "gender": "0",
                "weight": 2,
                "height": "4",
                "animal": "1",
                "age": 25,
                "img": "https://res.cloudinary.com/dkwulpnkt/image/upload/v1731000992/mascotas/fd2jbpghukd446eovil2.png",
                "img_public_id": "mascotas/fd2jbpghukd446eovil2",
                "createdAt": "2024-11-07T17:36:33.132Z",
                "updatedAt": "2024-11-07T17:36:33.132Z"
            },
            "hour": {
                "id": 1,
                "veterinaryId": 1,
                "hour": "02:00",
                "day": "Tuesday"
            }
        }
    ]
}
    }

```
### 10. Obtener detalles de una veterinaria
- **Endpoint:** `GET /getveterinary/:id`
- **Descripción:** Obtiene los detalles de una veterinaria específica, incluyendo horarios disponibles y citas.
- **Parámetros de la URL:**
  - `id` (integer): ID de la veterinaria que se desea obtener.
- **Ejemplo de respuesta:**
```json
{
  "veterinary": {
    "id": 1,
    "veterinarieName": "Veterinaria Patitas Felices",
    "email": "info@patitasfelices.com",
    "phone": "5551234567",
    "city": "Ciudad de México",
    "category": ["CARE", "NUTRITION"],
    "hora_ini": "08:00",
    "hora_fin": "18:00",
    "dias": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "appointments": [
      {
        "id": 1,
        "date": "2024-11-20",
        "hour": "10:00"
      }
    ]
  }
}
```

### 11. Obtener mascotas de un usuario

- **Endpoint:** `GET /user/pets/:userId`
- **Descripción:** Obtiene todas las mascotas asociadas a un usuario dado su ID.
- **Parámetros de la URL:**
  - `userId` (integer): ID del usuario cuyas mascotas se desean obtener.
- **Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "name": "Firulais",
    "gender": "Macho",
    "weight": 12.5,
    "height": "40 cm",
    "animal": "Perro",
    "age": 3,
    "img": "https://example.com/imagen.jpg"
  }
]
```

### 12. Obtener mascotas fallecidas de un usuario

- **Endpoint:** `GET /deathpets/:id`
- **Descripción:** Obtiene todas las mascotas fallecidas asociadas a un usuario dado su ID.
- **Parámetros de la URL:**
  - `id` (integer): ID del usuario cuyas mascotas fallecidas se desean obtener.
- **Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "originalId": 1,
    "ownerId": 1,
    "name": "Firulais",
    "gender": "Macho",
    "weight": 12.5,
    "height": "40 cm",
    "animal": "Perro",
    "age": 3,
    "img": "https://example.com/imagen.jpg",
    "dateOfDeath": "2024-11-20"
  }
]
```

### 13. Obtener citas de un usuario

- **Endpoint:** `POST /citasUsuario`
- **Descripción:** Obtiene todas las citas asociadas a un usuario, separándolas en completadas y pendientes.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "ownerId": 1
}
```
- **Ejemplo de respuesta:**
```json
  {
  "completadas": [
    {
      "id": 1,
      "pet": {
        "id": 1,
        "name": "Firulais"
      },
      "hour": {
        "id": 1,
        "hour": "10:00"
      },
      "veterinary": {
        "id": 1,
        "veterinarieName": "Veterinaria Patitas Felices"
      }
    }
  ],
  "pendientes": [
    {
      "id": 2,
      "pet": {
        "id": 1,
        "name": "Firulais"
      },
      "hour": {
        "id": 2,
        "hour": "11:00"
      },
      "veterinary": {
        "id": 1,
        "veterinarieName": "Veterinaria Patitas Felices"
      }
    }
  ]
}
```
### 14. Obtener citas de una veterinaria

- **Endpoint:** `POST /citasVet`
- **Descripción:** Obtiene todas las citas asociadas a una veterinaria, separándolas en completadas y pendientes.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "vetId": 1
}
```
- **Ejemplo de respuesta:**
```json
{
  "completadas": [
    {
      "id": 1,
      "pet": {
        "id": 1,
        "name": "Firulais"
      },
      "hour": {
        "id": 1,
        "hour": "10:00"
      },
      "user": {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez"
      }
    }
  ],
  "pendientes": [
    {
      "id": 2,
      "pet": {
        "id": 1,
        "name": "Firulais"
      },
      "hour": {
        "id": 2,
        "hour": "11:00"
      },
      "user": {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez"
      }
    }
  ]
}
```
### 15. Marcar cita como completada

- **Endpoint:** `POST /citaCompletada`
- **Descripción:** Marca una cita existente como completada.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "appointmentId": "abc123"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Cita marcada como realizada",
  "cita": {
    "id": "abc123",
    "done": true
  }
}
```
### 16. Cancelar cita de un usuario

- **Endpoint:** `POST /cancelarcita/usuario`
- **Descripción:** Cancela una cita existente de un usuario.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "appointmentId": 1,
  "razon": "Motivo de la cancelación"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Cita cancelada exitosamente y el horario ha sido reabierto"
}
```
### 17. Obtener detalles de una mascota

- **Endpoint:** `GET /getpet/:id`
- **Descripción:** Obtiene los detalles de una mascota específica dado su ID.
- **Parámetros de la URL:**
  - `id` (integer): ID de la mascota que se desea obtener.
- **Ejemplo de respuesta:**
```json
{
  "id": 1,
  "ownerId": 1,
  "name": "Firulais",
  "gender": "Macho",
  "weight": 12.5,
  "height": "40 cm",
  "animal": "Perro",
  "age": 3,
  "img": "https://example.com/imagen.jpg"
}
```
### 18. Actualizar una mascota

- **Endpoint:** `POST /updatepet/:id`
- **Descripción:** Actualiza la información de una mascota existente y opcionalmente su imagen. Calcula la edad total de la mascota en meses desde su creación.
- **Parámetros de la URL:**
  - `id` (integer): ID de la mascota que se desea actualizar.
- **Parámetros del cuerpo de la solicitud:**
- **FORMDATA!!!**
```json
{
  "weight": 10.5,
  "height": "50 cm",
  "name": "Firulais",
  "file": "imagen.jpg"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Mascota actualizada correctamente",
  "updatedPet": {
    "id": 1,
    "weight": 10.5,
    "height": "50 cm",
    "age": 36,
    "img": "https://example.com/nueva_imagen.jpg"
  }
}
```
### 19. Registrar la muerte de una mascota

- **Endpoint:** `POST /deathPet`
- **Descripción:** Mueve una mascota existente a la tabla de fallecidas, elimina sus citas asociadas y registra la fecha de su fallecimiento.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "petId": 1,
  "dateOfDeath": "2024-11-20"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Mascota movida a la tabla de fallecidas"
}
```
### 20. Crear una mascota

- **Endpoint:** `POST /createpet`
- **Descripción:** Crea una nueva mascota asociada a un propietario existente y opcionalmente sube una imagen a Cloudinary.
- **Parámetros del cuerpo de la solicitud:**
- **FORMDATA!!!**
```json
{
  "ownerId": 1,
  "name": "Firulais",
  "gender": "Macho",
  "weight": 12.5,
  "height": "40 cm",
  "animal": "Perro",
  "age": 3,
  "img": "imagen.jpg"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Mascota creada correctamente",
  "newPet": {
    "id": 1,
    "ownerId": 1,
    "name": "Firulais",
    "gender": "Macho",
    "weight": 12.5,
    "height": "40 cm",
    "animal": "Perro",
    "age": 3,
    "img": "https://example.com/imagen.jpg"
  }
}
```
### 21. Eliminar un usuario o veterinaria

- **Endpoint:** `POST /deleteUser/:id`
- **Descripción:** Elimina un usuario o una veterinaria de la base de datos. Si se proporciona un RFC, se eliminará una veterinaria; de lo contrario, se eliminará un usuario.
- **Parámetros de la URL:**
  - `id` (integer): ID del usuario o veterinaria que se desea eliminar.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "rfc": ""
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Usuario borrado correctamente"
}
```
### 22. Actualizar un usuario o veterinaria

- **Endpoint:** `POST /updateUser/:id`
- **Descripción:** Actualiza los datos de un usuario o veterinaria. Si se proporciona un RFC, se actualiza la veterinaria; de lo contrario, se actualiza el usuario.
- **Parámetros de la URL:**
  - `id` (integer): ID del usuario o veterinaria que se desea actualizar.
- **Parámetros del cuerpo de la solicitud:**
- **FORMDATA!!!**
```json
{
  "phone": "3143386885",
  "token": "asdasd..",
  "img": "imagen.jpg",
  "rfc": "",
  "removeCategories": ["CARE"],
  "newCategories": ["NUTRITION"]
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Usuario o veterinaria actualizado correctamente"
}
```
### 23. Crear una veterinaria

- **Endpoint:** `POST /createVeterinary`
- **Descripción:** Crea una nueva veterinaria en la base de datos.
- **Parámetros del cuerpo de la solicitud:**
- **FORMDATA!!!**
```json
{
  "veterinarieName": "Veterinaria Patitas Felices",
  "street": "Av. Reforma",
  "email": "info@patitasfelices.com",
  "phone": "5551234567",
  "password": "Password@123",
  "role": "VETERINARY_OWNER",
  "city": "Ciudad de México",
  "locality": "Centro",
  "cologne": "Roma Norte",
  "number_int": 10,
  "cp": 12345,
  "rfc": "PFA090123ABC",
  "img": "imagen.jpg",
  "token": "asdasd..",
  "category": ["CARE", "NUTRITION"],
  "horaInicio": "8",
  "horaFin": "18",
  "diasSemana": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Veterinaria creada correctamente con horarios disponibles",
  "newVeterinarie": {
    "id": 1,
    "veterinarieName": "Veterinaria Patitas Felices",
    "street": "Av. Reforma",
    "email": "info@patitasfelices.com",
    "phone": "5551234567",
    "password": "Password@123",
    "role": "VETERINARY_OWNER",
    "city": "Ciudad de México",
    "locality": "Centro",
    "cologne": "Roma Norte",
    "number_int": 10,
    "cp": 12345,
    "rfc": "PFA090123ABC",
    "img": "https://example.com/imagen.jpg",
    "category": ["CARE", "NUTRITION"],
    "horaInicio": "8",
    "horaFin": "18",
    "diasSemana": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  }
}
```
### 24. Listar todas las veterinarias

- **Endpoint:** `POST /getVeterinaries`
- **Descripción:** Obtiene una lista de todas las veterinarias registradas en la base de datos.
- **Ejemplo de respuesta:**
```json
{
  "veterinaries": [
    {
      "id": 1,
      "veterinarieName": "Veterinaria Patitas Felices",
      "email": "info@patitasfelices.com",
      "phone": "5551234567",
      "city": "Ciudad de México",
      "category": ["CARE", "NUTRITION"]
    }
  ]
}
```
### 25. Listar usuarios y veterinarias

- **Endpoint:** `POST /getUsers`
- **Descripción:** Obtiene una lista de todos los usuarios y veterinarias registrados en la base de datos.
- **Ejemplo de respuesta:**
```json
{
  "users": [
    {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan.perez@example.com",
      "phone": "5551234567",
      "role": "PET_OWNER",
      "img": "https://example.com/imagen.jpg",
      "isActive": true
    }
  ],
  "veterinaries": [
    {
      "id": 1,
      "veterinarieName": "Veterinaria Patitas Felices",
      "email": "info@patitasfelices.com",
      "phone": "5551234567",
      "city": "Ciudad de México",
      "category": ["CARE", "NUTRITION"]
    }
  ]
}
```
### 26. Obtener detalles de un usuario

- **Endpoint:** `GET /getUsers/:id`
- **Descripción:** Obtiene los detalles de un usuario específico dado su ID.
- **Parámetros de la URL:**
  - `id` (integer): ID del usuario que se desea obtener.
- **Ejemplo de respuesta:**
```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "phone": "5551234567",
  "role": "PET_OWNER",
  "img": "https://example.com/imagen.jpg",
  "isActive": true
}
```
### 27. Crear una cita

- **Endpoint:** `POST /crearCita`
- **Descripción:** Crea una cita para una mascota en una veterinaria y envía una confirmación por correo electrónico al usuario.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "veterinaryId": 1,
  "petId": 1,
  "userId": 1,
  "date": "2024-11-04T00:00:00.000Z",
  "hour": "10:00"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Cita creada exitosamente y correo enviado",
  "nuevaCita": {
    "id": 1,
    "veterinaryId": 1,
    "petId": 1,
    "userId": 1,
    "date": "2024-11-04T00:00:00.000Z",
    "hourId": 1
  }
}
```
### 28. Cancelar una cita

- **Endpoint:** `POST /cancelarCita`
- **Descripción:** Cancela una cita existente si se hace con al menos 3 días de anticipación.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "appointmentId": 1
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Cita cancelada exitosamente y el horario ha sido reabierto"
}
```
### 29. Marcar cita como completada

- **Endpoint:** `POST /citaCompletada`
- **Descripción:** Marca una cita existente como completada.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "appointmentId": "abc123"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Cita marcada como realizada",
  "cita": {
    "id": "abc123",
    "done": true
  }
}
```
### 30. Obtener citas de una veterinaria

- **Endpoint:** `POST /citasVet`
- **Descripción:** Obtiene todas las citas asociadas a una veterinaria, separándolas en completadas y pendientes.
- **Parámetros del cuerpo de la solicitud:**
```json
{
  "vetId": 1
}
```
- **Ejemplo de respuesta:**
```json
{
  "completadas": [
    {
      "id": 1,
      "pet": {
        "id": 1,
        "name": "Firulais"
      },
      "hour": {
        "id": 1,
        "hour": "10:00"
      },
      "user": {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez"
      }
    }
  ],
  "pendientes": [
    {
      "id": 2,
      "pet": {
        "id": 1,
        "name": "Firulais"
      },
      "hour": {
        "id": 2,
        "hour": "11:00"
      },
      "user": {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez"
      }
    }
  ]
}
```

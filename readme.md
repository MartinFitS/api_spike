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





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

API Spike para la gestión de veterinarias, que permite crear y administrar datos relacionados con clínicas veterinarias.

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
        "id_owner": "1000", (Tiene que existir un usuario con ese id)
        "name": "Mechitas",
        "gender": "1",  (0 = masculino, 1 = femenino)
        "weight": 5.8,
        "height": "1", (1 = pequeño, 2 = mediano, 3 = grande, 4 = gigante)
        "animal": "1", (1 = Perro, 2 = gato, 3 = conejo, 4 = aves, 5 = reptiles, 6 = otros)
        "img": (png,jpg,jpeg),
    }

```




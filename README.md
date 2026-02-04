# Atom Challenge – Backend API (Express + Firebase Functions)

Este repositorio contiene el Backend del challenge técnico de Atom.  
La API está desarrollada con Express + TypeScript y desplegada en Firebase Cloud Functions (Gen2).

API desplegada:

https://api-ykigm3b4pa-uc.a.run.app

Health Check:

https://api-ykigm3b4pa-uc.a.run.app/health

---

## Arquitectura del proyecto

El backend sigue una organización inspirada en Clean Architecture y principios DDD:

- `domain/` contiene entidades principales (User, Task)
- `repositories/` encapsula el acceso a Firestore de forma desacoplada
- `middleware/` centraliza autenticación y autorización JWT
- `routes/` define los endpoints REST expuestos por la API

Esta separación permite un código más mantenible, escalable y fácil de testear.

---

## Buenas prácticas aplicadas

- Middleware JWT reutilizable para proteger rutas
- Validaciones robustas usando Zod
- Separación de responsabilidades (principios SOLID)
- Tipado estricto con TypeScript
- Acceso a datos desacoplado mediante repositorios
---

## Tecnologías utilizadas

- Node.js + Express
- TypeScript
- Firebase Cloud Functions Gen2
- Firebase Firestore Database
- JWT Authentication
- Middleware de autorización
- Validaciones con Zod
- Jest + Supertest (Unit Tests)

---

## Endpoints disponibles

Usuarios:

POST /users/login  
POST /users/register

Tareas (protegidas con JWT):

GET /tasks  
POST /tasks  
PUT /tasks/:id  
DELETE /tasks/:id

---

## Autenticación JWT

Las rutas de tareas requieren header:

Authorization: Bearer <token>

El token se genera al iniciar sesión o registrar un usuario.

---

## JWT Secret en producción

El secreto se gestiona usando Firebase Secrets:

firebase functions:secrets:set JWT_SECRET

Firebase expone el valor automáticamente como:

process.env.JWT_SECRET

En local, si no existe, se usa un fallback seguro de desarrollo.

---

## Configuración de CORS

La API permite requests desde el frontend desplegado:

app.use(cors({ origin: true }))

---

## Ejecución local

Instalar dependencias:

cd functions  
npm install

Compilar TypeScript:

npm run build

Ejecutar emuladores Firebase:

firebase emulators:start --only functions,firestore

API local disponible en:

http://127.0.0.1:5001/<project-id>/us-central1/api

---

## Pruebas unitarias backend

Ejecutar tests:

npm run test

Incluye pruebas básicas:

- Health endpoint
- Middleware JWT
- Endpoints protegidos

---

## Deploy backend

Deploy desde la carpeta backend:

firebase deploy --only functions

---

## Requisitos del challenge cubiertos

- Express + TypeScript API
- Firestore como base de datos NoSQL
- Deploy en Cloud Functions
- CRUD completo de tareas
- Registro/Login con correo
- Middleware JWT Auth
- Validaciones con Zod
- Configuración de CORS
- Secrets seguros en producción
- Unit tests básicos backend

---

## Autor

Desarrollado por Jose Pablo Ponce

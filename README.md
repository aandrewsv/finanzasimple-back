# FinanzaSimple - Registro de Transacciones

Este proyecto consiste en una API REST para gestionar registros de transacciones financieras personales. Está diseñada para ser consumida por un frontend y permitir a los usuarios llevar un registro personalizado de sus finanzas, cuenta con sistema de autenticación y seguridad.

## Stack Tecnológico

- Backend: Node.js
- Base de datos: MongoDB Atlas
- ORM: Mongoose
- Framework web: Express.js
- Autenticación: JWT (JSON Web Tokens)
- Seguridad: bcryptjs, express-rate-limit

## Funcionalidades

- Sistema de autenticación:
  - Registro controlado por administrador con generación automática de contraseñas seguras
  - Login de usuarios
  - Protección de rutas con JWT
- Registro de transacciones: Crea, edita y elimina transacciones de ingresos y egresos
- Listado de transacciones: Visualiza todas las transacciones registradas por usuario
- Filtrado y búsqueda: Filtra y busca transacciones por fecha, monto, descripción y tipo
- Gestión de categorías: Crea, edita y elimina categorías de transacciones
- Seguridad:
  - Passwords encriptados
  - Rate limiting
  - Protección de rutas
  - Aislamiento de datos por usuario

## Instalación y Ejecución

1. Clona el repositorio:

    ```bash
    git clone https://github.com/aandrewsv/finanzasimple-back
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Configura las variables de entorno: crea un archivo .env con la siguiente información:

    ```env
    MONGO_URI=tu_url_de_mongodb_atlas
    PORT=3000
    JWT_SECRET=tu_clave_secreta_jwt
    ADMIN_SECRET_CODE=tu_codigo_secreto_para_registro
    ```

4. Ejecuta la aplicación:

    ```bash
    # Modo desarrollo
    npm run dev

    # Modo producción
    npm start
    ```

## Endpoints

### Autenticación

- POST `/api/auth/registro` --> Registrar nuevo usuario (requiere código de administrador)
  - Header `requerido: X-Admin-Code`
  - Body: `{ "email": "usuario@ejemplo.com" }`
  - Respuesta: Devuelve las credenciales generadas automáticamente

- POST `/api/auth/login` --> Iniciar sesión
  - Body: `{ "email": "usuario@ejemplo.com", "password": "contraseña" }`

### Transacciones (requieren autenticación)

Todas las rutas de transacciones requieren el header:
Authorization: Bearer <token_jwt>

- GET `/api/transacciones` --> Obtener todas las transacciones del usuario
- POST `/api/transacciones` --> Crear una nueva transacción
- GET `/api/transacciones/:id` --> Obtener una transacción por ID
- PUT `/api/transacciones/:id` --> Actualizar una transacción
- DELETE `/api/transacciones/:id` --> Eliminar una transacción

### Categorías (requieren autenticación)

Todas las rutas de categorías requieren el header:
Authorization: Bearer <token_jwt>

- GET `/api/categorias` --> Obtener todas las categorías del usuario ordenadas por campo 'orden'
- POST `/api/categorias` --> Crear una nueva categoría
  - Body: `{ "nombre": "Nombre Categoría", "tipo": "ingreso|egreso", "orden": 1 }`

- PUT "/api/categorias/:id" --> Actualizar una categoría
  - Body: `{ "nombre": "Nuevo Nombre", "tipo": "ingreso|egreso", "orden": 1 }`

Nota: Todos los campos son opcionales en la actualización

- DELETE `/api/categorias/:id` --> Eliminar una categoría

## Modelos de Datos

### Usuario

```javascript
const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
```

### Transacción

```javascript
const transaccionSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    monto: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['ingreso', 'egreso']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    }
}, {
    timestamps: true
});
```

### Categoría

```javascript
const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        required: true,
        enum: ['ingreso', 'egreso']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    orden: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
```

## Seguridad

- Autenticación mediante JWT
- Contraseñas generadas automáticamente con criterios de seguridad:
  - Mínimo 12 caracteres
  - Incluye números, letras mayúsculas y minúsculas, y caracteres especiales
  - Generación aleatoria para mayor seguridad
- Passwords encriptados con bcrypt
- Rate limiting: 100 peticiones por 15 minutos
- Registro de usuarios controlado por código de administrador
- Aislamiento de datos: cada usuario solo puede ver y modificar sus propias transacciones
- Validación de datos en modelos
- Conexión segura a MongoDB Atlas

## Ejemplos de Uso

### Registro de Usuario (Solo Admin)

```bash
curl -X POST http://localhost:3000/api/auth/registro \
-H "Content-Type: application/json" \
-H "X-Admin-Code: tu_codigo_admin" \
-d '{
  "email": "usuario@ejemplo.com",
  "password": "opcional" 
}'

# Respuesta:
{
  "mensaje": "Usuario creado exitosamente",
  "credenciales": {
    "email": "usuario@ejemplo.com",
    "password": "contraseña_generada_automaticamente_o_provista"
  },
  "token": "jwt_token"
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_proporcionada"
}'
```

### Crear Transacción

```bash
curl -X POST http://localhost:3000/api/transacciones \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <tu_token_jwt>" \
-d '{
  "monto": 1500,
  "descripcion": "Salario",
  "tipo": "ingreso",
  "categoria": "id_categoria"
}'

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import conectarDB from './config/db.js';
import transaccionesRoutes from './routes/transacciones.js';
import authRoutes from './routes/auth.js';
import categoriasRoutes from './routes/categorias.js';


// Configuración de variables de entorno
dotenv.config();

// Crear el servidor Express
const app = express();

// Rate limiter global básico
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 peticiones por ventana
});

// Conectar a la base de datos
conectarDB();

// Configuración de middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/categorias', categoriasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de FinanzaSimple funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 3001;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// corsConfig.js
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const corsOptions = {
    origin: (origin, callback) => {
        // Define whitelist según el entorno
        const whitelist = process.env.NODE_ENV === 'production'
            ? [process.env.FRONTEND_URL]  // URL de producción desde variable de entorno
            : ['http://localhost:3000'];  // URL de desarrollo fija
        
        // Permite peticiones sin origin (como mobile apps o Postman) en desarrollo
        if (!origin && process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Origen ${origin} no permitido por CORS`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,  // Permite cookies en las peticiones
    maxAge: 86400      // Cache de preflight durante 24 horas
};

export default corsOptions;
import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import rateLimit from 'express-rate-limit';
import verificarCodigoAdmin from '../middleware/adminAuth.js';

const router = express.Router();

// Rate limiting básico: 100 intentos por 15 minutos
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Generar JWT
const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secretopordefecto', {
        expiresIn: '30d'
    });
};

// Generar contraseña segura
const generarPassword = () => {
    const longitud = 12;
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Asegurar al menos un número
    password += '0123456789'[Math.floor(Math.random() * 10)];
    
    // Asegurar al menos una letra mayúscula
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    
    // Asegurar al menos un carácter especial
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Completar el resto de la contraseña
    for(let i = password.length; i < longitud; i++) {
        password += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    
    // Mezclar la contraseña
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Registro de usuario (protegido con código admin)
router.post('/registro', verificarCodigoAdmin, limiter, async (req, res) => {
    try {
        const { email } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        // Generar contraseña automáticamente
        const password = generarPassword();

        // Crear nuevo usuario
        const usuario = new Usuario({
            email,
            password
        });

        await usuario.save();

        // Generar token
        const token = generarJWT(usuario._id);

        // Devolver credenciales
        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            credenciales: {
                email: usuario.email,
                password: password // Mostrar la contraseña generada
            },
            token
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el registro', error: error.message });
    }
});

// Login de usuario (público)
router.post('/login', limiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificar password
        const passwordCorrecta = await usuario.compararPassword(password);
        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Generar token
        const token = generarJWT(usuario._id);

        res.json({
            _id: usuario._id,
            email: usuario.email,
            token
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el login', error: error.message });
    }
});

export default router;

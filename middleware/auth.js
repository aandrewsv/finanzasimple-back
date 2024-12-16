import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const protegerRuta = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del header
            token = req.headers.authorization.split(' ')[1];
            
            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Agregar el usuario al request
            req.usuario = await Usuario.findById(decoded.id).select('-password');
            
            next();
        } catch (error) {
            res.status(401).json({ mensaje: 'No autorizado' });
        }
    }
    
    if (!token) {
        res.status(401).json({ mensaje: 'No autorizado, no hay token' });
    }
};

export default protegerRuta;

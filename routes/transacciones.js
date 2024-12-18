// routes/transacciones.js
import express from 'express';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Transaccion from '../models/Transaccion.js';
import protegerRuta from '../middleware/auth.js';

const router = express.Router();

// Proteger todas las rutas
router.use(protegerRuta);

// Obtener transacciones con filtros
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, tipo } = req.query;
        
        // Construir el query base
        const query = {
            usuario: req.usuario._id
        };

        // Filtro de fechas
        if (startDate || endDate) {
            query.fecha = {};
            
            if (startDate) {
                // Establecer inicio del día para la fecha de inicio
                query.fecha.$gte = startOfDay(parseISO(startDate));
            }
            
            if (endDate) {
                // Establecer fin del día para la fecha final
                query.fecha.$lte = endOfDay(parseISO(endDate));
            }
        }

        // Filtro de tipo (ingreso/egreso)
        if (tipo) {
            query.tipo = tipo;
        }

        const transacciones = await Transaccion
            .find(query)
            .sort({ fecha: -1 }) // Ordenar por fecha descendente
            .populate('categoria', 'nombre') // Poblar el nombre de la categoría
            .lean() // Convertir a objeto plano para mejor rendimiento
            .exec();

        res.json(transacciones);
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener las transacciones',
            error: error.message 
        });
    }
});

// Crear una nueva transacción
router.post('/', async (req, res) => {
    try {
        const transaccion = new Transaccion({
            ...req.body,
            usuario: req.usuario._id
        });
        await transaccion.save();
        res.status(201).json(transaccion);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la transacción', error });
    }
});

// Obtener una transacción por ID
router.get('/:id', async (req, res) => {
    try {
        const transaccion = await Transaccion.findOne({
            _id: req.params.id,
            usuario: req.usuario._id
        });
        
        if (!transaccion) {
            return res.status(404).json({ mensaje: 'Transacción no encontrada' });
        }
        
        res.json(transaccion);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la transacción', error });
    }
});

// Actualizar una transacción
router.put('/:id', async (req, res) => {
    try {
        const transaccion = await Transaccion.findOneAndUpdate(
            {
                _id: req.params.id,
                usuario: req.usuario._id
            },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!transaccion) {
            return res.status(404).json({ mensaje: 'Transacción no encontrada' });
        }
        
        res.json(transaccion);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la transacción', error });
    }
});

// Eliminar una transacción
router.delete('/:id', async (req, res) => {
    try {
        const transaccion = await Transaccion.findOneAndDelete({
            _id: req.params.id,
            usuario: req.usuario._id
        });
        
        if (!transaccion) {
            return res.status(404).json({ mensaje: 'Transacción no encontrada' });
        }
        
        res.json({ mensaje: 'Transacción eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la transacción', error });
    }
});

export default router;

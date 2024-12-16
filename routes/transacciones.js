import express from 'express';
import Transaccion from '../models/Transaccion.js';
import protegerRuta from '../middleware/auth.js';

const router = express.Router();

// Proteger todas las rutas
router.use(protegerRuta);

// Obtener todas las transacciones del usuario
router.get('/', async (req, res) => {
    try {
        const transacciones = await Transaccion.find({ usuario: req.usuario._id }).sort({ fecha: -1 });
        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las transacciones', error });
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

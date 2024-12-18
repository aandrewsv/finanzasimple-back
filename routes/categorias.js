// routes/categorias.js
import express from 'express';
import { check } from 'express-validator';
import protegerRuta from '../middleware/auth.js';
import Categoria from '../models/Categoria.js';

const router = express.Router();

// Obtener categorías - GET api/categorias
router.get('/', protegerRuta, async (req, res) => {
    try {
        const categorias = await Categoria.find({ usuario: req.usuario.id })
            .sort({ orden: 'asc', createdAt: 'desc' });
        res.json(categorias);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al obtener las categorías' });
    }
});

// Crear categoría - POST api/categorias
router.post('/', [
    protegerRuta,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('tipo', 'El tipo debe ser ingreso o egreso').isIn(['ingreso', 'egreso'])
], async (req, res) => {
    try {
        // Verificar si ya existe una categoría con el mismo nombre para este usuario
        const categoriaExistente = await Categoria.findOne({
            nombre: req.body.nombre,
            usuario: req.usuario.id
        });

        if (categoriaExistente) {
            return res.status(400).json({ msg: 'Ya existe una categoría con ese nombre' });
        }

        // Crear nueva categoría
        const categoria = new Categoria({
            nombre: req.body.nombre,
            tipo: req.body.tipo,
            usuario: req.usuario.id,
            orden: req.body.orden
        });

        await categoria.save();
        res.json(categoria);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al crear la categoría' });
    }
});

// Actualizar categoría - PUT api/categorias/:id
router.put('/:id', protegerRuta, async (req, res) => {
    try {
        // Verificar si la categoría existe
        let categoria = await Categoria.findById(req.params.id);

        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        // Verificar que la categoría pertenece al usuario
        if (categoria.usuario.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Verificar que no exista otra categoría con el nuevo nombre
        if (req.body.nombre && req.body.nombre !== categoria.nombre) {
            const categoriaExistente = await Categoria.findOne({
                nombre: req.body.nombre,
                usuario: req.usuario.id,
                _id: { $ne: req.params.id }
            });

            if (categoriaExistente) {
                return res.status(400).json({ msg: 'Ya existe una categoría con ese nombre' });
            }
        }

        // Actualizar
        const nuevaCategoria = {
            nombre: req.body.nombre || categoria.nombre,
            tipo: req.body.tipo || categoria.tipo,
            orden: req.body.orden !== undefined ? req.body.orden : categoria.orden
        };

        categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            nuevaCategoria,
            { new: true }
        );

        res.json(categoria);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al actualizar la categoría' });
    }
});

// Eliminar categoría - DELETE api/categorias/:id
router.delete('/:id', protegerRuta, async (req, res) => {
    try {
        // Verificar si la categoría existe
        const categoria = await Categoria.findById(req.params.id);

        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        // Verificar que la categoría pertenece al usuario
        if (categoria.usuario.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Verificar que no sea una categoría por defecto
        if (categoria.isDefault) {
            return res.status(400).json({ msg: 'No se pueden eliminar categorías por defecto' });
        }

        await Categoria.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Categoría eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al eliminar la categoría' });
    }
});

export default router;
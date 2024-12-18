// utils/crearCategoriasDefault.js
import Categoria from '../models/Categoria.js';
import { categoriasDefault } from './categoriasDefault.js';

export const crearCategoriasDefault = async (usuarioId) => {
    try {
        // Combinar todas las categorías
        const todasLasCategorias = [
            ...categoriasDefault.ingresos,
            ...categoriasDefault.egresos
        ];

        // Crear las categorías para el usuario
        const categoriasPromises = todasLasCategorias.map(cat => {
            const nuevaCategoria = new Categoria({
                ...cat,
                usuario: usuarioId,
                isDefault: true
            });
            return nuevaCategoria.save();
        });

        await Promise.all(categoriasPromises);
    } catch (error) {
        console.error('Error al crear categorías por defecto:', error);
        throw error;
    }
};
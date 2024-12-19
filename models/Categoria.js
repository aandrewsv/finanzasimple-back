// models/Categoria.js
import mongoose from 'mongoose';

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
    isDefault: {
        type: Boolean,
        default: false
    },
    orden: {
        type: Number,
        default: 0
    },
    isVisible: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

// Índice compuesto para evitar duplicados por usuario
categoriaSchema.index({ nombre: 1, usuario: 1 }, { unique: true });

export default mongoose.model('Categoria', categoriaSchema);
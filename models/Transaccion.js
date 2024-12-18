// models/Transaccion.js
import mongoose from 'mongoose';

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
        required: false
    },
    tipo: {
        type: String,
        required: true,
        enum: ['ingreso', 'egreso']
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Transaccion', transaccionSchema);
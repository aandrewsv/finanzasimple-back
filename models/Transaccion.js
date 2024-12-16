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
        required: true,
        trim: true
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
    }
}, {
    timestamps: true
});

const Transaccion = mongoose.model('Transaccion', transaccionSchema);

export default Transaccion;

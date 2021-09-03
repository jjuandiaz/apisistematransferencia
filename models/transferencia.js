const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    persona: {
         nombre: {
            type: String,
            required: true
        },
        rut: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true
        } 
    },
    cuenta: {
        banco: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
    },
    monto: {
            type: Number,
            required: true
    }

        
    
}, { timestamps: true });
const Transferencia = mongoose.model('Transferencia', itemSchema);
module.exports = Transferencia;
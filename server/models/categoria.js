const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' } // INVESTIGAR! Esta Forma es para hacer llamado del schema de usuario en models/usuario
});


module.exports = mongoose.model('Categoria', categoriaSchema);
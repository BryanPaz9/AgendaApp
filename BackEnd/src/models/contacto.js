'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactoSchema = Schema({
    nombre: String,
    apellido: String,
    apodo: String,
    correo: String,
    direccion: String,
    telefono: String,
    birthday: String,
    imagen: String,
    user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Contacto', ContactoSchema);
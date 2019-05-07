'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    apellido: String,
    email: String,
    nickname: String,
    password: String,
    imagen: String
});

module.exports = mongoose.model('User', UserSchema);

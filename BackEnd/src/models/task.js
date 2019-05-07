'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = Schema({
    titulo: String,
    descripcion: String,
    lugar: String,
    fechaInicio: String,
    fechaFin: String,
    user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Task', TaskSchema);
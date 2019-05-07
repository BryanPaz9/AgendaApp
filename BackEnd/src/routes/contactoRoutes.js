'use strict';

var express = require('express');
var contactoController = require('../controllers/contactoController');
var md_auth = require('../middleware/authentification');

//SUBIR IMAGEN
var multiparty = require("connect-multiparty");
var md_upload = multiparty({uploadDir: './src/uploads/users'});

var api = express.Router();
api.get('/list-contacts',md_auth.ensureAuth, contactoController.verContactos);
api.post('/new-contact',md_auth.ensureAuth, contactoController.crearContacto);
api.put('/edit-contact/:id',md_auth.ensureAuth, contactoController.editarContacto);
api.delete('/delete-contact/:id',md_auth.ensureAuth,contactoController.eliminarContacto);
api.post('/subir-imagen-contacto/:id', [md_auth.ensureAuth, md_upload], contactoController.subirImagen);
api.get('/get-contacto/:id', md_auth.ensureAuth, contactoController.getContacto);
api.get('/obtener-imagen-contacto/:imageFile', contactoController.getImageFile);
module.exports = api;
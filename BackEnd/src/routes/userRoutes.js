'use strict';

var express = require("express");
var UserController = require("../controllers/userController");
var md_auth = require("../middleware/authentification");

//Subir Imagen
var multiparty = require("connect-multiparty");
var md_upload = multiparty({uploadDir: './src/uploads/users'});


var api = express.Router();
api.get('/ejemplo', UserController.ejemplo);
api.post('/registrar', UserController.registrar);
api.post('/login', UserController.login);
api.post('/subir-imagen-usuario/:id', [md_auth.ensureAuth, md_upload], UserController.subirImagen);
api.get('/obtener-imagen-usuario/:imageFile', UserController.getImageFile);
api.put('/editar-usuario/:id', md_auth.ensureAuth, UserController.editarUsuario);

module.exports = api;
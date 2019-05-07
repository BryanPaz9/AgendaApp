'use strict';

var express = require('express');
var taskController = require('../controllers/taskController');
var md_auth = require('../middleware/authentification');

var api = express.Router();
api.get('/list-tasks',md_auth.ensureAuth, taskController.verTareas);
api.post('/new-task',md_auth.ensureAuth, taskController.crearTarea);
api.put('/edit-task/:id',md_auth.ensureAuth, taskController.editarTarea);
api.delete('/delete-task/:id',md_auth.ensureAuth,taskController.eliminarTarea);
api.get('/get-task/:id', md_auth.ensureAuth, taskController.getTarea);
module.exports = api;
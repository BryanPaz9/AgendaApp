'use strict'

const express = require("express");
const app = express();
const bodyparser = require("body-parser");

//CARGAR RUTA
var user_routes = require("./routes/userRoutes");
var contacto_routes = require("./routes/contactoRoutes");
var task_routes = require("./routes/taskRoutes");
//MIDDLEWARES
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json())

//CABECERAS
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested_With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//RUTAS
app.use('/api', user_routes,contacto_routes,task_routes);

//EXPORTAR LA/S VARIABLE/S QUE SE ESPECIFIQUEN
module.exports = app;


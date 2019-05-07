'use strict';

var bcrypt = require('bcrypt-nodejs');
var User = require("../models/user");
var jwt = require('../services/jwt')
var path = require("path");
var fs = require("fs");

function ejemplo(req, res) {
    res.status(200).send({message: 'Hola Mundo this is an ejemplo'});
};

function registrar(req, res) {
    var user = new User();
    var params = req.body;

    if(params.nombre && params.nickname && params.email && params.password){
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.email = params.email;
        user.nickname = params.nickname;
        user.password = params.password;
        user.imagen = null;

        User.find({$or: [
            {nickname: user.nickname.toLowerCase()}
        ]}).exec((err, users) =>{
            if(err) return res.status(500).send({message: 'Error en la petición de usuario'});
            if(users && users.length >= 1){
                return res.status(500).send({message: 'El usuario ya existe'});
            }else{
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userGuardado) => {
                        if(err) return res.status(500).send({message: 'Error a la hora de guardar el usuario'});
                        if(userGuardado){
                            res.status(200).send({user: userGuardado});
                        }else{
                            res.status(404).send({message: 'No se ha podido registrar al usuario'});
                        }
                    });
                })
            }
        })
    }else{
        res.status(200).send({message: 'Rellene los datos necesarios'});
    }
}

function login(req, res) {
    var params = req.body;
    var nickname = params.nickname;
    var password = params.password;
    User.findOne({nickname: nickname}, (err, user)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(user){
            bcrypt.compare(password, user.password, (err, check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({token: jwt.createToken(user)});
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                }else{
                    return res.status(404).send({message: 'El usuario no ha podido ser autenticado'});                }
            })
        }else{
            return res.status(404).send({message: 'El usuario no ha podido loguearse'});
        }
    });

}

function subirImagen(req, res) {
    var userId = req.params.id;
    if(req.files){
        var file_path = req.files.imagen.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_xplit = file_name.split('\.');
        console.log(ext_xplit);

        var file_ext = ext_xplit[1];
        console.log(file_ext);

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {imagen: file_name}, {new: true}, (err, usuarioActualizado)=>{
                if(err) return res.status(500).send({message: 'Error en la petición'});
                if(!usuarioActualizado) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                return res.status(200).send({user: usuarioActualizado});
            });
        }else{
            return removeFillerOfUpload(res, file_path, 'Extensión no válida');
        }

    }
}

function removeFillerOfUpload(res, file_path, message) {
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({message: message})
    });
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './src/uploads/users/' + image_file;
    fs.exists(path_file, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    })
}

function editarUsuario(req, res) {
    var params = req.body;
    var userId  = req.params.id;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;

    // if(userId != req.user.sub){
    //     return res.status(500).send({message: 'No tiene los permisos para editar este usuario'});
    // }

    User.findByIdAndUpdate( userId, params, {new:true}, (err, usuarioActualizado) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(!usuarioActualizado) res.status(404).send({message: 'No se ha podido actualizar al Usuario'});

        return res.status(200).send({user: usuarioActualizado});
    });
}

module.exports = {
    ejemplo,
    registrar,
    login,
    subirImagen,
    getImageFile,
    editarUsuario
}
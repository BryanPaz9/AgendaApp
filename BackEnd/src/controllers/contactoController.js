'use strict'

var Contacto = require('../models/contacto');
var path = require('path');
var fs = require ('fs');


function verContactos(req, res){
    Contacto.find({user: req.user.sub},function(err,contactoFind){
        if(err) return res.status(500).send({message: 'Error al traer los datos'});
        if(!contactoFind) return res.status(400).send({message: 'ERROR400'});
        if(contactoFind) return res.status(200).send({contactoFind: contactoFind});
    })
}

function crearContacto(req,res){
    var contacto = new Contacto();
    var params = req.body;

    if(params.nombre && params.apellido && params.apodo && params.correo && params.direccion && params.telefono && params.birthday){
            contacto.nombre = params.nombre;
            contacto.apellido = params.apellido;
            contacto.apodo = params.apodo;
            contacto.correo = params.correo;
            contacto.direccion = params.direccion;
            contacto.telefono = params.telefono;
            contacto.birthday = params.birthday
            contacto.user = req.user.sub;
            contacto.imagen = null;

            Contacto.find({$or: [
                {apodo: contacto.apodo.toLowerCase()}
            ]}).exec((err,contactos)=>{
                if(err) return res.status(500).send({message: 'Error al crear el contacto'});
                if(contactos && contactos.length >=1){
                    return res.status(500).send({message: 'El contacto ya existe'});
                }else{
                    contacto.save((err, contactoStored)=>{
                        if(err) return res.status(500).send({message: 'Error a la hora de crear el contacto'})
                        if(contactoStored){
                            res.status(200).send({contacto: contactoStored})
                        }else{
                            res.status(404).send({message: 'No se pudo guardar el contacto.'});
                        }
                    })
                }
            })
    }else{
        return res.status(200).send({message: 'Rellene los campos necesarios'});
    }
}

function getContacto(req,res){
    var contactoId = req.params.id;

    Contacto.findById(contactoId,(err, contactoFound)=>{
        if(err) return res.status(500).send({message: 'Error al encontrar contacto'});
        if(!contactoFound) return res.status(404).send({message:'Error al traer el contacto'});
        return res.status(200).send({contacto: contactoFound});
    })
}

function editarContacto(req,res){
    var contactoId = req.params.id;
    var params = req.body;

    Contacto.findByIdAndUpdate(contactoId,params,{new: true},(err, contactoUpdated)=>{
        if(err) return res.status(500).send({message: 'Error al editar el contacto'});
        if(!contactoUpdated) return res.status(404).send({message: 'Error al actualizar contacto'});
        return res.status(200).send({contacto: contactoUpdated});
    })
}

function eliminarContacto(req,res){
    var contactoId = req.params.id;

    Contacto.findByIdAndRemove(contactoId, (err,contactDeleted)=>{
        if(err) return res.status(500).send({message: 'No fue posible eliminar el contacto'});
        if(!contactDeleted) return res.status(404).send({message: 'Error al eliminar el contacto'});
        return res.status(200).send({message: 'Registro Eliminado Exitosamente'});
    });
}

function subirImagen(req, res) {
    var contactId = req.params.id;
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
            Contacto.findByIdAndUpdate(contactId, {imagen: file_name}, {new: true}, (err, contactoActualizado)=>{
                if(err) return res.status(500).send({message: 'Error en la petición'});
                if(!contactoActualizado) return res.status(404).send({message: 'No se ha podido actualizar el contacto'});
                return res.status(200).send({contact: contactoActualizado});
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

module.exports ={
    verContactos,
    crearContacto,
    editarContacto,
    eliminarContacto,
    subirImagen,
    removeFillerOfUpload,
    getImageFile,
    getContacto
}
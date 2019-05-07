'use strict'

var Task = require('../models/task');


function verTareas(req, res){
    Task.find({user: req.user.sub},function(err,taskFound){
        if(err) return res.status(500).send({message: 'Error al traer los datos'});
        if(!taskFound) return res.status(400).send({message: 'ERROR400'});
        if(taskFound) return res.status(200).send({tasks: taskFound});
    })
}

function crearTarea(req,res){
    var task = new Task();
    var params = req.body;

    if(params.titulo && params.descripcion && params.fechaInicio && params.fechaFin && params.lugar){
            task.titulo = params.titulo;
            task.descripcion = params.descripcion;
            task.fechaInicio = params.fechaInicio;
            task.fechaFin = params.fechaFin;
            task.lugar = params.lugar;
            task.user = req.user.sub;

            Task.find({$or: [
                {titulo: task.titulo.toLowerCase()}
            ]}).exec((err,tareas)=>{
                if(err) return res.status(500).send({message: 'Error al crear la tarea'});
                if(tareas && tareas.length >=1){
                    return res.status(500).send({message: 'La tarea ya existe'});
                }else{
                    task.save((err, tareaStored)=>{
                        if(err) return res.status(500).send({message: 'Error a la hora de crear la tarea'})
                        if(tareaStored){
                            res.status(200).send({tarea: tareaStored})
                        }else{
                            res.status(404).send({message: 'No se pudo guardar la tarea.'});
                        }
                    })
                }
            })
    }else{
        return res.status(200).send({message: 'Rellene los campos necesarios'});
    }
}

function getTarea(req,res){
    var tareaId = req.params.id;

    Task.findById(tareaId,(err, tareaFound)=>{
        if(err) return res.status(500).send({message: 'Error al encontrar la tarea'});
        if(!tareaFound) return res.status(404).send({message:'Error al traer la tarea'});
        return res.status(200).send({tarea: tareaFound});
    })
}

function editarTarea(req,res){
    var tareaId = req.params.id;
    var params = req.body;

    Task.findByIdAndUpdate(tareaId,params,{new: true},(err, tareaUpdated)=>{
        if(err) return res.status(500).send({message: 'Error al editar la tarea'});
        if(!tareaUpdated) return res.status(404).send({message: 'Error al actualizar la tarea'});
        return res.status(200).send({tarea: tareaUpdated});
    })
}

function eliminarTarea(req,res){
    var tareaId = req.params.id;

    Task.findByIdAndRemove(tareaId, (err,tareaDeleted)=>{
        if(err) return res.status(500).send({message: 'No fue posible eliminar la tarea'});
        if(!tareaDeleted) return res.status(404).send({message: 'Error al eliminar la tarea'});
        return res.status(200).send({message: 'Registro Eliminado Exitosamente'});
    });
}

module.exports ={
    verTareas,
    crearTarea,
    editarTarea,
    eliminarTarea,
    getTarea
}
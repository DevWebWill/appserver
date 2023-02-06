import express from "express";
import verifyJWT from "./verifyjwt.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

const router = express.Router();

router.put('/set-task', async (req, res) => {
    const obj = req.body
    const task = obj.task

    User.findOne({_id: obj._id}).then(dbUser => {
        if(!dbUser) {
            res.json({
                status: 404,
                message: "El usuario no existe"
            })
        } else {
            //console.log("Aqui: ", dbUser._id)
            console.log(task.date)
            const dbTask = new Task({
                name: task.name,
                date: task.date,
                iduser: obj._id
            })
            
            dbTask.save()
            res.json({
                status: 200,
                data: dbTask,
                message: 'Tarea añadida al usuario con éxito'
            })
        }    
    })
    
}) 

router.delete('/delete-task', async (req, res) => {
    const obj = req.body

    Task.deleteOne({_id: obj.idTask}).
    then(dbTask => {
        if(!dbTask) {
            res.json({
                status: 404,
                message: "No se ha encontrado la tarea"
            })
        } else {
            res.json({
                status: 200,
                message: `Se ha eliminado la tarea con id ${obj.idTask}`
            })
        }
    })
})

router.get('/get-tasks', verifyJWT, (req, res) => {
    let id = req.user.id
    
    Task.find({iduser: id}).sort({date: 1})
        .then(dbTask => {
            console.log(dbTask)
            if(!dbTask) {
                return res.json({
                    status: 404,
                    message: "El usuario no tiene tareas"
                })
            } else {
                
                return res.json({
                    status: 200,
                    tasks: dbTask,
                    message: "Listado de tareas del usuario"
                })
            }
        })
})

export default router;
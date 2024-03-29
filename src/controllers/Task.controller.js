import Task from "../models/Task.model.js"
import User from "../models/User.model.js"



export const setTask = async (req, res) => {
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
            //console.log(task.date)
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
}

export const moveTask = async (req, res) => {
    const obj = req.body
    const _id = obj._id

    Task.updateOne(
            { _id: obj._id },
            { $set: 
                {
                    name: obj.name,
                    date: new Date(obj.date),
                    status: obj.status 
                }
            }
        ).then((data) => {
            //console.log(obj)
            res.json({
                status: 200,
                message: `Se ha actualizado la tarea con id ${obj._id}`
            })
        })   
        
       
}

export const deleteTask = async (req, res) => {
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
}

export const getTask = async (req, res) => {
    let id = req.user.id
    
    Task.find({iduser: id}).sort({date: 1})
        .then(dbTask => {
            //console.log(dbTask)
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
}
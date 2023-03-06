import User from "../models/User.model.js";

export const getUser = async (req, res) => {
    let email = req.user.email
    User.findOne({email: email})
        .then(dbUser => {
            if(!dbUser) {
                return res.json({
                    message: "El usuario no existe"
                })
            } else {
                let user = {
                    city: dbUser.city,
                    country: dbUser.country,
                    createdAt: dbUser.createdAt,
                    email: dbUser.email,
                    name: dbUser.name,
                    avatar: dbUser.avatar,
                    occupation: dbUser.occupation,
                    phoneNumber: dbUser.phoneNumber,
                    role: dbUser.role,
                    state: dbUser.state,
                    _id: dbUser._id
                }
                return res.json({isLogin: true, user: user})
            }
        })
}

export const getAllUsers = async (req, res) => {    

    /** Obtenemos el parámetro (limit) para limitar el resultado */
    let limit = req.query.limit
    /** Obtenemos el parámetro (skip) para el salto de la paginación */
    let skip = req.query.skip

    if (limit === undefined || limit === null) {
        limit = 10
    } else if (skip === undefined || skip === null) {
        skip = 0
    }

    /** 
     * Obtenemos el resto de los parámetros y eliminamos el parámetro 
     * limit del objeto porque este se pasará de forma diferente 
     */
    let queryObj = req.query
    delete queryObj.limit

    /** Obtenemos las llaves del objeto quueryObj */
    let keys = Object.keys(queryObj)
    
    /** 
     * Creamos el objeto donde se guardarán los filtros que pasaremos al find 
     */
    let objectFilter = {}

    /** 
     * Recorreomos el array de keys y accedemos a los values del objeto queryObj
     * para crear el objectFilter que será pasado al find 
     */
    keys.forEach(key => {
        objectFilter[key] = Array.isArray(queryObj[key]) ? { $in: queryObj[key] } : { $regex: queryObj[key], $options: 'i' } 
    });

    /** Obtenemos el usuario logueado */
    let email = req.user.email

    User.findOne({email: email})
        .then( async (dbUser) => {
            if(!dbUser) {
                /** Si el usuario no está logueado o no existe */
                return res.json({
                    message: "El usuario no existe"
                })
            } else {
                /** Si el usuario está logueado hacemos la busqueda con los filtros */

                /** Buscamos el total */
                
                let total = await User.countDocuments( objectFilter );
                

                /** Búsqueda */
                User.find( objectFilter ).skip(skip).limit(limit).exec((err, us) => {
                    console.log('total: ', total)
                    return res.json({isLogin: true, users: us, total: total})
                })
            }
        })
}
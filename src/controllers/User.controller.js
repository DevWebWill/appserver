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
                    occupation: dbUser.oç,
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
    /** Captura de parametros */

    /** Parámetro para limitar el resultado */
    let limit = req.query.limit

    /** Eliminamos el parámetro limit del objeto porque este se pasará de forma diferente */
    let queryObj = req.query
    delete queryObj.limit

    /** 
     * Mapeamos el resto de los parámetros y los colocamos en una matriz bidimensional  
     * con el [key, value]
     */
    let filtersArray = Object.keys(queryObj).map((key) => [key, queryObj[key]] )

    /**
     * Recorremos la matriz para transformar el value en una expresión regular con la 
     * opción en minúsculas para la búsqueda
     */    
    filtersArray.forEach(f => {
        f[1] = {$regex: f[1], $options: 'i'}
    })

    /**
     * Convertimos el array en el objeto {key1: value1, key2, value2}... que pasaremos en la 
     * búsqueda 
     */
    let filtersObj = Object.fromEntries(filtersArray)

    let email = req.user.email
    User.findOne({email: email})
        .then(dbUser => {
            if(!dbUser) {
                return res.json({
                    message: "El usuario no existe"
                })
            } else {
                User.find(filtersObj).limit(limit).exec((err, us) => {
                    return res.json({isLogin: true, users: us})
                })
            }
        })
}
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerAuth = async (req, res) => {
    const user = req.body

    //Chequea si el usuario existe
    const takenEmail = await User.findOne({email: user.email})

    if(takenEmail) {
        res.json("Este usuario ya existe")
    } else {
        user.password = await bcrypt.hash(user.password, 10)

        const dbUser = new User({
            name: user.name,
            age: 26,
            email: user.email.toLowerCase(),
            password: user.password
        })

        dbUser.save()
        res.json({message: 'Success'})
    }
}

export const loginAuth = (req, res) => {
    const userLogin = req.body;

    User.findOne({email: userLogin.email})
        .then(dbUser => {
            if(!dbUser) {
                return res.json({
                    message: "Usuario o contraseña inválidos"
                })
            }
            bcrypt.compare(userLogin.password, dbUser.password)
                .then(isCorrect => {
                    if(isCorrect) {
                        const payload = {
                            id: dbUser._id,
                            email: dbUser.email
                        }
                        jwt.sign(
                            payload,
                            process.env.REACT_APP_JWT_SECRET,
                            {expiresIn: 86400},
                            (err, token) => {
                                if(err) return res.json({message: err})
                                return res.json({
                                    message: 'Success',
                                    token: "Bearer " + token
                                })
                            }
                        )
                    } else {
                        return res.json({
                            message: 'Usuario o contraseña inválidoss'
                        })
                    }
                })
        })
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export const loginWithGoogle = async (req, res) => {
    const userLogin = req.body;
    
    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${userLogin.access_token}`)
                .then(res => res.json())
                .then(async data => {
                    const name = data.given_name
                    const email = data.email
                    const picture = data.picture
                    const email_verified = data.email_verified
                    const locale = data.locale

                    let random1 = Math.round(getRandomArbitrary(100000, 1000000))
                    let random2 = Math.round(getRandomArbitrary(100000, 1000000))
                    let pass = `${random1}.${name}.${random2}`
                    let password = await bcrypt.hash(pass, 10)

                    User.findOne({email: email})
                        .then(async dbUser => {
                            if(!dbUser) {
                                //Registrar y loguear
                                const dbUser = new User({
                                    name: name,
                                    age: 26,
                                    email: email,
                                    password: password,
                                    avatar: picture
                                })

                                await dbUser.save()

                                const payload = {
                                    id: dbUser._id,
                                    email: dbUser.email
                                }
                                jwt.sign(
                                    payload,
                                    process.env.REACT_APP_JWT_SECRET,
                                    {expiresIn: 86400},
                                    (err, token) => {
                                        if(err) return res.json({message: err})
                                        return res.json({
                                            message: 'Success',
                                            token: "Bearer " + token
                                        })
                                    }
                                )

                            } else {
                                //Loguear
                                const payload = {
                                    id: dbUser._id,
                                    email: dbUser.email
                                }
                                jwt.sign(
                                    payload,
                                    process.env.REACT_APP_JWT_SECRET,
                                    {expiresIn: 86400},
                                    (err, token) => {
                                        if(err) return res.json({message: err})
                                        return res.json({
                                            message: 'Success',
                                            token: "Bearer " + token
                                        })
                                    }
                                )
                            }
                        })
                })
    
                /* return res.json({
                    message: 'Usuario o contraseña inválidoss'
                }) */
}  

export const getLoginWithGoogle = async (req, res) => {
    
    let token = req.query.access_token
    
    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
                .then(res => res.json())
                .then(async data => {
                    const name = data.given_name
                    const email = data.email
                    const picture = data.picture
                    const email_verified = data.email_verified
                    const locale = data.locale

                    let random1 = Math.round(getRandomArbitrary(100000, 1000000))
                    let random2 = Math.round(getRandomArbitrary(100000, 1000000))
                    let pass = `${random1}.${name}.${random2}`
                    let password = await bcrypt.hash(pass, 10)

                    User.findOne({email: email})
                        .then(async dbUser => {
                            if(!dbUser) {
                                //Registrar y loguear
                                const dbUser = new User({
                                    name: name,
                                    age: 26,
                                    email: email,
                                    password: password,
                                    avatar: picture
                                })

                                await dbUser.save()

                                const payload = {
                                    id: dbUser._id,
                                    email: dbUser.email
                                }
                                jwt.sign(
                                    payload,
                                    process.env.REACT_APP_JWT_SECRET,
                                    {expiresIn: 86400},
                                    (err, token) => {
                                        if(err) return res.json({message: err})
                                        return res.json({
                                            message: 'Success',
                                            token: "Bearer " + token
                                        })
                                    }
                                )

                            } else {
                                //Loguear
                                const payload = {
                                    id: dbUser._id,
                                    email: dbUser.email
                                }
                                jwt.sign(
                                    payload,
                                    process.env.REACT_APP_JWT_SECRET,
                                    {expiresIn: 86400},
                                    (err, token) => {
                                        if(err) return res.json({message: err})
                                        return res.json({
                                            message: 'Success',
                                            token: "Bearer " + token
                                        })
                                    }
                                )
                            }
                        })
                })
    
                /* return res.json({
                    message: 'Usuario o contraseña inválidoss'
                }) */
}  

export const isUserAuth = (req, res) => {
    return res.json({isLogin: true, email: req.user.email})
    
    /* let email = req.user.email
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
                    transactions: dbUser.transactions,
                    _id: dbUser._id
                }
                return res.json({isLogin: true, user: user})
            }
        }) */
}
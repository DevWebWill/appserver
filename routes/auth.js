import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import verifyJWT from "./verifyjwt.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    const user = req.body

    //Chequea si el usuario existe
    const takenEmail = await User.findOne({email: user.email})

    if(takenEmail) {
        res.json("Este usuario ya existe")
    } else {
        user.password = await bcrypt.hash(user.password, 10)

        const dbUser = new User({
            name: user.name,
            email: user.email.toLowerCase(),
            password: user.password
        })

        dbUser.save()
        res.json({message: 'Success'})
    }
})

router.post('/login', (req, res) => {
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
});

router.get("/isuserauth", verifyJWT, (req, res) => {
    return res.json({isLogin: true, email: req.user.email})
})

export default router;
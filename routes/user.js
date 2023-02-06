import express from "express";
import User from "../models/User.js";
import verifyJWT from "./verifyjwt.js";

const router = express.Router();

router.get('/getuser', verifyJWT, (req, res) => {
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
                    listTasks: [],
                    _id: dbUser._id
                }
                return res.json({isLogin: true, user: user})
            }
        })
})

export default router;
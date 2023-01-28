import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from "morgan";


import verifyJWT from "./routes/verifyjwt.js";
import authRoutes from "./routes/auth.js";
import User from "./models/User.js";

// DATA IMPORTS
//import User from "./models/User.js";
//import {dataUser} from "./data/index.js"

/** CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/** ROUTES */
app.get('/', function(req, res) {
    res.json({
        name: "Bill",
        age: 99
    })
});

app.use("/", authRoutes);

app.get('/getuser', verifyJWT, (req, res) => {
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
                    transactions: dbUser.transactions,
                    _id: dbUser._id
                }
                return res.json({isLogin: true, user: user})
            }
        })
})

/** MONGOOSE SETUP */
const PORT = process.env.PORT || 5001;
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT} y conectado a la base de datos`))

    /** ONLY ADD ONE TIME */
    //User.insertMany(dataUser);
}).catch((error) => console.log(`No se pudo conectar: ${error}`))

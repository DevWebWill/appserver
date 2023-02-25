import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from "morgan";


//import verifyJWT from "./routes/verifyjwt.js";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/user.js";
import taskRoutes from "./src/routes/task.js";

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
app.use("/users", userRoutes);
app.use("/task", taskRoutes);

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

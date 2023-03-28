import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from "morgan";

import http from 'http'
import { createServer } from 'http'
import  { Server } from 'socket.io';

//import verifyJWT from "./routes/verifyjwt.js";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/user.js";
import taskRoutes from "./src/routes/task.js";

// DATA IMPORTS
/* import User from "./src/models/User.model.js";
import { users } from "./data/index.js" */

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

const httpServer = http.createServer(app);
var io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8
})

let arrayRooms = [];
io.on("connection", (socket) => {
    /* socket.on("sendMessage", (message, callback) => {
        io.emit('message', message);
        callback();
    }); */

    socket.on("createTask", (task, callback) => {
        io.emit('createdTask', task);
        io.emit('newNotification', 'La tarea se ha creado correctamente');
        callback();
    });

    socket.on("deleteTask", (id) => {
        io.emit('deletedTask', id);
    });

    socket.on("updateTask", (task) => {
        io.emit('updatedTask', task);
    });

    //Chat
    socket.on("join", ({name, room}, callback) => {
        io.emit('superadmin', {client: name, room: room})

        socket.join(room)
        callback()
    });
    socket.on("joinadmin", ({name, room}, callback) => {
        socket.join(room);
        callback(room)
    });
    socket.on('sendMessage', ({name, room, message}, callback) => {
        io.to(room).emit('message', { client: name, room: room, message: message});
        callback();
    })

});

/** ROUTES */
app.get('/', function(req, res) {
    res.json({
        name: "Billyyyyy",
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
    httpServer.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT} y conectado a la base de datos`))

    /** ONLY ADD ONE TIME */
    //User.insertMany(users);
}).catch((error) => console.log(`No se pudo conectar: ${error}`))

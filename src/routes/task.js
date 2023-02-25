import express from "express";
import verifyJWT from "./verifyjwt.js";
import { deleteTask, getTask, setTask } from "../controllers/Task.controller.js";

const router = express.Router();

router.put('/set-task', verifyJWT, setTask) 

router.delete('/delete-task', verifyJWT, deleteTask)

router.get('/get-tasks', verifyJWT, getTask)

export default router;
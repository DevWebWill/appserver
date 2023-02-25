import express from "express";
import { getAllUsers, getUser } from "../controllers/User.controller.js";
import verifyJWT from "./verifyjwt.js";

const router = express.Router();

router.get('/getuser', verifyJWT, getUser)
router.get('/getallusers', verifyJWT, getAllUsers)
//router.get('/get-roles', verifyJWT, getRoles)

export default router;
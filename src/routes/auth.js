import express from "express";
import verifyJWT from "./verifyjwt.js";
import { isUserAuth, loginAuth, loginWithGoogle, registerAuth } from "../controllers/Auth.controller.js";

const router = express.Router();

router.post('/register', registerAuth)

router.post('/login', loginAuth);

router.get("/isuserauth", verifyJWT, isUserAuth)

router.post("/loginwithgoogle", loginWithGoogle)

export default router;
import express from "express";
import { register } from "../controller/auth.conteoller.js";
import { registerValidator } from "../validators/auth.validator.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", registerValidator, register);

export default AuthRouter;

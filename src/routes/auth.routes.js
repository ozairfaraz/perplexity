import express from "express";
import {
  register,
  verifyEmail,
  login,
  getMe,
} from "../controller/auth.conteoller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const AuthRouter = express.Router();

// @route POST /api/auth/register
// @desc Register a new user
// @access Public
// @body { name, email, password }
AuthRouter.post("/register", registerValidator, register);

// @route GET /api/auth/verify-email?token=
// @desc Verify user's email address
// @access Public
AuthRouter.get("/verify-email", verifyEmail);

// @route POST /api/auth/login
// @desc Authenticate user and return JWT token
// @access Public
// @body { email, password }
AuthRouter.post("/login", loginValidator, login);

// @route GET /api/auth/get-me
// @desc Get current authenticated user's info
// @access Private
AuthRouter.get("/get-me", authUser, getMe);

export default AuthRouter;

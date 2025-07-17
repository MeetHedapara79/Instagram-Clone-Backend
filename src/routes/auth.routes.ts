import express from "express";
import { forgotPassword, logout, registerUser, resetPassword, signinUser } from "../controllers/auth.controller";
import { validateSchema } from "../utils/validation";
import { forgotPasswordValidate, registerUserValidate, resetPasswordValidate, signinUserValidate } from "../validator/auth.validator";
import { verifyPwd } from "../middleware/verifyPwd.middleware";
import { jwtVerify } from "../middleware/jwtverify.middleware";

const authRoutes = express.Router();

authRoutes.post("/register", validateSchema(registerUserValidate), registerUser);

authRoutes.post("/signin", validateSchema(signinUserValidate), verifyPwd, signinUser);

authRoutes.post("/forgotPassword", validateSchema(forgotPasswordValidate), forgotPassword);

authRoutes.post("/resetPassword", validateSchema(resetPasswordValidate), resetPassword);

authRoutes.get("/logout", jwtVerify, logout);

export default authRoutes;
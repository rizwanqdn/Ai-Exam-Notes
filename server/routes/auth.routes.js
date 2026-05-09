import express from "express";
import { googleAuth, logOut } from "../controller/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/google", googleAuth);
authRoutes.get("/logout", logOut);

export default authRoutes;

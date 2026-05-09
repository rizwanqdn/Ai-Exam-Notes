import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { getUser } from "../controller/user.controller.js";

const userRoute = express.Router();
userRoute.get("/currentuser", isAuth, getUser);

export default userRoute;

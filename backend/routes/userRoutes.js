import express from "express";
import { login, register } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login); //attaching the login function found in userController.js
router.post("/register", register); //attaching the register function found in userController.js

export default router;

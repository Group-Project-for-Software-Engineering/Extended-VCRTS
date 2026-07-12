import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for login page 

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

export default router;

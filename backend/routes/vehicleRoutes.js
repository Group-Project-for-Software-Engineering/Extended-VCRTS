import express from "express";
import { submitVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/submit", submitVehicle);

export default router;

import express from "express";
import { submitVehicle, getVehiclesByOwner} from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/owner/:ownerId", getVehiclesByOwner);

router.post("/submit", submitVehicle);

export default router;

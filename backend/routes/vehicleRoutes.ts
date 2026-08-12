import express from "express";
import { submitVehicle, getVehiclesByOwner} from "../controllers/vehicleController";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for vehicles
const router = express.Router();

router.get("/owner/:ownerId", getVehiclesByOwner);

router.post("/submit", submitVehicle);

export default router;

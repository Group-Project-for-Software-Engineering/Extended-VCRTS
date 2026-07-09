import express from "express";
import { getVehicleStatus, getAllJobs } from "../distributed/dashboardController.js";

const router = express.Router();

router.get("/vehicles", getVehicleStatus);
router.get("/jobs", getAllJobs);

export default router;

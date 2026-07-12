import express from "express";
import { getVehicleStatus, getAllJobs } from "../distributed/dashboardController.js";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for admin dashboard page 

const router = express.Router();

router.get("/vehicles", getVehicleStatus);
router.get("/jobs", getAllJobs);

export default router;

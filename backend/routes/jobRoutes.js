import express from "express";
import { submitJob, getJobsByClient } from "../controllers/jobController.js";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for jobs

const router = express.Router();

router.get("/client/:clientId", getJobsByClient);

router.post("/submit", submitJob);

export default router;

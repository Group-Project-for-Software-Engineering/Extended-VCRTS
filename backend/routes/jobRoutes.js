import express from "express";
import { submitJob, getJobsByClient } from "../controllers/jobController.js";

const router = express.Router();

router.get("/client/:clientId", getJobsByClient);

router.post("/submit", submitJob);

export default router;

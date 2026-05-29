import express from "express";
import { submitJob, getJobsByOwner } from "../controllers/jobController.js";

const router = express.Router();

router.get("/client/:clientId", getJobsByOwner);

router.post("/submit", submitJob);

export default router;

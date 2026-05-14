import express from "express";
import { submitJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/submit", submitJob);

export default router;

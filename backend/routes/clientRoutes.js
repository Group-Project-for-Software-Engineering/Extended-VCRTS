import express from "express";
import { getClientJobs } from "../controllers/clientController.js";

const router = express.Router();

router.get("/jobs/:clientId", getClientJobs);

export default router;

import express from "express";
import { getClientJobs } from "../controllers/clientController";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for client

const router = express.Router();

router.get("/jobs/:clientId", getClientJobs);

export default router;

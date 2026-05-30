import express from "express";
import {
  getPendingRequests,
  approvePending,
  rejectPending
} from "../controllers/adminPendingController.js";

const router = express.Router();

router.get("/pending", getPendingRequests); //api call .../admin/pending calls the getPendingRequests function
router.post("/approve", approvePending); //api call .../admin/approve calls the approvePending function
router.post("/reject", rejectPending); //api call ... /admin/reject calls the rejectPending function

export default router;

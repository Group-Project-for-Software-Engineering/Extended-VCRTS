import express from "express";
import {
  getPendingRequests,
  approvePending,
  rejectPending
} from "../controllers/adminPendingController.js";

const router = express.Router();

router.get("/pending", getPendingRequests);
router.post("/approve", approvePending);
router.post("/reject", rejectPending);

export default router;

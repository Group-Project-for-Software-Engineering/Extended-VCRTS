import express from "express";
import {
  getNotifications,
  clearNotifications
} from "../controllers/notificationController.js";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for notifications

const router = express.Router();

router.get("/get/:userId", getNotifications);
router.post("/clear/:userId", clearNotifications);

export default router;

import express from "express";
import {
  getNotifications,
  clearNotifications,
  createNotification
} from "../controllers/notificationController";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for notifications

const router = express.Router();

router.get("/get/:userId", getNotifications);
router.post("/clear/:userId", clearNotifications);
//router.post("/notify", createNotification);

export default router;

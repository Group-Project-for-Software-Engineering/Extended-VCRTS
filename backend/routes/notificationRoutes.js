import express from "express";
import {
  getNotifications,
  clearNotifications
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/get/:userId", getNotifications);
router.post("/clear/:userId", clearNotifications);

export default router;

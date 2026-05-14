import express from "express";
import {
  getOwnerVehicles,
  getClientJobs,
  getNotifications
} from "../controllers/homeController.js";

const router = express.Router();

router.get("/owner/vehicles/:userId", getOwnerVehicles);
router.get("/client/jobs/:userId", getClientJobs);
router.get("/users/notifications/:userId", getNotifications);

export default router;

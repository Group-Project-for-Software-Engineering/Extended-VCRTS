import express from "express";
import {
  getAllUsers,
  computeCompletionTimes
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/completion-times", computeCompletionTimes);

export default router;

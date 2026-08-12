import express from "express";
import {
  getAllUsers,
  computeCompletionTimes
} from "../controllers/adminController";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for admin

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/completion-times", computeCompletionTimes);

export default router;

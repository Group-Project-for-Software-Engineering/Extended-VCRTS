import express from "express";
import {
  getAllRemovableItems,
  removeItem
} from "../controllers/adminRemovalController.js";

const router = express.Router();

router.get("/", getAllRemovableItems);
router.post("/remove", removeItem);

export default router;

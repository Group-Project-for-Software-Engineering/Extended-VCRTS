import express from "express";
import {
  getAllRemovableItems,
  removeItem
} from "../controllers/adminRemovalController";
//------------------------------------------------------------------------------
//API declaration for attachment to functions for admin removal page

const router = express.Router();

router.get("/removal", getAllRemovableItems);
router.post("/remove", removeItem);

export default router;

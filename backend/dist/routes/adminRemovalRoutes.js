"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRemovalController_1 = require("../controllers/adminRemovalController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for admin removal page
const router = express_1.default.Router();
router.get("/removal", adminRemovalController_1.getAllRemovableItems);
router.post("/remove", adminRemovalController_1.removeItem);
exports.default = router;

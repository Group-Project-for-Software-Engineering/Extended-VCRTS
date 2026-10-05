"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for admin
const router = express_1.default.Router();
router.get("/users", adminController_1.getAllUsers);
router.get("/completion-times", adminController_1.computeCompletionTimes);
exports.default = router;

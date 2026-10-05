"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for notifications
const router = express_1.default.Router();
router.get("/get/:userId", notificationController_1.getNotifications);
router.post("/clear/:userId", notificationController_1.clearNotifications);
//router.post("/notify", createNotification);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeController_1 = require("../controllers/homeController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for client/owner home page
const router = express_1.default.Router();
router.get("/owner/vehicles/:userId", homeController_1.getOwnerVehicles);
router.get("/client/jobs/:userId", homeController_1.getClientJobs);
router.get("/users/notifications/:userId", homeController_1.getNotifications);
exports.default = router;

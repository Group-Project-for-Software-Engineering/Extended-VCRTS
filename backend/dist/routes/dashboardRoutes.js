"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../distributed/dashboardController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for admin dashboard page 
const router = express_1.default.Router();
router.get("/vehicles", dashboardController_1.getVehicleStatus);
router.get("/jobs", dashboardController_1.getAllJobs);
exports.default = router;

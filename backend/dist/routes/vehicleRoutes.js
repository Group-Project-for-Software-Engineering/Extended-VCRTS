"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicleController_1 = require("../controllers/vehicleController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for vehicles
const router = express_1.default.Router();
router.get("/owner/:ownerId", vehicleController_1.getVehiclesByOwner);
router.post("/submit", vehicleController_1.submitVehicle);
exports.default = router;

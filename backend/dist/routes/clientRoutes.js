"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for client
const router = express_1.default.Router();
router.get("/jobs/:clientId", clientController_1.getClientJobs);
exports.default = router;

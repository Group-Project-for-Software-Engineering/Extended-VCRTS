"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for jobs
const router = express_1.default.Router();
router.get("/client/:clientId", jobController_1.getJobsByClient);
router.post("/submit", jobController_1.submitJob);
exports.default = router;

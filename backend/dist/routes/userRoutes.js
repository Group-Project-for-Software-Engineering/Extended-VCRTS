"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for users
const router = express_1.default.Router();
router.post("/login", userController_1.login); //attaching the login function found in userController.js
router.post("/register", userController_1.register); //attaching the register function found in userController.js
exports.default = router;

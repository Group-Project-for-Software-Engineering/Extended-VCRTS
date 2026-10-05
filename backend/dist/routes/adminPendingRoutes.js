"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminPendingController_1 = require("../controllers/adminPendingController");
//------------------------------------------------------------------------------
//API declaration for attachment to functions for admin pending page
const router = (0, express_1.Router)();
router.get("/pending", adminPendingController_1.getPendingRequests); //api call .../admin/pending calls the getPendingRequests function
router.post("/approve", adminPendingController_1.approvePending); //api call .../admin/approve calls the approvePending function
router.post("/reject", adminPendingController_1.rejectPending); //api call ... /admin/reject calls the rejectPending function
exports.default = router;

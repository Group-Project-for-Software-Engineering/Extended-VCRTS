"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// --------------------------------------------------
// Mock database
vitest_1.vi.mock("../config/db", () => ({
    db: {
        query: vitest_1.vi.fn()
    }
}));
vitest_1.vi.mock("../controllers/notificationController", () => ({
    createNotification: vitest_1.vi.fn()
}));
const adminPendingController_1 = require("../controllers/adminPendingController");
const db_1 = require("../config/db");
const adminCache_1 = require("../cache/adminCache");
const notificationController_1 = require("../controllers/notificationController");
// --------------------------------------------------
function createMockResponse() {
    return {
        json: vitest_1.vi.fn(),
        status: vitest_1.vi.fn().mockReturnThis()
    };
}
//--------------------------------------------------
(0, vitest_1.beforeEach)(() => {
    vitest_1.vi.clearAllMocks();
});
//---------------------------------------------------
//Testing getPendingRequests 
(0, vitest_1.it)("returns list of jobs and vehicles that are pending in the system", async () => {
    const res = createMockResponse();
    const pendingJobs = [
        {
            id: 1001,
            clientId: 1,
            description: "Compute simulation workload",
            duration: 3,
            deadline: "2026-09-15T17:00:00Z",
            timestamp: "2026-09-10T12:30:00Z",
            assignedVehicleId: null,
            status: "pending"
        }
    ];
    const pendingVehicles = [
        {
            id: 5001,
            ownerId: 2,
            vin: "1HGCM82633A004352",
            make: "Toyota",
            model: "Camry",
            plate: "NYC-4821",
            year: 2020,
            arrival: "2026-09-12T09:00:00Z",
            departure: "2026-09-12T17:00:00Z"
        }
    ];
    db_1.db.query
        .mockResolvedValueOnce([pendingVehicles]) // first query: pending_vehicles
        .mockResolvedValueOnce([pendingJobs]); // second query: pending_jobs
    await (0, adminPendingController_1.getPendingRequests)(res);
    const expected = [
        {
            id: 5001,
            type: "vehicle",
            formatted: `
          <strong>Vehicle Request</strong><br>
          VIN: 1HGCM82633A004352<br>
          Make: Toyota<br>
          Model: Camry<br>
          Plate: NYC-4821<br>
          Year: 2020
        `
        },
        {
            id: 1001,
            type: "job",
            formatted: `
          <strong>Job Request</strong><br>
          Description: Compute simulation workload<br>
          Duration: 3 hrs<br>
          Deadline: 2026-09-15T17:00:00Z
        `
        }
    ];
    (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
    // Use arrayContaining because MySQL2 adds hidden metadata
    (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(vitest_1.expect.arrayContaining(expected));
});
//--------------------------------------------
//Testing apporvePending 
(0, vitest_1.describe)("approvePending", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        adminCache_1.adminCache.users = [{}];
    });
    (0, vitest_1.it)("approves a pending vehicle request", async () => {
        const req = {
            body: { id: 5001, type: "vehicle" }
        };
        const res = createMockResponse();
        const pendingVehicle = [
            [
                {
                    id: 5001,
                    ownerId: 2,
                    vin: "1HGCM82633A004352",
                    make: "Toyota",
                    model: "Camry",
                    plate: "NYC-4821",
                    year: 2020,
                    arrival: "2026-09-12T09:00:00Z",
                    departure: "2026-09-12T17:00:00Z"
                }
            ]
        ];
        // Mock DB calls
        db_1.db.query
            .mockResolvedValueOnce(pendingVehicle) // SELECT pending vehicle
            .mockResolvedValueOnce([]) // INSERT into vehicles
            .mockResolvedValueOnce([]); // DELETE from pending_vehicles
        await (0, adminPendingController_1.approvePending)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(3);
        // Notification sent
        (0, vitest_1.expect)(notificationController_1.createNotification).toHaveBeenCalledWith(2, "A vehicle request has been approved by an administrator.");
        // Cache invalidated
        (0, vitest_1.expect)(adminCache_1.adminCache.users).toBeNull();
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "Approved" });
    });
    (0, vitest_1.it)("approves a pending job request", async () => {
        const req = {
            body: { id: 1001, type: "job" }
        };
        const res = createMockResponse();
        const pendingJob = [
            [
                {
                    id: 1001,
                    clientId: 1,
                    description: "Compute simulation workload",
                    duration: 3,
                    deadline: "2026-09-15T17:00:00Z",
                    timestamp: "2026-09-10T12:30:00Z",
                    assignedVehicleId: null,
                    status: "pending"
                }
            ]
        ];
        db_1.db.query
            .mockResolvedValueOnce(pendingJob) // SELECT pending job
            .mockResolvedValueOnce([]) // INSERT into jobs
            .mockResolvedValueOnce([]); // DELETE from pending_jobs
        await (0, adminPendingController_1.approvePending)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(3);
        (0, vitest_1.expect)(notificationController_1.createNotification).toHaveBeenCalledWith(1, "A job request has been approved by an administrator.");
        (0, vitest_1.expect)(adminCache_1.adminCache.users).toBeNull();
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "Approved" });
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { body: { id: 999, type: "vehicle" } };
        const res = createMockResponse();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, adminPendingController_1.approvePending)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error approving request"
        });
    });
});
//----------------------------------------------
//test reject pending function
(0, vitest_1.describe)("reject pending", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        adminCache_1.adminCache.users = [{}];
    });
    (0, vitest_1.it)("rejects a pending vehicle request", async () => {
        const req = {
            body: { id: 5001, type: "vehicle" }
        };
        const res = createMockResponse();
        const pendingVehicle = [
            [
                {
                    id: 5001,
                    ownerId: 2,
                    vin: "1HGCM82633A004352",
                    make: "Toyota",
                    model: "Camry",
                    plate: "NYC-4821",
                    year: 2020,
                    arrival: "2026-09-12T09:00:00Z",
                    departure: "2026-09-12T17:00:00Z"
                }
            ]
        ];
        // Mock DB calls
        db_1.db.query
            .mockResolvedValueOnce(pendingVehicle) // SELECT pending vehicle
            .mockResolvedValueOnce([]); // DELETE from pending_vehicles
        await (0, adminPendingController_1.rejectPending)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
        // Notification sent
        (0, vitest_1.expect)(notificationController_1.createNotification).toHaveBeenCalledWith(2, "A vehicle request has been rejected by an administrator.");
        // Cache invalidated
        (0, vitest_1.expect)(adminCache_1.adminCache.users).toBeNull();
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "Rejected" });
    });
    (0, vitest_1.it)("rejects a pending job request", async () => {
        const req = {
            body: { id: 1001, type: "job" }
        };
        const res = createMockResponse();
        const pendingJob = [
            [
                {
                    id: 1001,
                    clientId: 1,
                    description: "Compute simulation workload",
                    duration: 3,
                    deadline: "2026-09-15T17:00:00Z",
                    timestamp: "2026-09-10T12:30:00Z",
                    assignedVehicleId: null,
                    status: "pending"
                }
            ]
        ];
        db_1.db.query
            .mockResolvedValueOnce(pendingJob) // SELECT pending job
            .mockResolvedValueOnce([]); // DELETE from pending_jobs
        await (0, adminPendingController_1.rejectPending)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(notificationController_1.createNotification).toHaveBeenCalledWith(1, "A job request was rejected by an administrator.");
        (0, vitest_1.expect)(adminCache_1.adminCache.users).toBeNull();
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "Rejected" });
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { body: { id: 999, type: "vehicle" } };
        const res = createMockResponse();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, adminPendingController_1.rejectPending)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error rejecting request"
        });
    });
});

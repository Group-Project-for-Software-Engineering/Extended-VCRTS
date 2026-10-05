"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock DB
vitest_1.vi.mock("../config/db", () => ({
    db: { query: vitest_1.vi.fn() }
}));
// Import controller + model
const db_1 = require("../config/db");
const jobController_1 = require("../controllers/jobController");
const Job_1 = require("../models/Job");
// Mock Express response
function mockRes() {
    return {
        json: vitest_1.vi.fn(),
        status: vitest_1.vi.fn().mockReturnThis()
    };
}
(0, vitest_1.beforeEach)(() => {
    vitest_1.vi.clearAllMocks();
});
//
// --------------------------------------------------
// submitJob
// --------------------------------------------------
(0, vitest_1.describe)("submitJob", () => {
    (0, vitest_1.it)("submits job and notifies admin", async () => {
        const req = {
            body: {
                clientId: 10,
                description: "Compute workload",
                duration: 3,
                deadline: "2026-09-15"
            }
        };
        const res = mockRes();
        db_1.db.query
            .mockResolvedValueOnce([]) // INSERT pending_jobs
            .mockResolvedValueOnce([]); // INSERT notifications
        await (0, jobController_1.submitJob)(req, res);
        // First INSERT
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith(vitest_1.expect.stringContaining("INSERT INTO pending_jobs"), [10, "Compute workload", 3, "2026-09-15"]);
        // Second INSERT
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith(vitest_1.expect.stringContaining("INSERT INTO notifications"), [4, "New job pending approval from client 10"]);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Job submitted for approval"
        });
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = {
            body: { clientId: 10, description: "X", duration: 1, deadline: "2026" }
        };
        const res = mockRes();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, jobController_1.submitJob)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Server error submitting job"
        });
    });
});
//
// --------------------------------------------------
// getJobsByClient
// --------------------------------------------------
(0, vitest_1.describe)("getJobsByClient", () => {
    (0, vitest_1.it)("returns formatted jobs", async () => {
        const req = { params: { clientId: "10" } };
        const res = mockRes();
        const rows = [
            {
                id: 1,
                clientId: 10,
                description: "Job A",
                duration: 3,
                deadline: "2026-01-01",
                timestamp: "2026-01-01T10:00:00Z",
                assignedVehicleId: null,
                status: "pending"
            },
            {
                id: 2,
                clientId: 10,
                description: "Job B",
                duration: 2,
                deadline: "2026-01-02",
                timestamp: "2026-01-02T10:00:00Z",
                assignedVehicleId: 5,
                status: "active"
            }
        ];
        db_1.db.query.mockResolvedValueOnce([rows]);
        await (0, jobController_1.getJobsByClient)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT * FROM jobs WHERE clientId=?", ["10"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(rows.map(Job_1.formatJob));
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { params: { clientId: "10" } };
        const res = mockRes();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, jobController_1.getJobsByClient)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error loading jobs"
        });
    });
});

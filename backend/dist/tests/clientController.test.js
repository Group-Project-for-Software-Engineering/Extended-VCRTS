"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock DB
vitest_1.vi.mock("../config/db", () => ({
    db: { query: vitest_1.vi.fn() }
}));
// Mock formatJob
vitest_1.vi.mock("../utils/formatJob", () => ({
    formatJob: vitest_1.vi.fn(job => ({ ...job, formatted: true }))
}));
const db_1 = require("../config/db");
const clientController_1 = require("../controllers/clientController");
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
(0, vitest_1.describe)("getClientJobs", () => {
    (0, vitest_1.it)("returns formatted jobs for a client", async () => {
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
        await (0, clientController_1.getClientJobs)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT * FROM jobs WHERE clientId = ? ORDER BY timestamp DESC", ["10"]);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith([
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
        ]);
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { params: { clientId: "10" } };
        const res = mockRes();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, clientController_1.getClientJobs)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error loading client jobs"
        });
    });
});

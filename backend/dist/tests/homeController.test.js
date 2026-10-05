"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock DB
vitest_1.vi.mock("../config/db", () => ({
    db: { query: vitest_1.vi.fn() }
}));
const db_1 = require("../config/db");
const homeController_1 = require("../controllers/homeController");
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
// getOwnerVehicles
// --------------------------------------------------
(0, vitest_1.describe)("getOwnerVehicles", () => {
    (0, vitest_1.it)("returns vehicles for an owner", async () => {
        const req = { params: { userId: "5" } };
        const res = mockRes();
        const rows = [{ id: 1, make: "Honda" }];
        db_1.db.query.mockResolvedValueOnce([rows]);
        await (0, homeController_1.getOwnerVehicles)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT * FROM vehicles WHERE ownerId = ?", ["5"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(rows);
    });
});
//
// --------------------------------------------------
// getClientJobs
// --------------------------------------------------
(0, vitest_1.describe)("getClientJobs", () => {
    (0, vitest_1.it)("returns jobs for a client", async () => {
        const req = { params: { userId: "10" } };
        const res = mockRes();
        const rows = [{ id: 1, description: "Job A" }];
        db_1.db.query.mockResolvedValueOnce([rows]);
        await (0, homeController_1.getClientJobs)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT * FROM jobs WHERE clientId = ?", ["10"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(rows);
    });
});
//
// --------------------------------------------------
// getNotifications (with DELETE)
// --------------------------------------------------
(0, vitest_1.describe)("getNotifications", () => {
    (0, vitest_1.it)("returns notifications and clears them", async () => {
        const req = { params: { userId: "7" } };
        const res = mockRes();
        const rows = [{ id: 1, message: "Hello" }];
        db_1.db.query
            .mockResolvedValueOnce([rows]) // SELECT
            .mockResolvedValueOnce([]); // DELETE
        await (0, homeController_1.getNotifications)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT * FROM notifications WHERE userId = ?", ["7"]);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("DELETE FROM notifications WHERE userId = ?", ["7"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(rows);
    });
});

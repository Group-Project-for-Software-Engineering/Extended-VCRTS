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
const adminRemovalController_1 = require("../controllers/adminRemovalController");
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
// getAllRemovableItems
(0, vitest_1.describe)("get all vehicles and jobs in the system", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        adminCache_1.adminCache.users = [{}];
    });
    (0, vitest_1.it)("returns formatted vehicles and jobs", async () => {
        const res = createMockResponse();
        const vehicles = [
            {
                id: 1,
                userId: 10,
                vin: "VIN123",
                make: "Honda",
                model: "Civic",
                plate: "NY-123",
                year: 2020,
                arrival: "2026-09-12T09:00:00Z",
                departure: "2026-09-12T17:00:00Z",
                dayRegistered: "2026-09-10"
            }
        ];
        const jobs = [
            {
                id: 2,
                userId: 20,
                description: "Compute workload",
                duration: 5,
                deadline: "2026-09-15T17:00:00Z",
                status: "active",
                assignedVehicleId: null
            }
        ];
        db_1.db.query
            .mockResolvedValueOnce([vehicles]) // SELECT vehicles
            .mockResolvedValueOnce([jobs]); // SELECT jobs
        await (0, adminRemovalController_1.getAllRemovableItems)(res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(res.json).toHaveBeenCalled();
        const output = res.json.mock.calls[0][0];
        (0, vitest_1.expect)(output.length).toBe(2);
        (0, vitest_1.expect)(output[0].type).toBe("vehicle");
        (0, vitest_1.expect)(output[1].type).toBe("job");
    });
    (0, vitest_1.it)("returns 500 on DB error", async () => {
        const res = createMockResponse();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, adminRemovalController_1.getAllRemovableItems)(res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error loading removal items"
        });
    });
});
// --------------------------------------------------
// removeItem
(0, vitest_1.describe)("remove job or vehicle from the system", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        adminCache_1.adminCache.users = [{}];
    });
    (0, vitest_1.it)("removes a vehicle and sends notification", async () => {
        const req = {
            body: { id: 5001, type: "vehicle" }
        };
        const res = createMockResponse();
        const vehicleRow = [[{ ownerId: 2 }]];
        db_1.db.query
            .mockResolvedValueOnce(vehicleRow) // SELECT ownerId
            .mockResolvedValueOnce([]); // DELETE
        await (0, adminRemovalController_1.removeItem)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(notificationController_1.createNotification).toHaveBeenCalledWith(2, "A vehicle has been removed by an administrator.");
        (0, vitest_1.expect)(adminCache_1.adminCache.users).toBeNull();
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "Item removed" });
    });
    (0, vitest_1.it)("removes a job and sends notification", async () => {
        const req = {
            body: { id: 1001, type: "job" }
        };
        const res = createMockResponse();
        const jobRow = [[{ clientId: 1 }]];
        db_1.db.query
            .mockResolvedValueOnce(jobRow) // SELECT clientId
            .mockResolvedValueOnce([]); // DELETE
        await (0, adminRemovalController_1.removeItem)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(notificationController_1.createNotification).toHaveBeenCalledWith(1, "A job has been removed by an administrator.");
        (0, vitest_1.expect)(adminCache_1.adminCache.users).toBeNull();
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "Item removed" });
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { body: { id: 999, type: "vehicle" } };
        const res = createMockResponse();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, adminRemovalController_1.removeItem)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error removing item"
        });
    });
});

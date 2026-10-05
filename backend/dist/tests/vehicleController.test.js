"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock DB
vitest_1.vi.mock("../config/db", () => ({
    db: { query: vitest_1.vi.fn() }
}));
const db_1 = require("../config/db");
const vehicleController_1 = require("../controllers/vehicleController");
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
// submitVehicle
// --------------------------------------------------
(0, vitest_1.describe)("submitVehicle", () => {
    (0, vitest_1.it)("submits vehicle and notifies admin", async () => {
        const req = {
            body: {
                ownerId: 10,
                vin: "VIN123",
                make: "Toyota",
                model: "Camry",
                plate: "NY-123",
                year: 2020,
                arrival: "2026-09-12T09:00:00Z",
                departure: "2026-09-12T17:00:00Z"
            }
        };
        const res = mockRes();
        db_1.db.query
            .mockResolvedValueOnce([]) // INSERT pending_vehicles
            .mockResolvedValueOnce([]); // INSERT notifications
        await (0, vehicleController_1.submitVehicle)(req, res);
        // First INSERT
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith(vitest_1.expect.stringContaining("INSERT INTO pending_vehicles"), [
            10,
            "VIN123",
            "Toyota",
            "Camry",
            "NY-123",
            2020,
            "2026-09-12T09:00:00Z",
            "2026-09-12T17:00:00Z"
        ]);
        // Second INSERT (notification)
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith(vitest_1.expect.stringContaining("INSERT INTO notifications"), [4, "New vehicle pending approval from owner 10"]);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Vehicle submitted for approval"
        });
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = {
            body: {
                ownerId: 10,
                vin: "VIN123",
                make: "Toyota",
                model: "Camry",
                plate: "NY-123",
                year: 2020,
                arrival: "2026-09-12T09:00:00Z",
                departure: "2026-09-12T17:00:00Z"
            }
        };
        const res = mockRes();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, vehicleController_1.submitVehicle)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Server error submitting vehicle"
        });
    });
});
//
// --------------------------------------------------
// getVehiclesByOwner
// --------------------------------------------------
(0, vitest_1.describe)("getVehiclesByOwner", () => {
    (0, vitest_1.it)("returns vehicles for an owner", async () => {
        const req = { params: { ownerId: "10" } };
        const res = mockRes();
        const rows = [
            { id: 1, make: "Toyota", model: "Camry" },
            { id: 2, make: "Honda", model: "Civic" }
        ];
        db_1.db.query.mockResolvedValueOnce([rows]);
        await (0, vehicleController_1.getVehiclesByOwner)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT * FROM vehicles WHERE ownerId=?", ["10"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(rows);
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { params: { ownerId: "10" } };
        const res = mockRes();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, vehicleController_1.getVehiclesByOwner)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error loading vehicles"
        });
    });
});

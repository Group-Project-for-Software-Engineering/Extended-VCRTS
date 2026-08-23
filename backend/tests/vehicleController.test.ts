import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DB
vi.mock("../config/db", () => ({
  db: { query: vi.fn() }
}));

import { db } from "../config/db";
import { submitVehicle, getVehiclesByOwner } from "../controllers/vehicleController";

// Mock Express response
function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis()
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

//
// --------------------------------------------------
// submitVehicle
// --------------------------------------------------
describe("submitVehicle", () => {
  it("submits vehicle and notifies admin", async () => {
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
    } as any;

    const res = mockRes();

    (db.query as any)
      .mockResolvedValueOnce([]) // INSERT pending_vehicles
      .mockResolvedValueOnce([]); // INSERT notifications

    await submitVehicle(req as any, res as any);

    // First INSERT
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO pending_vehicles"),
      [
        10,
        "VIN123",
        "Toyota",
        "Camry",
        "NY-123",
        2020,
        "2026-09-12T09:00:00Z",
        "2026-09-12T17:00:00Z"
      ]
    );

    // Second INSERT (notification)
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO notifications"),
      [4, "New vehicle pending approval from owner 10"]
    );

    expect(db.query).toHaveBeenCalledTimes(2);

    expect(res.json).toHaveBeenCalledWith({
      message: "Vehicle submitted for approval"
    });
  });

  it("returns 500 when DB fails", async () => {
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
    } as any;

    const res = mockRes();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await submitVehicle(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error submitting vehicle"
    });
  });
});

//
// --------------------------------------------------
// getVehiclesByOwner
// --------------------------------------------------
describe("getVehiclesByOwner", () => {
  it("returns vehicles for an owner", async () => {
    const req = { params: { ownerId: "10" } } as any;
    const res = mockRes();

    const rows = [
      { id: 1, make: "Toyota", model: "Camry" },
      { id: 2, make: "Honda", model: "Civic" }
    ];

    (db.query as any).mockResolvedValueOnce([rows]);

    await getVehiclesByOwner(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM vehicles WHERE ownerId=?",
      ["10"]
    );

    expect(res.json).toHaveBeenCalledWith(rows);
  });

  it("returns 500 when DB fails", async () => {
    const req = { params: { ownerId: "10" } } as any;
    const res = mockRes();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await getVehiclesByOwner(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error loading vehicles"
    });
  });
});

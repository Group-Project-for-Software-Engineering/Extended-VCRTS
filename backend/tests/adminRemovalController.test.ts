import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------------------------------------
// Mock database
vi.mock("../config/db", () => ({
    db: {
        query: vi.fn()
    }
}));

vi.mock("../controllers/notificationController", () => ({
  createNotification: vi.fn()
}));

// --------------------------------------------------
// Now import everything else
import { Response, Request } from "express";
import { getAllRemovableItems, removeItem } from "../controllers/adminRemovalController";
import { db } from "../config/db";
import { adminCache } from "../cache/adminCache";
import { createNotification } from "../controllers/notificationController";

// --------------------------------------------------

function createMockResponse() {
    return {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
    };
}

//--------------------------------------------------
// getAllRemovableItems
describe("get all vehicles and jobs in the system", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    adminCache.users = [{} as any];
  });

  it("returns formatted vehicles and jobs", async () => {
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

    (db.query as any)
      .mockResolvedValueOnce([vehicles]) // SELECT vehicles
      .mockResolvedValueOnce([jobs]);    // SELECT jobs

    await getAllRemovableItems(res as any);

    expect(db.query).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalled();

    const output = res.json.mock.calls[0][0];

    expect(output.length).toBe(2);
    expect(output[0].type).toBe("vehicle");
    expect(output[1].type).toBe("job");
  });

  it("returns 500 on DB error", async () => {
    const res = createMockResponse();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await getAllRemovableItems(res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error loading removal items"
    });
  });
});

// --------------------------------------------------
// removeItem
describe("remove job or vehicle from the system", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    adminCache.users = [{} as any];
  });

  it("removes a vehicle and sends notification", async () => {
    const req = {
      body: { id: 5001, type: "vehicle" }
    } as any;

    const res = createMockResponse();

    const vehicleRow = [[{ ownerId: 2 }]];

    (db.query as any)
      .mockResolvedValueOnce(vehicleRow) // SELECT ownerId
      .mockResolvedValueOnce([]);        // DELETE

    await removeItem(req as any, res as any);

    expect(db.query).toHaveBeenCalledTimes(2);

    expect(createNotification).toHaveBeenCalledWith(
      2,
      "A vehicle has been removed by an administrator."
    );

    expect(adminCache.users).toBeNull();
    expect(res.json).toHaveBeenCalledWith({ message: "Item removed" });
  });

  it("removes a job and sends notification", async () => {
    const req = {
      body: { id: 1001, type: "job" }
    } as any;

    const res = createMockResponse();

    const jobRow = [[{ clientId: 1 }]];

    (db.query as any)
      .mockResolvedValueOnce(jobRow) // SELECT clientId
      .mockResolvedValueOnce([]);    // DELETE

    await removeItem(req as any, res as any);

    expect(db.query).toHaveBeenCalledTimes(2);

    expect(createNotification).toHaveBeenCalledWith(
      1,
      "A job has been removed by an administrator."
    );

    expect(adminCache.users).toBeNull();
    expect(res.json).toHaveBeenCalledWith({ message: "Item removed" });
  });

  it("returns 500 when DB fails", async () => {
    const req = { body: { id: 999, type: "vehicle" } } as any;
    const res = createMockResponse();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await removeItem(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error removing item"
    });
  });
});
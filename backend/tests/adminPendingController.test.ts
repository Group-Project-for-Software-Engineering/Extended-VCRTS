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
import { getPendingRequests, approvePending, rejectPending } from "../controllers/adminPendingController";
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

beforeEach(() => {
    vi.clearAllMocks();
});

//---------------------------------------------------

//Testing getPendingRequests 

it("returns list of jobs and vehicles that are pending in the system", async () => {
    const res = createMockResponse()

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

    (db.query as any)
      .mockResolvedValueOnce([pendingVehicles]) // first query: pending_vehicles
      .mockResolvedValueOnce([pendingJobs]);    // second query: pending_jobs

    
    await getPendingRequests(res as any)

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

    expect(db.query).toHaveBeenCalledTimes(2);

    // Use arrayContaining because MySQL2 adds hidden metadata
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining(expected)
    );
    
})

//--------------------------------------------

//Testing apporvePending 

describe("approvePending", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    adminCache.users = [{} as any];
  });

  it("approves a pending vehicle request", async () => {
    
    const req = {
      body: { id: 5001, type: "vehicle" }
    } as any;

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
    (db.query as any)
      .mockResolvedValueOnce(pendingVehicle) // SELECT pending vehicle
      .mockResolvedValueOnce([])            // INSERT into vehicles
      .mockResolvedValueOnce([]);           // DELETE from pending_vehicles

    await approvePending(req as any, res as any);

    expect(db.query).toHaveBeenCalledTimes(3);

    // Notification sent
    expect(createNotification).toHaveBeenCalledWith(
      2,
      "A vehicle request has been approved by an administrator."
    );

    // Cache invalidated
    expect(adminCache.users).toBeNull();

    expect(res.json).toHaveBeenCalledWith({ message: "Approved" });
  });

  it("approves a pending job request", async () => {
    const req = {
      body: { id: 1001, type: "job" }
    } as any;

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

    (db.query as any)
      .mockResolvedValueOnce(pendingJob) // SELECT pending job
      .mockResolvedValueOnce([])         // INSERT into jobs
      .mockResolvedValueOnce([]);        // DELETE from pending_jobs

    await approvePending(req as any, res as any);

    expect(db.query).toHaveBeenCalledTimes(3);

    expect(createNotification).toHaveBeenCalledWith(
      1,
      "A job request has been approved by an administrator."
    );

    expect(adminCache.users).toBeNull();

    expect(res.json).toHaveBeenCalledWith({ message: "Approved" });
  });

  it("returns 500 when DB fails", async () => {
    const req = { body: { id: 999, type: "vehicle" } } as any;
    const res = createMockResponse();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await approvePending(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error approving request"
    });
  });

});
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DB
vi.mock("../config/db", () => ({
  db: { query: vi.fn() }
}));

// Import controller + model
import { db } from "../config/db";
import { submitJob, getJobsByClient } from "../controllers/jobController";
import { formatJob } from "../models/Job";

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
// submitJob
// --------------------------------------------------
describe("submitJob", () => {
  it("submits job and notifies admin", async () => {
    const req = {
      body: {
        clientId: 10,
        description: "Compute workload",
        duration: 3,
        deadline: "2026-09-15"
      }
    } as any;

    const res = mockRes();

    (db.query as any)
      .mockResolvedValueOnce([]) // INSERT pending_jobs
      .mockResolvedValueOnce([]); // INSERT notifications

    await submitJob(req as any, res as any);

    // First INSERT
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO pending_jobs"),
      [10, "Compute workload", 3, "2026-09-15"]
    );

    // Second INSERT
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO notifications"),
      [4, "New job pending approval from client 10"]
    );

    expect(db.query).toHaveBeenCalledTimes(2);

    expect(res.json).toHaveBeenCalledWith({
      message: "Job submitted for approval"
    });
  });

  it("returns 500 when DB fails", async () => {
    const req = {
      body: { clientId: 10, description: "X", duration: 1, deadline: "2026" }
    } as any;

    const res = mockRes();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await submitJob(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error submitting job"
    });
  });
});

//
// --------------------------------------------------
// getJobsByClient
// --------------------------------------------------
describe("getJobsByClient", () => {
  it("returns formatted jobs", async () => {
    const req = { params: { clientId: "10" } } as any;
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

    (db.query as any).mockResolvedValueOnce([rows]);

    await getJobsByClient(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM jobs WHERE clientId=?",
      ["10"]
    );

    expect(res.json).toHaveBeenCalledWith(rows.map(formatJob));
  });

  it("returns 500 when DB fails", async () => {
    const req = { params: { clientId: "10" } } as any;
    const res = mockRes();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await getJobsByClient(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error loading jobs"
    });
  });
});

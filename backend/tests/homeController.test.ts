import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DB
vi.mock("../config/db", () => ({
  db: { query: vi.fn() }
}));

import { db } from "../config/db";
import {
  getOwnerVehicles,
  getClientJobs,
  getNotifications
} from "../controllers/homeController";

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
// getOwnerVehicles
// --------------------------------------------------
describe("getOwnerVehicles", () => {
  it("returns vehicles for an owner", async () => {
    const req = { params: { userId: "5" } } as any;
    const res = mockRes();

    const rows = [{ id: 1, make: "Honda" }];

    (db.query as any).mockResolvedValueOnce([rows]);

    await getOwnerVehicles(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM vehicles WHERE ownerId = ?",
      ["5"]
    );

    expect(res.json).toHaveBeenCalledWith(rows);
  });
});

//
// --------------------------------------------------
// getClientJobs
// --------------------------------------------------
describe("getClientJobs", () => {
  it("returns jobs for a client", async () => {
    const req = { params: { userId: "10" } } as any;
    const res = mockRes();

    const rows = [{ id: 1, description: "Job A" }];

    (db.query as any).mockResolvedValueOnce([rows]);

    await getClientJobs(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM jobs WHERE clientId = ?",
      ["10"]
    );

    expect(res.json).toHaveBeenCalledWith(rows);
  });
});

//
// --------------------------------------------------
// getNotifications (with DELETE)
// --------------------------------------------------
describe("getNotifications", () => {
  it("returns notifications and clears them", async () => {
    const req = { params: { userId: "7" } } as any;
    const res = mockRes();

    const rows = [{ id: 1, message: "Hello" }];

    (db.query as any)
      .mockResolvedValueOnce([rows]) // SELECT
      .mockResolvedValueOnce([]);    // DELETE

    await getNotifications(req as any, res as any);

    expect(db.query).toHaveBeenCalledTimes(2);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM notifications WHERE userId = ?",
      ["7"]
    );

    expect(db.query).toHaveBeenCalledWith(
      "DELETE FROM notifications WHERE userId = ?",
      ["7"]
    );

    expect(res.json).toHaveBeenCalledWith(rows);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DB
vi.mock("../config/db", () => ({
  db: { query: vi.fn() }
}));

import { db } from "../config/db";
import {
  getNotifications,
  createNotification,
  clearNotifications
} from "../controllers/notificationController";

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
// getNotifications
// --------------------------------------------------
describe("getNotifications", () => {
  it("returns notifications for a user", async () => {
    const req = { params: { userId: "7" } } as any;
    const res = mockRes();

    const rows = [
      { id: 1, message: "Hello", timestamp: "2026-01-01T10:00:00Z" }
    ];

    (db.query as any).mockResolvedValueOnce([rows]);

    await getNotifications(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, message, timestamp FROM notifications WHERE userId = ? ORDER BY timestamp DESC",
      ["7"]
    );

    expect(res.json).toHaveBeenCalledWith(rows);
  });

  it("returns 500 when DB fails", async () => {
    const req = { params: { userId: "7" } } as any;
    const res = mockRes();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await getNotifications(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error loading notifications"
    });
  });
});

//
// --------------------------------------------------
// createNotification
// --------------------------------------------------
describe("createNotification", () => {
  it("inserts a notification", async () => {
    (db.query as any).mockResolvedValueOnce([]);

    await createNotification(5, "Test message");

    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO notifications (userId, message) VALUES (?, ?)",
      [5, "Test message"]
    );
  });
});

//
// --------------------------------------------------
// clearNotifications
// --------------------------------------------------
describe("clearNotifications", () => {
  it("clears notifications for a user", async () => {
    const req = { params: { userId: "9" } } as any;
    const res = mockRes();

    (db.query as any).mockResolvedValueOnce([]);

    await clearNotifications(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "DELETE FROM notifications WHERE userId = ?",
      ["9"]
    );

    expect(res.json).toHaveBeenCalledWith({
      message: "Notifications cleared"
    });
  });

  it("returns 500 when DB fails", async () => {
    const req = { params: { userId: "9" } } as any;
    const res = mockRes();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await clearNotifications(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error clearing notifications"
    });
  });
});

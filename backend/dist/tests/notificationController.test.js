"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock DB
vitest_1.vi.mock("../config/db", () => ({
    db: { query: vitest_1.vi.fn() }
}));
const db_1 = require("../config/db");
const notificationController_1 = require("../controllers/notificationController");
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
// getNotifications
// --------------------------------------------------
(0, vitest_1.describe)("getNotifications", () => {
    (0, vitest_1.it)("returns notifications for a user", async () => {
        const req = { params: { userId: "7" } };
        const res = mockRes();
        const rows = [
            { id: 1, message: "Hello", timestamp: "2026-01-01T10:00:00Z" }
        ];
        db_1.db.query.mockResolvedValueOnce([rows]);
        await (0, notificationController_1.getNotifications)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT id, message, timestamp FROM notifications WHERE userId = ? ORDER BY timestamp DESC", ["7"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(rows);
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { params: { userId: "7" } };
        const res = mockRes();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, notificationController_1.getNotifications)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error loading notifications"
        });
    });
});
//
// --------------------------------------------------
// createNotification
// --------------------------------------------------
(0, vitest_1.describe)("createNotification", () => {
    (0, vitest_1.it)("inserts a notification", async () => {
        db_1.db.query.mockResolvedValueOnce([]);
        await (0, notificationController_1.createNotification)(5, "Test message");
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("INSERT INTO notifications (userId, message) VALUES (?, ?)", [5, "Test message"]);
    });
});
//
// --------------------------------------------------
// clearNotifications
// --------------------------------------------------
(0, vitest_1.describe)("clearNotifications", () => {
    (0, vitest_1.it)("clears notifications for a user", async () => {
        const req = { params: { userId: "9" } };
        const res = mockRes();
        db_1.db.query.mockResolvedValueOnce([]);
        await (0, notificationController_1.clearNotifications)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("DELETE FROM notifications WHERE userId = ?", ["9"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Notifications cleared"
        });
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { params: { userId: "9" } };
        const res = mockRes();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, notificationController_1.clearNotifications)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Error clearing notifications"
        });
    });
});

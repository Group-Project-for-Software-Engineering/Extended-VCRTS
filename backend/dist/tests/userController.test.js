"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock DB
vitest_1.vi.mock("../config/db", () => ({
    db: { query: vitest_1.vi.fn() }
}));
const db_1 = require("../config/db");
const userController_1 = require("../controllers/userController");
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
// login
// --------------------------------------------------
(0, vitest_1.describe)("login", () => {
    (0, vitest_1.it)("returns 400 for invalid username or password", async () => {
        const req = { body: { username: "justin", password: "wrong" } };
        const res = mockRes();
        // No rows returned → invalid login
        db_1.db.query.mockResolvedValueOnce([[]]);
        await (0, userController_1.login)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ? AND password = ?", ["justin", "wrong"]);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Invalid username or password"
        });
    });
    (0, vitest_1.it)("logs in successfully", async () => {
        const req = { body: { username: "justin", password: "pass123" } };
        const res = mockRes();
        const rows = [
            [
                {
                    id: 1,
                    username: "justin",
                    password: "pass123",
                    userType: "client"
                }
            ]
        ];
        db_1.db.query.mockResolvedValueOnce(rows);
        await (0, userController_1.login)(req, res);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Login successful",
            userType: "client"
        });
    });
});
//
// --------------------------------------------------
// register
// --------------------------------------------------
(0, vitest_1.describe)("register", () => {
    (0, vitest_1.it)("returns 400 when username already exists", async () => {
        const req = {
            body: {
                username: "justin",
                email: "j@x.com",
                password: "pass123",
                userType: "client"
            }
        };
        const res = mockRes();
        // Username exists
        db_1.db.query.mockResolvedValueOnce([[{ id: 1 }]]);
        await (0, userController_1.register)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", ["justin"]);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Username already exists"
        });
    });
    (0, vitest_1.it)("registers a new user successfully", async () => {
        const req = {
            body: {
                username: "newUser",
                email: "new@x.com",
                password: "pass123",
                userType: "owner"
            }
        };
        const res = mockRes();
        // Username does NOT exist
        db_1.db.query.mockResolvedValueOnce([[]]); // SELECT username
        db_1.db.query.mockResolvedValueOnce([]); // INSERT user
        await (0, userController_1.register)(req, res);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith("INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)", ["newUser", "new@x.com", "pass123", "owner"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "User created" });
    });
});

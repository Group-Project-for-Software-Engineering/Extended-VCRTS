"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// --------------------------------------------------
// Mocks
vitest_1.vi.mock("bcryptjs", () => ({
    default: {
        hash: vitest_1.vi.fn(),
        compare: vitest_1.vi.fn()
    }
}));
vitest_1.vi.mock("../config/db", () => ({
    db: {
        query: vitest_1.vi.fn()
    }
}));
// --------------------------------------------------
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const authController_1 = require("../controllers/authController");
// --------------------------------------------------
function createMockResponse() {
    return {
        json: vitest_1.vi.fn(),
        status: vitest_1.vi.fn().mockReturnThis()
    };
}
// --------------------------------------------------
(0, vitest_1.describe)("registerUser", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns 400 when fields are missing", async () => {
        const req = { body: { username: "", password: "", userType: "" } };
        const res = createMockResponse();
        await (0, authController_1.registerUser)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "Missing fields" });
    });
    (0, vitest_1.it)("registers a user successfully", async () => {
        const req = {
            body: { username: "justin", password: "pass123", userType: "client" }
        };
        const res = createMockResponse();
        bcryptjs_1.default.hash.mockResolvedValue("hashed_pw");
        db_1.db.query.mockResolvedValueOnce([{ insertId: 1 }]);
        await (0, authController_1.registerUser)(req, res);
        (0, vitest_1.expect)(bcryptjs_1.default.hash).toHaveBeenCalledWith("pass123", 10);
        (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledWith(vitest_1.expect.stringContaining("INSERT INTO users"), ["justin", "hashed_pw", "client"]);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "User registered successfully"
        });
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = {
            body: { username: "justin", password: "pass123", userType: "client" }
        };
        const res = createMockResponse();
        bcryptjs_1.default.hash.mockResolvedValue("hashed_pw");
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, authController_1.registerUser)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Registration failed"
        });
    });
});
// --------------------------------------------------
(0, vitest_1.describe)("loginUser", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns 400 when user is not found", async () => {
        const req = { body: { username: "ghost", password: "123" } };
        const res = createMockResponse();
        db_1.db.query.mockResolvedValueOnce([[]]); // no rows
        await (0, authController_1.loginUser)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
    (0, vitest_1.it)("returns 400 when password is incorrect", async () => {
        const req = { body: { username: "justin", password: "wrong" } };
        const res = createMockResponse();
        const userRow = [
            [
                {
                    id: 1,
                    username: "justin",
                    password: "hashed_pw",
                    userType: "client"
                }
            ]
        ];
        db_1.db.query.mockResolvedValueOnce(userRow);
        bcryptjs_1.default.compare.mockResolvedValue(false);
        await (0, authController_1.loginUser)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ message: "Incorrect password" });
    });
    (0, vitest_1.it)("logs in user successfully", async () => {
        const req = { body: { username: "justin", password: "pass123" } };
        const res = createMockResponse();
        const userRow = [
            [
                {
                    id: 1,
                    username: "justin",
                    password: "hashed_pw",
                    userType: "client"
                }
            ]
        ];
        db_1.db.query.mockResolvedValueOnce(userRow);
        bcryptjs_1.default.compare.mockResolvedValue(true);
        await (0, authController_1.loginUser)(req, res);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            id: 1,
            username: "justin",
            userType: "client"
        });
    });
    (0, vitest_1.it)("returns 500 when DB fails", async () => {
        const req = { body: { username: "justin", password: "pass123" } };
        const res = createMockResponse();
        db_1.db.query.mockRejectedValue(new Error("DB failure"));
        await (0, authController_1.loginUser)(req, res);
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Server error"
        });
    });
});

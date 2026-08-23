import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DB
vi.mock("../config/db", () => ({
  db: { query: vi.fn() }
}));

import { db } from "../config/db";
import { login, register } from "../controllers/userController";

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
// login
// --------------------------------------------------
describe("login", () => {
  it("returns 400 for invalid username or password", async () => {
    const req = { body: { username: "justin", password: "wrong" } } as any;
    const res = mockRes();

    // No rows returned → invalid login
    (db.query as any).mockResolvedValueOnce([[]]);

    await login(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      ["justin", "wrong"]
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid username or password"
    });
  });

  it("logs in successfully", async () => {
    const req = { body: { username: "justin", password: "pass123" } } as any;
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

    (db.query as any).mockResolvedValueOnce(rows);

    await login(req as any, res as any);

    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      userType: "client"
    });
  });
});

//
// --------------------------------------------------
// register
// --------------------------------------------------
describe("register", () => {
  it("returns 400 when username already exists", async () => {
    const req = {
      body: {
        username: "justin",
        email: "j@x.com",
        password: "pass123",
        userType: "client"
      }
    } as any;

    const res = mockRes();

    // Username exists
    (db.query as any).mockResolvedValueOnce([[{ id: 1 }]]);

    await register(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE username = ?",
      ["justin"]
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username already exists"
    });
  });

  it("registers a new user successfully", async () => {
    const req = {
      body: {
        username: "newUser",
        email: "new@x.com",
        password: "pass123",
        userType: "owner"
      }
    } as any;

    const res = mockRes();

    // Username does NOT exist
    (db.query as any).mockResolvedValueOnce([[]]); // SELECT username
    (db.query as any).mockResolvedValueOnce([]);   // INSERT user

    await register(req as any, res as any);

    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)",
      ["newUser", "new@x.com", "pass123", "owner"]
    );

    expect(res.json).toHaveBeenCalledWith({ message: "User created" });
  });
});

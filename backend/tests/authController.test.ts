import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------------------------------------
// Mocks
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

vi.mock("../config/db", () => ({
  db: {
    query: vi.fn()
  }
}));

// --------------------------------------------------
import bcrypt from "bcryptjs";
import { Response, Request } from "express";
import { db } from "../config/db";
import { registerUser, loginUser } from "../controllers/authController";

// --------------------------------------------------
function createMockResponse() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis()
  };
}

// --------------------------------------------------
describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when fields are missing", async () => {
    const req = { body: { username: "", password: "", userType: "" } } as any;
    const res = createMockResponse();

    await registerUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing fields" });
  });

  it("registers a user successfully", async () => {
    const req = {
      body: { username: "justin", password: "pass123", userType: "client" }
    } as any;

    const res = createMockResponse();

    (bcrypt.hash as any).mockResolvedValue("hashed_pw");

    (db.query as any).mockResolvedValueOnce([{ insertId: 1 }]);

    await registerUser(req as any, res as any);

    expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users"),
      ["justin", "hashed_pw", "client"]
    );

    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully"
    });
  });

  it("returns 500 when DB fails", async () => {
    const req = {
      body: { username: "justin", password: "pass123", userType: "client" }
    } as any;

    const res = createMockResponse();

    (bcrypt.hash as any).mockResolvedValue("hashed_pw");
    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await registerUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Registration failed"
    });
  });
});

// --------------------------------------------------
describe("loginUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when user is not found", async () => {
    const req = { body: { username: "ghost", password: "123" } } as any;
    const res = createMockResponse();

    (db.query as any).mockResolvedValueOnce([[]]); // no rows

    await loginUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("returns 400 when password is incorrect", async () => {
    const req = { body: { username: "justin", password: "wrong" } } as any;
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

    (db.query as any).mockResolvedValueOnce(userRow);
    (bcrypt.compare as any).mockResolvedValue(false);

    await loginUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Incorrect password" });
  });

  it("logs in user successfully", async () => {
    const req = { body: { username: "justin", password: "pass123" } } as any;
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

    (db.query as any).mockResolvedValueOnce(userRow);
    (bcrypt.compare as any).mockResolvedValue(true);

    await loginUser(req as any, res as any);

    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: "justin",
      userType: "client"
    });
  });

  it("returns 500 when DB fails", async () => {
    const req = { body: { username: "justin", password: "pass123" } } as any;
    const res = createMockResponse();

    (db.query as any).mockRejectedValue(new Error("DB failure"));

    await loginUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error"
    });
  });
});

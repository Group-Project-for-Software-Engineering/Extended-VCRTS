import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DB
vi.mock("../config/db", () => ({
    db: { query: vi.fn() }
}));

// Mock formatJob
vi.mock("../utils/formatJob", () => ({
    formatJob: vi.fn(job => ({ ...job, formatted: true }))
}));

import { db } from "../config/db";
import { formatJob } from "../models/Job";
import { getClientJobs } from "../controllers/clientController";

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

describe("getClientJobs", () => {
    it("returns formatted jobs for a client", async () => {
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

        await getClientJobs(req as any, res as any);

        expect(db.query).toHaveBeenCalledWith(
            "SELECT * FROM jobs WHERE clientId = ? ORDER BY timestamp DESC",
            ["10"]
        );
        expect(db.query).toHaveBeenCalledTimes(1);

        expect(res.json).toHaveBeenCalledWith([
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
        ]);
    });


    it("returns 500 when DB fails", async () => {
        const req = { params: { clientId: "10" } } as any;
        const res = mockRes();

        (db.query as any).mockRejectedValue(new Error("DB failure"));

        await getClientJobs(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error loading client jobs"
        });
    });
});

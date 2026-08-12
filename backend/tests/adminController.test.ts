import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------------------------------------
// Vitest mock MUST come immediately after Vitest import
vi.mock("../config/db", () => ({
    db: {
        query: vi.fn()
    }
}));

// --------------------------------------------------
// Now import everything else
import { Response } from "express";
import { adminCache } from "../cache/adminCache";
import { getAllUsers, computeCompletionTimes } from "../controllers/adminController";
import { db } from "../config/db";

// --------------------------------------------------

function createMockResponse(): Partial<Response> {
    return {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
    };
}

//--------------------------------------------------

beforeEach(() => {
    adminCache.users = null;
    adminCache.lastUpdated = null;
    vi.clearAllMocks();
});

//--------------------------------------------------

//Testing getAllUsers function 

// Case 1: Users are in the admin cache

it("returns cached users when cache is populated", async () => {
    const res = createMockResponse();

    adminCache.users = [
        {
            id: 1,
            username: "test",
            email: "test-email",
            userType: "Client",
            vehicles: [],
            jobs: []
        }
    ] as any;   // <-- this removes RowDataPacket enforcement


    await getAllUsers(res as Response); //function call from adminController

    expect(res.json).toHaveBeenCalledWith(adminCache.users);
    expect(db.query).not.toHaveBeenCalled();
});


// Case 2: Need to get users from database
it("queries the database when cache is not populated with users", async () => {
    const res = createMockResponse()

    adminCache.users = null

    const fakeUsers = [
        {
            id: 1,
            username: "db-user",
            email: "db-email",
            userType: "Client",
            vehicles: [],
            jobs: []
        }
    ]; //array of User types

    (db.query as any).mockResolvedValue([fakeUsers]);

    await getAllUsers(res as Response)

    expect(db.query).toHaveBeenCalledTimes(2) //once to get user, another to get jobs/vehicle
    expect(res.json).toHaveBeenCalledWith(fakeUsers)
    expect(adminCache.users).toEqual(fakeUsers)
});

//----------------------------------------------------

//Test for computeCompletionTime
it("calculates the completion time of all jobs in FIFO", async () => {
    const res = createMockResponse()

    //method only selects id and duration from database
    const fakeJobs = [
        {
            id: 1001,
            duration: 3
        },
        {
            id: 1002,
            duration: 2, 
        },
        {
            id: 1003,
            duration: 5, 
        }

    ]; //array of jobs

(db.query as any).mockResolvedValue([fakeJobs]);

await computeCompletionTimes(res as Response)

//this is the format of the array done in the function
const expected = [
    { jobId: 1001, completionTime: "3 hours" },
    { jobId: 1002, completionTime: "5 hours" },
    { jobId: 1003, completionTime: "10 hours" }
  ];


expect(db.query).toHaveBeenCalledTimes(1) 
expect(res.json).toHaveBeenCalledWith(expected)
});


//Test for retrieval failure
it("returns 500 when DB query fails", async () => {
  const res = createMockResponse();

  // Force DB failure
  (db.query as any).mockRejectedValue(new Error("DB failure"));

  await computeCompletionTimes(res as Response);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "Error computing completion times"
  });
});
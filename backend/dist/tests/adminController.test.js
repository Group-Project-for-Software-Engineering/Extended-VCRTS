"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// --------------------------------------------------
// Vitest mock MUST come immediately after Vitest import
vitest_1.vi.mock("../config/db", () => ({
    db: {
        query: vitest_1.vi.fn()
    }
}));
const adminCache_1 = require("../cache/adminCache");
const adminController_1 = require("../controllers/adminController");
const db_1 = require("../config/db");
// --------------------------------------------------
function createMockResponse() {
    return {
        json: vitest_1.vi.fn(),
        status: vitest_1.vi.fn().mockReturnThis()
    };
}
//--------------------------------------------------
(0, vitest_1.beforeEach)(() => {
    adminCache_1.adminCache.users = null;
    adminCache_1.adminCache.lastUpdated = null;
    vitest_1.vi.clearAllMocks();
});
//--------------------------------------------------
//Testing getAllUsers function 
// Case 1: Users are in the admin cache
(0, vitest_1.it)("returns cached users when cache is populated", async () => {
    const res = createMockResponse();
    adminCache_1.adminCache.users = [
        {
            id: 1,
            username: "test",
            email: "test-email",
            userType: "Client",
            vehicles: [],
            jobs: []
        }
    ]; // <-- this removes RowDataPacket enforcement
    await (0, adminController_1.getAllUsers)(res); //function call from adminController
    (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(adminCache_1.adminCache.users);
    (0, vitest_1.expect)(db_1.db.query).not.toHaveBeenCalled();
});
// Case 2: Need to get users from database
(0, vitest_1.it)("queries the database when cache is not populated with users", async () => {
    const res = createMockResponse();
    adminCache_1.adminCache.users = null;
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
    db_1.db.query.mockResolvedValue([fakeUsers]);
    await (0, adminController_1.getAllUsers)(res);
    (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(2); //once to get user, another to get jobs/vehicle
    (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(fakeUsers);
    (0, vitest_1.expect)(adminCache_1.adminCache.users).toEqual(fakeUsers);
});
//----------------------------------------------------
//Test for computeCompletionTime
(0, vitest_1.it)("calculates the completion time of all jobs in FIFO", async () => {
    const res = createMockResponse();
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
    db_1.db.query.mockResolvedValue([fakeJobs]);
    await (0, adminController_1.computeCompletionTimes)(res);
    //this is the format of the array done in the function
    const expected = [
        { jobId: 1001, completionTime: "3 hours" },
        { jobId: 1002, completionTime: "5 hours" },
        { jobId: 1003, completionTime: "10 hours" }
    ];
    (0, vitest_1.expect)(db_1.db.query).toHaveBeenCalledTimes(1);
    (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(expected);
});
//Test for retrieval failure
(0, vitest_1.it)("returns 500 when DB query fails", async () => {
    const res = createMockResponse();
    // Force DB failure
    db_1.db.query.mockRejectedValue(new Error("DB failure"));
    await (0, adminController_1.computeCompletionTimes)(res);
    (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
    (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
        message: "Error computing completion times"
    });
});

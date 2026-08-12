import { db } from "../config/db";
import { adminCache } from "../cache/adminCache";
import { Response } from "express";
import { User } from "../models/User"
import { Vehicle } from "../models/Vehicle"
import { Job } from "../models/Job"
//------------------------------------------------------------------------------
//Api function implementation for admin home page

//Get all users in the system
export async function getAllUsers(res: Response) {

  //check cache first before querying database
  try {
    // 1. Return cached data if available
    if (adminCache.users) {
      return res.json(adminCache.users);
    }

    // 2. Otherwise query DB
    const [users] = await db.query<User[]>("SELECT * FROM users");

    for (let user of users) {
      //if user is owner type
      if (user.userType === "Owner") {
        const [vehicles] = await db.query<Vehicle[]>(
          "SELECT * FROM vehicles WHERE ownerId = ?",
          [user.id]
        );
        user.vehicles = vehicles;
      } else if (user.userType === "Client") { //if user is client type
        const [jobs] = await db.query<Job[]>(
          "SELECT * FROM jobs WHERE clientId = ?",
          [user.id]
        );
        user.jobs = jobs;
      }
    }

    // 3. Save to cache
    adminCache.users = users;
    adminCache.lastUpdated = Date.now();

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading users" });
  }
}
//-------------------------------------------------------------

//Api call implementation of admin home page completion time button
//Current implementation of completion time uses FIFO algorithm
export async function computeCompletionTimes(res: Response) {
  try {
    const [jobs] = await db.query<Job[]>(
      "SELECT id, duration FROM jobs ORDER BY timestamp ASC"
    );

    let currentTime = 0;
    const results = [];

    //Fifo algorithm
    for (let job of jobs) {
      currentTime += parseFloat(job.duration.toString().trim());
      results.push({
        jobId: job.id,
        completionTime: `${currentTime} hours`
      });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error computing completion times" });
  }
}

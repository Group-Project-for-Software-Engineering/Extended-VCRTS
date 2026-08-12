import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { Vehicle } from "../models/Vehicle"
import { Job } from "../models/Job"
dotenv.config();
//------------------------------------------------------------------------------
//Implementation of functions for vehicle simulation

// Read vehicleId from command line
const vehicleId: String = process.argv[2]?.split("=")[1];
if (!vehicleId) {
  console.error("Error: You must run with --vehicleId=X");
  process.exit(1);
}
//---------------------------------------------------

// DB connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
});
//------------------------------------------------------------------------------

console.log(`Vehicle Node ${vehicleId} started`);

// Simulate random latency (50–300ms)
function simulateLatency() {
  const delay = Math.floor(Math.random() * 250) + 50;
  return new Promise(res => setTimeout(res, delay));
}
//------------------------------------------------------------------------------

// Simulate random failure (5% chance)
function maybeFail() {
  if (Math.random() < 0.05) {
    console.log(`Vehicle ${vehicleId} FAILED`);
    process.exit(1);
  }
}
//------------------------------------------------------------------------------

async function sendHeartbeat() {
  await db.query(
    `REPLACE INTO vehicle_heartbeats (vehicleId, lastHeartbeat)
     VALUES (?, NOW())`,
    [vehicleId]
  );
}
//------------------------------------------------------------------------------

// Main loop: check for assigned jobs
async function workLoop() {
  try {
    // Look for jobs assigned to this vehicle
    const [jobs] = await db.query<Job[]>(
      "SELECT * FROM jobs WHERE assignedVehicleId = ? AND status = 'assigned'",
      [vehicleId]
    );

    if (jobs.length > 0) {
      const job = jobs[0];
      console.log(`Vehicle ${vehicleId} executing job ${job.id}`);

      // Mark job as in progress
      await db.query(
        "UPDATE jobs SET status = 'in_progress' WHERE id = ?",
        [job.id]
      );

      // Simulate latency + execution time
      await simulateLatency();
      await new Promise(res => setTimeout(res, job.duration * 100)); // duration scaled down

      maybeFail(); // random failure

      // Mark job as completed
      await db.query(
        "UPDATE jobs SET status = 'completed' WHERE id = ?",
        [job.id]
      );

      console.log(`Vehicle ${vehicleId} completed job ${job.id}`);
    }

  } catch (err) {
    console.error("Vehicle error:", err);
  }

  // Loop every second
  setTimeout(workLoop, 1000);
}

workLoop();
setInterval(sendHeartbeat, 2000); // every 2 seconds

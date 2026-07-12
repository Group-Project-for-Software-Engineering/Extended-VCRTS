import mysql from "mysql2/promise";
//------------------------------------------------------------------------------
//Implementation of functions to automatically take a job in the system and attach it to a vehicle. (for simulations)

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "jc_cus200526",
    database: "vcrts2"
});

console.log("📡 Scheduler started");
//-------------------------------------------------------------

// Simple round-robin index
let rrIndex = 0;

async function assignJobs() {
    try {
        // 1. Get all pending jobs
        const [pendingJobs] = await db.query(
            "SELECT * FROM jobs WHERE status = 'pending'"
        );

        if (pendingJobs.length === 0) {
            return; // nothing to assign
        }

        // 2. Get all vehicles
        const [vehicles] = await db.query("SELECT id FROM vehicles");

        if (vehicles.length === 0) {
            console.log("⚠️ No vehicles available");
            return;
        }

        // 3. Assign each pending job to a vehicle (round-robin)
        for (let job of pendingJobs) {
            const vehicle = vehicles[rrIndex % vehicles.length];
            rrIndex++;

            await db.query(
                "UPDATE jobs SET assignedVehicleId = ?, status = 'assigned' WHERE id = ?",
                [vehicle.id, job.id]
            );

            console.log(
                `📌 Assigned job ${job.id} → vehicle ${vehicle.id}`
            );
        }

    } catch (err) {
        console.error("Scheduler error:", err);
    }
}
//----------------------------------------------------------------

async function detectFailures() {
  const [rows] = await db.query(`
    SELECT vehicleId, lastHeartbeat
    FROM vehicle_heartbeats
  `);

  const now = Date.now();

  for (let row of rows) {
    const last = new Date(row.lastHeartbeat).getTime();
    const diff = now - last;

    if (diff > 5000) { // 5 seconds without heartbeat
      console.log(`❌ Vehicle ${row.vehicleId} FAILED`);

      // Reassign jobs from this vehicle
      await db.query(
        `UPDATE jobs
         SET status = 'pending', assignedVehicleId = NULL
         WHERE assignedVehicleId = ? AND status IN ('assigned', 'in_progress')`,
        [row.vehicleId]
      );
    }
  }
}

setInterval(() => {
  assignJobs();
  detectFailures();
}, 3000);

import mysql from "mysql2/promise";

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "jc_cus200526",
    database: "vcrts2"
});

console.log("📡 Scheduler started");

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

// Run every 3 seconds
setInterval(assignJobs, 3000);

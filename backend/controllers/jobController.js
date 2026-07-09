import { db } from "../config/db.js";

// CLIENT SUBMITS A JOB → goes into pending_jobs
export async function submitJob(req, res) {
  const { clientId, description, duration, deadline } = req.body;

  try {
    await db.query(
      `INSERT INTO pending_jobs 
       (clientId, description, duration, deadline)
       VALUES (?, ?, ?, ?)`,
      [clientId, description, duration, deadline]
    );

    // Notify admin (adminId = 4)
    await db.query(
      `INSERT INTO notifications (userId, message)
       VALUES (?, ?)`,
      [4, `New job pending approval from client ${clientId}`]
    );

    res.json({ message: "Job submitted for approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error submitting job" });
  }
}

// CLIENT HOME PAGE → fetch approved jobs
export async function getJobsByClient(req, res) {
  const { clientId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM jobs WHERE clientId=?",
      [clientId]
    );
    res.json(rows.map(formatJob));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading jobs" });
  }
}

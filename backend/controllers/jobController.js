import { db } from "../config/db.js";

export async function submitJob(req, res) {
  const { clientId, description, duration, deadline } = req.body;

  try {
    // Insert into pending jobs
    await db.query(
      `INSERT INTO pending_jobs 
       (clientId, description, duration, deadline)
       VALUES (?, ?, ?, ?)`,
      [clientId, description, duration, deadline]
    );

    // Notify admin
    await db.query(
      `INSERT INTO notifications (userId, message)
       VALUES (?, ?)`,
      [1, `New job pending approval from client ${clientId}`]
    );

    res.json({ message: "Job submitted for approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error submitting job" });
  }
}

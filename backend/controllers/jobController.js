import { db } from "../config/db.js";
import { adminCache } from "../cache/adminCache.js";

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
      [4, `New job pending approval from client ${clientId}`] //admin id = 4
    );

    res.json({ message: "Job submitted for approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error submitting job" });
  }
}

export async function approveJob(req, res) {
  const { jobId } = req.body;

  await db.query("UPDATE pending_jobs SET status='approved' WHERE id=?", [jobId]);

  // Insert into jobs table...

  // Invalidate cache
  adminCache.users = null;

  res.json({ message: "Job approved" });
}

export async function rejectJob(req, res) {
  const { jobId } = req.body;

  // Remove from pending table
  await db.query(
    "DELETE FROM pending_jobs WHERE id=?",
    [jobId]
  );

  // Invalidate admin cache
  adminCache.users = null;

  res.json({ message: "Job rejected" });
}
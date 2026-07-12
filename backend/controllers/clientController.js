import { db } from "../config/db.js";
import { formatJob } from "../models/Job.js";
//------------------------------------------------------------------------------
//API implementation of client functions
//SEEMS TO BE REDUNDANT. TO BE REMOVED PENDING REVIEW

//retrieve all jobs belonging to the current client logged in
export async function getClientJobs(req, res) {
  try {
    const { clientId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM jobs WHERE clientId = ? ORDER BY timestamp DESC",
      [clientId]
    );

    const jobs = rows.map(formatJob);

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading client jobs" });
  }
}

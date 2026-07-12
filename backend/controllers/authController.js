import bcrypt from "bcrypt";
import { db } from "../config/db.js";
//------------------------------------------------------------------------------
//Implementation of registration page functions

// Regsiter a new account for owner or client
export async function registerUser(req, res) {
  try {
    const { username, password, userType } = req.body;

    if (!username || !password || !userType) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, password, userType)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [username, hashed, userType]);

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
}
//--------------------------------------------------------

// login a user into the application
export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE username = ?`;

    const [rows] = await db.query(sql, [username]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({
      id: user.id,
      username: user.username,
      userType: user.userType
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

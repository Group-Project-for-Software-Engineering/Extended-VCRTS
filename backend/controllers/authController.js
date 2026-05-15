import bcrypt from "bcrypt";
import { db } from "../config/db.js";

// REGISTER
export async function registerUser(req, res) {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (username, password, userType)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [username, hashed, userType], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Registration failed" });
    }
    res.json({ message: "User registered successfully" });
  });
}

// LOGIN
export async function loginUser(req, res) {
  const { username, password } = req.body;

  const sql = `SELECT * FROM users WHERE username = ?`;

  db.query(sql, [username], async (err, rows) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    res.json({
      id: user.id,
      username: user.username,
      userType: user.userType
    });
  });
}

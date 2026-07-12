import { db } from "../config/db.js";
//------------------------------------------------------------------------------
//Implementation for functions on login screen

//login for a given user (authentication)
export async function login(req, res) {
  const { username, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );

  if (rows.length === 0)
    return res.status(400).json({ message: "Invalid username or password" });

  res.json({
    message: "Login successful",
    userType: rows[0].userType
  });
}
//----------------------------------------------------

//register a new account
export async function register(req, res) {
  const { username, email, password, userType } = req.body;

  const [exists] = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (exists.length > 0)
    return res.status(400).json({ message: "Username already exists" });

  await db.query(
    "INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)",
    [username, email, password, userType]
  );

  res.json({ message: "User created" });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
const db_1 = require("../config/db");
//------------------------------------------------------------------------------
//Implementation for functions on login screen
//login for a given user (authentication)
async function login(req, res) {
    const { username, password } = req.body;
    const [rows] = await db_1.db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
    if (rows.length === 0)
        return res.status(400).json({ message: "Invalid username or password" });
    res.json({
        message: "Login successful",
        userType: rows[0].userType
    });
}
//----------------------------------------------------
//register a new account
async function register(req, res) {
    const { username, email, password, userType } = req.body;
    const [exists] = await db_1.db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (exists.length > 0)
        return res.status(400).json({ message: "Username already exists" });
    await db_1.db.query("INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)", [username, email, password, userType]);
    res.json({ message: "User created" });
}

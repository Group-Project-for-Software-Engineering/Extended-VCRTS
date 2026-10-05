"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
//------------------------------------------------------------------------------
//Implementation of registration page functions
// Regsiter a new account for owner or client
async function registerUser(req, res) {
    try {
        const { username, password, userType } = req.body;
        if (!username || !password || !userType) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const sql = `
      INSERT INTO users (username, password, userType)
      VALUES (?, ?, ?)
    `;
        const [result] = await db_1.db.query(sql, [username, hashed, userType]);
        res.json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Registration failed" });
    }
}
//--------------------------------------------------------
// login a user into the application
async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        const sql = `SELECT * FROM users WHERE username = ?`;
        const [rows] = await db_1.db.query(sql, [username]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        const user = rows[0];
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        res.json({
            id: user.id,
            username: user.username,
            userType: user.userType
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

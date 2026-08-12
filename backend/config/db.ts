import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
//------------------------------------------------------------------------------
//Connect to the database. At the moment it is a locally hosted database

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT!)
});

export const db = pool;
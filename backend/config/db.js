import mysql from "mysql2/promise";
//------------------------------------------------------------------------------
//Connect to the database. At the moment it is a locally hosted database

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "jc_cus200526",
  database: "vcrts2"
});

export const db = pool;
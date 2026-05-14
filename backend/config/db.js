import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "jc_cus200526",
  database: "vcrts"
});

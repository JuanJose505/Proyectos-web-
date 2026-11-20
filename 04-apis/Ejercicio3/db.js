import mysql from "mysql2/promise";
import "dotenv/config";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "tienda",
});
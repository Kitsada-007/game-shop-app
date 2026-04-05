import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
// Create a connection pool to the MySQL database
export const conn = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
});


// server/quick-test-db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

(async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 1,
    });
    const [rows] = await pool.query('SELECT 1 + 1 AS sum;');
    console.log('DB Connection OK:', rows);
    await pool.end();
  } catch (err) {
    console.error('DB connection failed (quick-test-db):', err);
  }
  process.exit();
})();

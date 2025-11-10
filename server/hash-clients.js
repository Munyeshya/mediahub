// server/scripts/hash-clients.js
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'mediahub';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3307;

async function main() {
  const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    // Choose the plaintext password clients will get
    const PLAINTEXT_PASSWORD = 'clientpass123'; // <-- change this if you want

    console.log('Fetching clients...');
    const [rows] = await pool.query('SELECT client_id, email FROM Client');

    if (!rows.length) {
      console.log('No client rows found. Exiting.');
      return;
    }

    console.log(`Found ${rows.length} clients. Hashing password and updating DB...`);
    for (const r of rows) {
      const hash = await bcrypt.hash(PLAINTEXT_PASSWORD, 10);
      await pool.query('UPDATE Client SET password_hash = ? WHERE client_id = ?', [hash, r.client_id]);
      console.log(`Updated client_id=${r.client_id} (${r.email})`);
    }

    console.log('All client passwords updated.');
    console.log(`They can all log in with: ${PLAINTEXT_PASSWORD}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();

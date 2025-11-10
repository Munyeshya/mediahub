// server/scripts/hash-clients.js
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function hashClientPasswords() {
  try {
    const [clients] = await pool.query("SELECT client_id, email, password_hash FROM client");

    for (const client of clients) {
      // Skip already hashed ones
      if (client.password_hash.startsWith("$2b$")) {
        console.log(`Skipping already hashed client: ${client.email}`);
        continue;
      }

      const plainPassword = {
        "alice@gmail.com": "alice123",
        "bob@gmail.com": "bob123",
        "carol@gmail.com": "carol123",
        "daniel@gmail.com": "daniel123",
        "emmy@gmail.com": "emmy123",
        "frank@gmail.com": "frank123",
        "gina@gmail.com": "gina123"
      }[client.email] || "default123";

      const newHash = await bcrypt.hash(plainPassword, 10);
      await pool.query("UPDATE client SET password_hash = ? WHERE client_id = ?", [
        newHash,
        client.client_id,
      ]);

      console.log(`✅ Updated password for: ${client.email}`);
    }

    console.log("🎉 All client passwords are now hashed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error hashing passwords:", err);
    process.exit(1);
  }
}

hashClientPasswords();

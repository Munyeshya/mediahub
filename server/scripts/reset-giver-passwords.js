// server/scripts/reset-giver-passwords.js
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- Setup paths and env ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// --- Database connection ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

// --- Define passwords for each giver ---
const passwordMap = {
  "john.photo@mediahub.com": "john123",
  "grace.video@mediahub.com": "grace123",
  "patrick.design@mediahub.com": "patrick123",
  "olivier.music@mediahub.com": "olivier123",
  "keza.rental@mediahub.com": "keza123",
  "emile.photo@mediahub.com": "emile123",
  "amina.video@mediahub.com": "amina123",
  "paul.design@mediahub.com": "paul123",
  "sarah.photo@mediahub.com": "sarah123",
  "marc.video@mediahub.com": "marc123",
};

async function resetGiverPasswords() {
  try {
    const [givers] = await pool.query("SELECT giver_id, email FROM service_giver");

    for (const giver of givers) {
      const newPassword = passwordMap[giver.email] || "default123";
      const newHash = await bcrypt.hash(newPassword, 10);

      await pool.query(
        "UPDATE service_giver SET password_hash = ? WHERE giver_id = ?",
        [newHash, giver.giver_id]
      );

      console.log(`✅ Updated ${giver.email} → password: ${newPassword}`);
    }

    console.log("🎉 All giver passwords successfully reset and hashed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error resetting giver passwords:", err);
    process.exit(1);
  }
}

resetGiverPasswords();
